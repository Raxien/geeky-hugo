/*
 * Anteprima "vera" dell'articolo nel pannello laterale, stile del sito incluso.
 *
 * Il problema che risolve: senza questo file, il pannello di anteprima usa un renderer
 * markdown generico che non sa nulla della sintassi Hugo — uno shortcode come
 * {{< image src="..." >}} ci arriva mostrato come testo grezzo, non come immagine.
 * (Su Sveltia risolve anche l'assenza di preview per i blocchi custom nell'editor:
 * quella resta un limite del progetto — vedi shortcodes.js — ma qui aggiriamo il
 * problema con un'anteprima dell'INTERO articolo invece che del singolo blocco.)
 *
 * Come funziona:
 *  1. Recupera il CSS vero del tema da una pagina reale del sito e lo registra con
 *     CMS.registerPreviewStyle(..., {raw:true}). Nessuna build aggiuntiva richiesta.
 *     Il CSS ora è un <link rel="stylesheet" href="/css/main.<hash>.css"> ESTERNO
 *     (non più inlineato in un <style> come quando questo file è stato scritto — vedi
 *     il commit "fix lcp" e il commento in layouts/partials/style.html: il bundle
 *     inline pesava ~190KB render-blocking su ogni pagina, spostato fuori per l'LCP),
 *     quindi qui sotto servono DUE fetch: la pagina per trovare l'URL (cambia ad ogni
 *     build per il fingerprint sha512), poi l'URL stesso per il contenuto. Prima si
 *     cercava un <style type="text/css"> che non esiste più: il fetch "riusciva"
 *     silenziosamente (nessun errore in console) ma non trovava nulla da registrare,
 *     quindi l'intera anteprima laterale girava SENZA lo stile vero del tema — è
 *     questo il motivo per cui il box "leggi anche" appariva senza box (testo delle
 *     due span attaccato, niente sfondo/angoli arrotondati) e le immagini nel corpo
 *     apparivano alla dimensione naturale del file invece che a quella del tema.
 *  2. Converte a mano gli shortcode noti (stesse regex di shortcodes.js, qui applicate
 *     all'intero testo invece che a un singolo blocco) nell'HTML che il tema
 *     genererebbe davvero, poi passa il resto a `marked` per il markdown normale.
 *  3. Registra tutto con CMS.registerPreviewTemplate() per blog_it e blog_en — API
 *     identica su Decap e Sveltia, questo file è invariato tra i due branch.
 *
 * Limiti: niente JS del sito reale (es. il carousel Cloudinary interattivo diventa una
 * semplice griglia di anteprime), niente header/nav/footer — è un'approssimazione dei
 * contenuti con lo stile vero, non un mirror pixel-perfect del sito pubblicato.
 */

// --- 1. CSS reale del tema, recuperato da una pagina pubblicata --------------------
fetch('/')
  .then((r) => r.text())
  .then((html) => {
    // Il bundle vero è l'unico <link> il cui href contiene "/css/main" (fingerprint
    // sha512 in coda, cambia ad ogni build) — vedi resources.Concat("/css/main.css")
    // in style.html. Ce ne possono essere altri (Google Fonts, eventuali plugin CSS
    // esterni in site.Params.plugins.css): non li vogliamo, cerchiamo solo questo.
    const linkMatch = html.match(/<link[^>]+href="([^"]*\/css\/main[^"]*\.css)"[^>]*>/);
    if (!linkMatch) {
      console.warn('[preview.js] link al CSS del tema non trovato in "/": anteprima senza stile reale.');
      return null;
    }
    return fetch(linkMatch[1]).then((r) => r.text());
  })
  .then((css) => {
    if (css) CMS.registerPreviewStyle(css, { raw: true });
  })
  .catch((err) => console.warn('[preview.js] impossibile recuperare il CSS del tema:', err));

// --- 2. Conversione shortcode → HTML reale + markdown normale ---------------------

