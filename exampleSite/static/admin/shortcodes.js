/*
 * Editor components per gli shortcode del tema geeky-hugo — versione Sveltia CMS.
 *
 * Stessa API di Decap CMS (Sveltia è compatibile "drop-in" su questo punto):
 * https://sveltiacms.app/en/docs/api/editor-components
 *
 * Cosa fanno: trasformano uno shortcode Hugo (es. {{< image src="..." >}}) in un blocco
 * con un FORM nell'editor, invece di dover scrivere la sintassi a mano. Il blocco:
 *  - viene inserito dal pulsante "+" della toolbar dell'editor (in modalità "Rich Text"),
 *  - riconosce (fromBlock) gli shortcode già scritti nei post esistenti che rispettano il
 *    pattern indicato, mostrandoli come blocco modificabile invece che testo grezzo,
 *  - serializza (toBlock) sempre nello stesso formato canonico quando si salva.
 *
 * Differenza nota rispetto alla versione Decap di questo stesso file: in Sveltia la
 * preview (toPreview) dei blocchi custom non è ancora renderizzata nel pannello di
 * anteprima (funzionalità non ancora implementata, prevista prima della 1.0) — il resto
 * si comporta allo stesso modo, incluso il riconoscimento degli shortcode esistenti.
 *
 * Limiti noti (accettabili per un primo giro, non bloccanti):
 *  - il riconoscimento di shortcode scritti a mano con sintassi "sporca" (es. virgolette
 *    annidate non escapate in alcuni vecchi extLink) può fallire: in quel caso restano
 *    semplicemente testo grezzo modificabile a mano, senza rompere nulla;
 *  - qui sono coperti i 5 shortcode con sintassi più regolare (image, extLink, youtube2,
 *    button, carousel). Altri (gmap, omap, card, chart, ...) restano da fare seguendo lo
 *    stesso schema, una volta validato che questo approccio funziona nell'uso reale.
 */

/** Estrae attributi key="value" da una stringa, in qualsiasi ordine. */
function parseAttrs(str) {
  const attrs = {};
  const re = /(\w+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

// Stile del "boxetino" di anteprima nel blocco editor, condiviso da indice e leggi-anche
// qui sotto — stessa estetica (bordo tratteggiato) del placeholder che preview.js usa per
// l'indice nel pannello laterale. NOTA: in Sveltia toPreview non viene ancora renderizzato
// dentro l'editor (limite noto, vedi testata del file) — questo codice è corretto e pronto,
// ma visibile solo quando/se Sveltia lo implementerà (o già oggi sul branch Decap gemello).
const PREVIEW_BOX_STYLE = 'border:1px dashed #999;padding:.75rem;border-radius:6px';

/** "mio-slug-di-esempio" -> "Mio Slug Di Esempio" — approssimazione leggibile dello slug,
 * NON il titolo vero recuperato dal server (toPreview è sincrono, non può fare fetch):
 * il titolo vero e l'immagine reale si vedono nel pannello di anteprima laterale (preview.js,
 * che invece fa il fetch della pagina pubblicata). */
function humanizeSlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// image — {{< image src="..." alt="..." caption="..." p="center" >}}
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'image-shortcode',
  label: '🖼️ Immagine (shortcode)',
  fields: [
    {
      name: 'src',
      label: 'Immagine (carica su Cloudinary o incolla un URL)',
      widget: 'image',
      // cloud_name/api_key DUPLICATI qui, non solo "folder": un override media_library a
      // livello di campo NON viene unito a quello globale (confermato leggendo il bundle
      // vero di Sveltia — vedi stessa nota su config.yml, campo Copertina) — senza,
      // Cloudinary risulta "non configurato" per QUESTO campo e mostra solo i provider
      // stock di default. output_filename_only NON impostato: eredita false (URL
      // completo), che è quello che image.html si aspetta (fa hasPrefix "http").
      media_library: {
        config: { cloud_name: 'ilgattodicitturin', api_key: 373883797928475, folder: 'articoli' },
      },
    },
    { name: 'alt', label: 'Testo alternativo (SEO/accessibilità)', widget: 'string', required: false },
    { name: 'caption', label: 'Didascalia', widget: 'string', required: false },
    {
      name: 'p',
      label: 'Posizione',
      widget: 'select',
      required: false,
      options: ['center', 'left', 'right', 'float-left', 'float-right'],
      default: 'center',
    },
  ],
  pattern: /^{{<\s*image\s+([\s\S]*?)\s*>}}$/m,
  fromBlock: (match) => parseAttrs(match[1]),
  toBlock: (data) => {
    const parts = ['src', 'alt', 'caption', 'p']
      .filter((k) => data[k])
      .map((k) => `${k}="${data[k]}"`);
    return `{{< image ${parts.join(' ')} >}}`;
  },
  toPreview: (data) =>
    `<figure style="max-width:100%"><img src="${data.src || ''}" alt="${data.alt || ''}" style="max-width:100%"/>${
      data.caption ? `<figcaption>${data.caption}</figcaption>` : ''
    }</figure>`,
});

