// Il rewrite forzato per-dominio in netlify-host-redirects ("https://dominio/* -> /it|en/:splat 200!")
// intercetta ogni richiesta prima che Netlify possa considerare il fallback automatico a
// public/404.html: quel fallback scatta solo per richieste che nessuna regola ha già gestito, non
// per un rewrite riuscito il cui target risulta assente. Per questo il 404 custom va gestito qui,
// ispezionando lo status della risposta finale invece di fare affidamento sulle regole _redirects.
//
// La vera pagina 404 (con header/footer/nav del tema) viene recuperata con context.rewrite verso
// /it/404.html o /en/404.html: sono gli output reali generati da Hugo per ciascuna lingua (vedi
// exampleSite/layouts/404.html). context.rewrite ripassa dall'intera pipeline di redirect, quindi
// senza la regola di passthrough esplicita in netlify-host-redirects il catch-all per dominio
// riscriverebbe di nuovo il path aggiungendo un secondo prefisso lingua.
export default async (request, context) => {
  const response = await context.next();
  if (response.status !== 404) {
    return response;
  }

  const isItalian = new URL(request.url).hostname.includes("vandipety.it");
  const notFoundPath = isItalian ? "/it/404.html" : "/en/404.html";

  const realNotFound = await context.rewrite(new URL(notFoundPath, request.url));
  return new Response(realNotFound.body, {
    status: 404,
    headers: realNotFound.headers,
  });
};

export const config = {
  path: "/*",
  excludedPath: ["/images/*", "/js/*", "/css/*", "/yt-thumb/*"],
};