function renderArticleBody(raw) {
  if (!raw) return '';

  const blocks = [];
  function stash(html) {
    const token = `@@PREVIEW_BLOCK_${blocks.length}@@`;
    blocks.push(html);
    return token;
  }

  let text = raw;

  // image — stessa struttura di themes/geeky-hugo/layouts/shortcodes/image.html
  text = text.replace(/\{\{<\s*image\s+([\s\S]*?)\s*>\}\}/g, (_, attrsStr) => {
    const a = parseAttrs(attrsStr);
    const caption = a.title || a.caption;
    const img = `<img loading="lazy" src="${a.src || ''}" alt="${a.alt || ''}" style="max-width:100%">`;
    return stash(caption ? `<figure class="img-center">${img}<figcaption>${caption}</figcaption></figure>` : `<div class="img-center">${img}</div>`);
  });

  // carousel — griglia di miniature al posto del widget Cloudinary interattivo
  text = text.replace(/\{\{<\s*carousel\s+images="([^"]*)"\s*>\}\}/g, (_, imgs) => {
    const ids = imgs.split(',').map((s) => s.trim()).filter(Boolean);
    const thumbs = ids
      .map(
        (id) =>
          `<img loading="lazy" src="https://res.cloudinary.com/ilgattodicitturin/image/upload/f_auto,q_auto,w_300/${id}" style="width:110px;height:80px;object-fit:cover;margin:3px;border-radius:6px">`
      )
      .join('');
    return stash(`<div>${thumbs}</div>`);
  });

  // gmap — iframe reale, stessa struttura di gmap.html
  text = text.replace(/\{\{<\s*gmap\s+"([^"]*)"(?:\s+"1")?\s*>\}\}/g, (_, url) =>
    stash(
      `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden"><iframe src="${url}" loading="lazy" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe></div>`
    )
  );

  // youtube2 — iframe youtube-nocookie diretto (niente facade/click-to-load come sul sito)
  // id quasi sempre senza virgolette nel contenuto reale, pattern tollerante a entrambe le forme
  text = text.replace(/\{\{<\s*youtube2\s+"?([^"\s>]+)"?(?:\s+"([^"]*)")?\s*>\}\}/g, (_, id, title) => {
    const videoId = id.split('?')[0];
    const iframe = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" loading="lazy" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe></div>`;
    return stash(title ? `<figure class="img-center">${iframe}<figcaption>${title}</figcaption></figure>` : iframe);
  });

  // button — stesso markup di button.html
  text = text.replace(/\{\{<\s*button\s+"([^"]*)"\s+"([^"]*)"\s*>\}\}/g, (_, label, url) =>
    stash(`<a href="${url}" class="btn btn-primary text-white">${label}</a>`)
  );

  // indice — placeholder (il vero indice si genera solo in build, dai titoli dell'articolo)
  text = text.replace(/\{\{<\s*indice\s*>\}\}/g, () =>
    stash('<div style="border:1px dashed #999;padding:.75rem;border-radius:6px"><em>📑 Indice — generato automaticamente in pubblicazione dai titoli dell\'articolo</em></div>')
  );

  // leggi-anche — stessa struttura di leggi-anche.html (le classi CSS sono quelle vere del
  // tema, con il CSS reale caricato il box è uguale al sito). Se c'è un url, il titolo/
  // immagine reali vengono caricati subito dopo dal DOM via hydrateLeggiAnche() qui sotto
  // (fetch della pagina pubblicata) — se il fetch fallisce (slug sbagliato o articolo non
  // ancora pubblicato) resta scritto "Caricamento…", non è un errore bloccante.
  text = text.replace(/\{\{<\s*leggi-anche(?:\s+url="([^"]*)")?\s*>\}\}/g, (_, url) => {
    if (url) {
      return stash(
        `<div class="article__body__leggi-anche" data-leggianche-url="${url}"><a href="${url}"><div class="leggi-anche-content"><span class="leggi-anche-label">leggi anche</span><span class="leggi-anche-title">Caricamento…</span></div></a></div>`
      );
    }
    return stash(
      '<div class="article__body__leggi-anche"><div class="leggi-anche-content"><span class="leggi-anche-label">leggi anche</span><span class="leggi-anche-title">🔀 Articolo correlato, scelto a caso in pubblicazione</span></div></div>'
    );
  });

  // extLink — lasciato come link markdown normale, ci pensa marked dopo
  text = text.replace(/\{\{<\s*extLink\s+"([^"]*)"\s+"([^"]*)"(?:\s+"([^"]*)")?\s*>\}\}/g, (_, label, url) => `[${label} ↗](${url})`);

  let html = typeof marked !== 'undefined' ? marked.parse(text) : `<pre>${text}</pre>`;

  blocks.forEach((blockHtml, i) => {
    // marked avvolge le righe isolate in <p>: tolgo l'involucro per i blocchi (figure/div/iframe)
    // così non finiamo con <p><figure>...</figure></p>, non valido e problematico per lo stile.
    html = html
      .replace(new RegExp(`<p>@@PREVIEW_BLOCK_${i}@@</p>`, 'g'), blockHtml)
      .replace(new RegExp(`@@PREVIEW_BLOCK_${i}@@`, 'g'), blockHtml);
  });

  return html;
}

// Cerca i box "leggi anche" con un url impostato e ci carica dentro il titolo reale,
// facendo il fetch della pagina pubblicata corrispondente (stesso trucco usato per il CSS
// del tema). Manipola il DOM direttamente (non passa da React/setState): i box sono dentro
// un dangerouslySetInnerHTML, quindi non sono nodi React gestiti, mutarli è il modo giusto.
//
// NOTA: niente più immagine iniettata qui (c'era un <img class="poligon"> con l'og:image
// dell'articolo collegato). Senza il resto del contesto reale della pagina (dimensioni del
// contenitore, altro CSS/JS della grid attorno al box) l'immagine veniva fuori sformata e
// rovinava l'anteprima invece di aiutarla — meglio il solo titolo, corretto ma minimale.
function hydrateLeggiAnche(root) {
  if (!root) return;
  const nodes = root.querySelectorAll('[data-leggianche-url]:not([data-leggianche-loaded])');
  nodes.forEach((node) => {
    const url = node.getAttribute('data-leggianche-url');
    node.setAttribute('data-leggianche-loaded', '1'); // un solo tentativo per box, niente retry in loop
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error('not found'))))
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const realTitle = doc.querySelector('title')?.textContent?.trim();
        const titleEl = node.querySelector('.leggi-anche-title');
        if (titleEl && realTitle) titleEl.textContent = realTitle;
      })
      .catch(() => {
        const titleEl = node.querySelector('.leggi-anche-title');
        if (titleEl) titleEl.textContent = '⚠️ Articolo non trovato a questo indirizzo — link probabilmente da correggere';
      });
  });
}