// ---------------------------------------------------------------------------
// extLink — {{< extLink "testo" "url" "title" >}}   (title opzionale)
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'extlink-shortcode',
  label: '🔗 Link esterno (shortcode)',
  fields: [
    { name: 'text', label: 'Testo del link', widget: 'string' },
    { name: 'url', label: 'URL', widget: 'string' },
    { name: 'title', label: 'Title (tooltip, opzionale)', widget: 'string', required: false },
  ],
  pattern: /^{{<\s*extLink\s+"([^"]*)"\s+"([^"]*)"(?:\s+"([^"]*)")?\s*>}}$/m,
  fromBlock: (match) => ({ text: match[1], url: match[2], title: match[3] || '' }),
  toBlock: (data) =>
    `{{< extLink "${data.text || ''}" "${data.url || ''}"${data.title ? ` "${data.title}"` : ''} >}}`,
  toPreview: (data) => `<a href="${data.url || '#'}" target="_blank">${data.text || ''} ↗</a>`,
});

// ---------------------------------------------------------------------------
// youtube2 — {{< youtube2 "videoID" "titolo" >}}   (titolo opzionale)
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'youtube-shortcode',
  label: '▶️ Video YouTube (shortcode)',
  fields: [
    { name: 'videoID', label: 'ID video (o ID?param=...)', widget: 'string' },
    { name: 'title', label: 'Titolo/didascalia (opzionale)', widget: 'string', required: false },
  ],
  // Il video ID nel contenuto reale è quasi sempre SENZA virgolette (221 casi su 294:
  // {{< youtube2 VBb-Zza0oUs >}}), le virgolette sono la minoranza — pattern tollerante
  // a entrambe le forme, "?...? opzionali intorno all'id.
  pattern: /^{{<\s*youtube2\s+"?([^"\s>]+)"?(?:\s+"([^"]*)")?\s*>}}$/m,
  fromBlock: (match) => ({ videoID: match[1], title: match[2] || '' }),
  toBlock: (data) => `{{< youtube2 "${data.videoID || ''}"${data.title ? ` "${data.title}"` : ''} >}}`,
  toPreview: (data) =>
    `<div>▶️ YouTube: <code>${data.videoID || ''}</code>${data.title ? ` — ${data.title}` : ''}</div>`,
});

// ---------------------------------------------------------------------------
// button — {{< button "etichetta" "url" >}}
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'button-shortcode',
  label: '🔘 Pulsante (shortcode)',
  fields: [
    { name: 'label', label: 'Etichetta', widget: 'string' },
    { name: 'url', label: 'URL (interno o esterno)', widget: 'string' },
  ],
  pattern: /^{{<\s*button\s+"([^"]*)"\s+"([^"]*)"\s*>}}$/m,
  fromBlock: (match) => ({ label: match[1], url: match[2] }),
  toBlock: (data) => `{{< button "${data.label || ''}" "${data.url || ''}" >}}`,
  toPreview: (data) =>
    `<span style="display:inline-block;padding:.5rem 1rem;background:#0d6efd;color:#fff;border-radius:.25rem">${
      data.label || ''
    }</span>`,
});

