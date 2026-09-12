// Porting del routing multilingua per dominio da Netlify a Cloudflare Pages Functions.
//
// Su Netlify questa logica viveva in due posti:
//   - exampleSite/netlify-host-redirects (regole dichiarative con match sull'host,
//     unite a static/_redirects in fase di build — vedi netlify.toml)
//   - exampleSite/netlify/edge-functions/custom-404.js (404 vero per dominio)
//
// Cloudflare Pages non supporta match sull'host nel file _redirects (solo path) e non
// supporta status 200 (rewrite trasparente) in _redirects — quindi l'intero meccanismo
// va rifatto qui, in codice, con una Pages Function "_middleware" che intercetta OGNI
// richiesta del progetto prima che arrivi agli asset statici.
//
// NOTA IMPORTANTE per chi testa questo file: i redirect SEO "path-only" (quelli senza
// host nel from, es. /books -> / in static/_redirects) NON sono duplicati qui.
// Restano nel file _redirects pubblicato in root (vedi build command), e per
// documentazione ufficiale Cloudflare l'ordine di valutazione di una richiesta è
// _redirects -> _headers -> Functions -> asset statici: un redirect di quel file
// dovrebbe quindi già rispondere PRIMA che questa funzione venga invocata.
// Se in test emergesse che non è così (cioè che _redirects viene ignorato e le
// richieste arrivano comunque qui riscritte a /it/books o /en/books), vedi
// CLOUDFLARE-MIGRATION.md per come portare anche quelle regole in questo file.

// Redirect di consolidamento categoria per gli slug ambigui tra IT ed EN (stesso
// slug, destinazione diversa a seconda della lingua del dominio) — porting 1:1
// del blocco "categories" in netlify-host-redirects. Gli slug NON ambigui restano
// nel file _redirects path-only, qui non vanno duplicati.
const AMBIGUOUS_CATEGORY_REDIRECTS = {
  it: {
    africa: "/categories/marocco-in-camper/",
    blog: "/categories/diario-di-bordo/",
    hiroshima: "/categories/giappone-in-camper/",
    istanbul: "/categories/turchia-in-camper/",
    kyushu: "/categories/giappone-in-camper/",
    overlanding: "/categories/vita-in-camper-e-consigli-pratici/",
    "overlanding-africa": "/categories/africa-in-camper/",
    "overlanding-asia": "/categories/corea-del-sud-in-camper/",
    seoul: "/categories/corea-del-sud-in-camper/",
    tokyo: "/categories/giappone-in-camper/",
  },
  en: {
    africa: "/categories/morocco-by-campervan/",
    blog: "/categories/vandipety-updates/",
    hiroshima: "/categories/japan-by-campervan/",
    istanbul: "/categories/turkey-by-campervan/",
    kyushu: "/categories/japan-by-campervan/",
    overlanding: "/categories/campervan-tips-life/",
    "overlanding-africa": "/categories/africa-by-campervan/",
    "overlanding-asia": "/categories/south-korea-by-campervan/",
    seoul: "/categories/south-korea-by-campervan/",
    tokyo: "/categories/japan-by-campervan/",
  },
};

// Path esclusi dal remap sul 404.html "vero" (stesso elenco di excludedPath in
// custom-404.js): per asset mancanti non ha senso servire la pagina 404 completa
// di header/footer/nav, meglio il 404 generico dell'asset server.
const NOT_FOUND_HTML_EXCLUDED = /^\/(images|js|css)\//;

function resolveLang(hostname) {
  const host = hostname.replace(/^www\./, "");
  if (host === "vandipety.it") return "it";
  if (host === "vandipety.com") return "en";
  return null; // host sconosciuto (es. anteprima *.pages.dev) -> nessun routing per dominio
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // yt-thumb ha una sua Pages Function dedicata (functions/yt-thumb/[size]/[id].js):
  // _middleware avvolge anche quella, quindi va lasciata passare intatta qui, altrimenti
  // il path verrebbe riscritto con un prefisso lingua e la function dedicata non
  // matcherebbe più la route.
  if (url.pathname.startsWith("/yt-thumb/")) {
    return context.next();
  }

  const lang = resolveLang(url.hostname);

  // Host non riconosciuto: durante i test su *.pages.dev (prima del cutover DNS) non
  // c'è un dominio da cui dedurre la lingua. Si naviga direttamente /it/... e /en/...
  // senza alcun rewrite — vedi CLOUDFLARE-MIGRATION.md per i limiti di questa modalità
  // (es. login CMS, che dipende dal dominio di produzione per l'OAuth).
  if (!lang) {
    // Comodità SOLO per l'anteprima: la radice di public/ non ha un index.html
    // proprio (Hugo multihost genera solo public/it/ e public/en/), quindi senza
    // questo il link "Visit site" di Cloudflare darebbe 404 al primo click. Su un
    // host riconosciuto questo ramo non viene mai eseguito: lì la home la serve
    // il rewrite qui sotto, non questo redirect.
    if (url.pathname === "/") {
      return Response.redirect(new URL("/it/", url), 302);
    }
    return context.next();
  }

  // 1) Redirect di consolidamento categoria (301, path pubblico invariato per il
  //    resto — vedi tabella sopra).
  const categoryMatch = url.pathname.match(/^\/categories\/([^/]+)\/?/);
  if (categoryMatch) {
    const dest = AMBIGUOUS_CATEGORY_REDIRECTS[lang][categoryMatch[1]];
    if (dest) {
      return Response.redirect(new URL(dest, url).toString(), 301);
    }
  }

  // 2) /admin -> albero della lingua del dominio richiesto. Punta al file reale
  //    (non un target fisso a index.html) perché l'editor, una volta caricato
  //    /admin/index.html, fa fetch relativi a se stesso (config.yml, preview.js,
  //    shortcodes.js) — stessa ragione del :splat nella regola Netlify originale.
  const targetPath =
    url.pathname === "/admin" || url.pathname.startsWith("/admin/")
      ? `/${lang}/admin${url.pathname.slice("/admin".length)}`
      : `/${lang}${url.pathname}`;

  const rewrittenUrl = new URL(url);
  rewrittenUrl.pathname = targetPath;
  const response = await context.next(new Request(rewrittenUrl, request));

  // 3) 404 vero renderizzato da Hugo (con header/footer/nav del tema), nella lingua
  //    del dominio, al posto del 404 generico dell'asset server — porting di
  //    custom-404.js. env.ASSETS.fetch permette di recuperare un asset del progetto
  //    per URL arbitrario, indipendentemente dal path della richiesta originale.
  if (response.status === 404 && !NOT_FOUND_HTML_EXCLUDED.test(url.pathname)) {
    const notFoundUrl = new URL(`/${lang}/404.html`, url);
    const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    return new Response(notFoundResponse.body, {
      status: 404,
      headers: notFoundResponse.headers,
    });
  }

  return response;
}