// --- 3. Template di anteprima per le due collection --------------------------------

function makeArticlePreview() {
  return createClass({
    componentDidMount: function () {
      hydrateLeggiAnche(this._root);
    },
    componentDidUpdate: function () {
      hydrateLeggiAnche(this._root);
    },
    render: function () {
      const entry = this.props.entry;
      const title = entry.getIn(['data', 'title']);
      const image = entry.getIn(['data', 'image']);
      const body = entry.getIn(['data', 'body']) || '';

      // Le cover del sito sono URL Cloudinary già completi (https://...), non file caricati
      // nella media library locale del CMS: getAsset() serve solo per questi ultimi e su un
      // URL esterno restituisce undefined, quindi tentarlo prima e ripiegare sull'URL grezzo.
      let imageSrc = '';
      if (typeof image === 'string' && /^https?:\/\//.test(image)) {
        imageSrc = image;
      } else if (image) {
        try {
          const asset = this.props.getAsset(image);
          imageSrc = asset ? asset.toString() : '';
        } catch (e) {
          imageSrc = '';
        }
      }

      return h(
        'div',
        {
          ref: (el) => {
            this._root = el;
          },
          style: { maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' },
        },
        imageSrc && h('img', { src: imageSrc, style: { width: '100%', borderRadius: '12px', marginBottom: '1.5rem' } }),
        h('h1', { className: 'mb-4' }, title),
        h('div', { className: 'content', dangerouslySetInnerHTML: { __html: renderArticleBody(body) } })
      );
    },
  });
}

CMS.registerPreviewTemplate('blog_it', makeArticlePreview());
CMS.registerPreviewTemplate('blog_en', makeArticlePreview());