// ---------------------------------------------------------------------------
// carousel — {{< carousel images="id1,id2,id3" >}}
// Le immagini sono un campo "list": si aggiungono/riordinano via drag&drop nel form.
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'carousel-shortcode',
  label: '🖼️🖼️ Galleria Cloudinary (shortcode)',
  fields: [
    {
      name: 'images',
      label: 'Immagini (carica su Cloudinary, riordinabili trascinandole)',
      widget: 'list',
      field: {
        label: 'Immagine',
        name: 'id',
        widget: 'image',
        // A differenza del campo "src" di image-shortcode qui serve il PUBLIC ID nudo
        // (con eventuale prefisso cartella, es. "articoli/foo"), non l'URL completo:
        // è quello che carousel.html passa a Cloudinary come publicId (vedi
        // cloudinary.galleryWidget -> mediaAssets). cloud_name/api_key duplicati qui per
        // lo stesso motivo del campo Copertina/image-shortcode (override di campo non
        // unito al globale, altrimenti Cloudinary risulta "non configurato" qui).
        media_library: {
          config: { cloud_name: 'ilgattodicitturin', api_key: 373883797928475, folder: 'articoli' },
          output_filename_only: true,
        },
      },
    },
  ],
  pattern: /^{{<\s*carousel\s+images="([^"]*)"\s*>}}$/m,
  fromBlock: (match) => ({
    images: match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((id) => ({ id })),
  }),
  toBlock: (data) => `{{< carousel images="${(data.images || []).map((i) => i.id).join(',')}" >}}`,
  toPreview: (data) => `<div>🖼️ Galleria: ${(data.images || []).length} immagini</div>`,
});

// ---------------------------------------------------------------------------
// indice — {{< indice >}}   (nessun parametro: genera da solo il sommario dai titoli ##-#####)
// Il più usato in assoluto tra quelli non ancora coperti (117 articoli).
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'indice-shortcode',
  label: '📑 Indice/sommario (shortcode)',
  fields: [],
  pattern: /^{{<\s*indice\s*>}}$/m,
  fromBlock: () => ({}),
  toBlock: () => `{{< indice >}}`,
  toPreview: () =>
    `<div style="${PREVIEW_BOX_STYLE}"><em>📑 Indice — generato automaticamente in pubblicazione dai titoli dell'articolo</em></div>`,
});

// ---------------------------------------------------------------------------
// gmap — {{< gmap "url-embed" >}}  oppure {{< gmap "url-embed" "1" >}}
// Il secondo argomento "1" aggiunge un paragrafo fisso di disclaimer sulle mappe (56 articoli).
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'gmap-shortcode',
  label: '🗺️ Mappa Google (shortcode)',
  fields: [
    { name: 'url', label: 'URL embed (Google My Maps → Condividi → Incorpora mappa)', widget: 'string' },
    {
      name: 'note',
      label: 'Aggiungi il paragrafo di disclaimer sugli spot (link download offline + avviso)',
      widget: 'boolean',
      default: false,
    },
  ],
  pattern: /^{{<\s*gmap\s+"([^"]*)"(?:\s+"(1)")?\s*>}}$/m,
  fromBlock: (match) => ({ url: match[1], note: match[2] === '1' }),
  toBlock: (data) => `{{< gmap "${data.url || ''}"${data.note ? ' "1"' : ''} >}}`,
  toPreview: (data) => `<div>🗺️ Mappa: <code>${data.url || ''}</code></div>`,
});

