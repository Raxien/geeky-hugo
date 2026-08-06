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

// ---------------------------------------------------------------------------
// image — {{< image src="..." alt="..." caption="..." p="center" >}}
// ---------------------------------------------------------------------------
CMS.registerEditorComponent({
  id: 'image-shortcode',
  label: '🖼️ Immagine (shortcode)',
  fields: [
    { name: 'src', label: 'URL immagine (Cloudinary o /images/...)', widget: 'string' },
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
  pattern: /^{{<\s*youtube2\s+"([^"]*)"(?:\s+"([^"]*)")?\s*>}}$/m,
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
      label: 'Immagini (public ID Cloudinary, riordinabili trascinandole)',
      widget: 'list',
      field: { label: 'Public ID', name: 'id', widget: 'string' },
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