// ---------------------------------------------------------------------------
// leggi-anche — {{< leggi-anche >}} (articolo scelto a caso in build, stessa
// categoria/paese) oppure {{< leggi-anche url="/blog/slug-articolo" >}} (fisso).
//
// Campo "relation": box di ricerca nativo del CMS, cerca per titolo nella collection
// e non richiede di conoscere lo slug a memoria — il campo può restare vuoto ("può
// essere nullo"), nel qual caso l'articolo viene scelto automaticamente in pubblicazione.
//
// Un componente per lingua perché il target di ricerca (collection) è diverso —
// registrato solo sulla collection corrispondente in config.yml, non su entrambe.
//
// Limite noto: il valore salvato è lo slug DEL FILE (variabile nativa {{slug}} del
// CMS), non l'eventuale campo "slug" personalizzato in frontmatter che sovrascrive
// l'URL pubblicato (vedi nota su blog_en in config.yml — quasi tutti gli articoli EN
// ne hanno uno diverso dal nome file). Per un target con slug personalizzato il link
// generato punterà al posto sbagliato: verificare comparando con l'URL pubblicato
// reale e correggere a mano in modalità markdown grezzo se necessario.
// ---------------------------------------------------------------------------
function leggiAncheComponent(targetCollection) {
  return {
    id: `leggianche-${targetCollection}-shortcode`,
    label: '🔗 Leggi anche (shortcode)',
    fields: [
      {
        name: 'target',
        label: 'Articolo da collegare (cerca per titolo, lascia vuoto per sceglierlo automaticamente in pubblicazione)',
        widget: 'relation',
        collection: targetCollection,
        search_fields: ['title'],
        display_fields: ['title'],
        value_field: '{{slug}}',
        required: false,
      },
    ],
    pattern: /^{{<\s*leggi-anche(?:\s+url="\/blog\/([^"]*)")?\s*>}}$/m,
    fromBlock: (match) => ({ target: match[1] || '' }),
    toBlock: (data) => (data.target ? `{{< leggi-anche url="/blog/${data.target}" >}}` : `{{< leggi-anche >}}`),
    // "Boxetino" come indice qui sopra. Il titolo mostrato è una versione leggibile dello
    // SLUG salvato (humanizeSlug), non il vero titolo dell'articolo: toPreview è sincrono
    // e non può fare fetch, quindi non ha accesso al titolo reale (solo al value_field
    // "{{slug}}" del campo relation). Il vero titolo + immagine si vedono nell'anteprima
    // laterale (preview.js -> hydrateLeggiAnche, che fa il fetch della pagina pubblicata).
    // Se non è impostato nessun articolo, testo di default come richiesto: "scelto a caso".
    toPreview: (data) =>
      `<div style="${PREVIEW_BOX_STYLE}"><em>🔗 Leggi anche: ${
        data.target ? humanizeSlug(data.target) : 'scelto a caso'
      }</em></div>`,
  };
}

CMS.registerEditorComponent(leggiAncheComponent('blog_it'));
CMS.registerEditorComponent(leggiAncheComponent('blog_en'));

// ---------------------------------------------------------------------------
// sponsor — box affiliato/sponsorizzato, stesso markup CSS di leggi-anche più
// screenshot automatico (via microlink.io) e un disclaimer sotto che cambia testo
// in base a "type" (vedi themes/geeky-hugo/.../shortcodes/sponsor.html e i18n/*.toml
// per "link affiliato"/"affiliate link" = disclaimer affiliato, qualsiasi altro
// valore = disclaimer "sponsorizzato"). Sintassi reale multi-riga, es.:
//   {{< sponsor
//       url="..."
//       title="..."
//       description="..."
//       type="link affiliato"
//       disclaimer="true"
//   >}}
// Un componente generico (qualsiasi sponsor) + due preset "Heymondo" (uno per
// collection, perché il valore di "type" corretto per il disclaimer differisce
// per lingua) che precompilano url/titolo/tipo — link riusato uguale in 11
// articoli finora sempre scritto a mano con extLink, mai col box sponsor.
// ---------------------------------------------------------------------------
const SPONSOR_PATTERN = /^{{<\s*sponsor\s+([\s\S]*?)\s*>}}$/m;
const HEYMONDO_URL = 'https://tinyurl.com/VandipetyAssicurazione';
// Lookahead che richiede la presenza dell'URL Heymondo nel blob attributi, PRIMA del
// gruppo di cattura vero e proprio (identico a SPONSOR_PATTERN) — serve a far sì che
// SOLO i blocchi che linkano già Heymondo vengano riconosciuti come questo preset
// quando Sveltia rilegge un articolo esistente; qualunque altro sponsor (Japan
// Wireless, Klook, ...) resta di competenza del componente generico sotto. Per questo
// i preset vanno registrati PRIMA del generico: il primo pattern che fa match vince.
const HEYMONDO_PATTERN = /^{{<\s*sponsor\s+(?=[\s\S]*?url="https:\/\/tinyurl\.com\/VandipetyAssicurazione")([\s\S]*?)\s*>}}$/m;

function sponsorFields(defaults) {
  const d = defaults || {};
  return [
    { name: 'url', label: 'URL destinazione', widget: 'string', default: d.url },
    { name: 'title', label: 'Titolo (nome sponsor/prodotto)', widget: 'string', default: d.title },
    { name: 'description', label: 'Descrizione breve (opzionale)', widget: 'string', required: false, default: d.description },
    {
      name: 'type',
      label: 'Tipo (cambia il testo del disclaimer sotto al box — vedi sponsor.html)',
      widget: 'select',
      options: ['link affiliato', 'affiliate link', 'sponsorizzato', 'sponsored'],
      default: d.type || 'link affiliato',
    },
    {
      name: 'disclaimer',
      label: 'Mostra il paragrafo di disclaimer sotto al box',
      widget: 'boolean',
      default: d.disclaimer !== false,
    },
  ];
}

function sponsorFromBlock(match) {
  const a = parseAttrs(match[1]);
  return {
    url: a.url || '',
    title: a.title || '',
    description: a.description || '',
    // Fedele all'originale: type="" esiste davvero nel sito (1 articolo, box
    // "sponsorizzato" non affiliato) e NON va forzato a "link affiliato" solo perché
    // il campo è vuoto — sponsor.html tratta "qualunque valore diverso da link
    // affiliato/affiliate link" come sponsorizzato, quindi svuotarlo qui cambierebbe
    // il testo del disclaimer al primo risalvataggio. "link affiliato" resta il
    // default SOLO per i blocchi nuovi (vedi sponsorFields), non per quelli letti.
    type: a.type || '',
    disclaimer: a.disclaimer !== 'false', // assente o "true" -> true, solo "false" esplicito -> false
  };
}

function sponsorToBlock(data) {
  const lines = ['url', 'title', 'description', 'type']
    .filter((k) => data[k])
    .map((k) => `    ${k}="${data[k]}"`);
  lines.push(`    disclaimer="${data.disclaimer === false ? 'false' : 'true'}"`);
  return `{{< sponsor \n${lines.join('\n')}\n>}}`;
}

function sponsorToPreview(data) {
  return `<div style="${PREVIEW_BOX_STYLE}"><em>💰 Sponsor: ${data.title || '(senza titolo)'}${
    data.type ? ` — ${data.type}` : ''
  }</em></div>`;
}

function sponsorHeymondoComponent(id, label, typeDefault) {
  return {
    id,
    label,
    fields: sponsorFields({ url: HEYMONDO_URL, title: 'Heymondo', type: typeDefault, disclaimer: true }),
    pattern: HEYMONDO_PATTERN,
    fromBlock: sponsorFromBlock,
    toBlock: sponsorToBlock,
    toPreview: sponsorToPreview,
  };
}

CMS.registerEditorComponent(
  sponsorHeymondoComponent('sponsor-heymondo-it-shortcode', '❤️ Sponsor — Heymondo assicurazione (precompilato)', 'link affiliato')
);
CMS.registerEditorComponent(
  sponsorHeymondoComponent('sponsor-heymondo-en-shortcode', '❤️ Sponsor — Heymondo insurance (preset)', 'affiliate link')
);

CMS.registerEditorComponent({
  id: 'sponsor-shortcode',
  label: '💰 Box sponsor/affiliato (shortcode)',
  fields: sponsorFields(),
  pattern: SPONSOR_PATTERN,
  fromBlock: sponsorFromBlock,
  toBlock: sponsorToBlock,
  toPreview: sponsorToPreview,
});
