// Il rewrite forzato per-dominio in netlify-host-redirects ("https://dominio/* -> /it|en/:splat 200!")
// intercetta ogni richiesta prima che Netlify possa considerare il fallback automatico a
// public/404.html: quel fallback scatta solo per richieste che nessuna regola ha già gestito, non
// per un rewrite riuscito il cui target risulta assente. Per questo il 404 custom va gestito qui,
// ispezionando lo status della risposta finale invece di fare affidamento sulle regole _redirects.
export default async (request, context) => {
  const response = await context.next();
  if (response.status !== 404) {
    return response;
  }

  const isItalian = new URL(request.url).hostname.includes("vandipety.it");
  const image = isItalian ? "/images/404_it.png" : "/images/404_eng.png";
  const backLabel = isItalian ? "Torna indietro" : "Go back";
  const lang = isItalian ? "it" : "en";

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>404</title>
<style>
  body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #fff; color: #212529; }
  .wrap { max-width: 900px; margin: 0 auto; padding: 40px 20px; text-align: center; }
  img { max-width: 100%; height: auto; margin-bottom: 24px; }
  a.btn { display: inline-block; padding: 10px 28px; border-radius: 6px; background: #0d6efd; color: #fff; text-decoration: none; font-weight: 500; }
  a.btn:hover { background: #0b5ed7; }
</style>
</head>
<body>
<div class="wrap">
  <img src="${image}" alt="404">
  <div><a class="btn" href="/">${backLabel}</a></div>
</div>
</body>
</html>`;

  return new Response(html, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

export const config = {
  path: "/*",
  excludedPath: ["/images/*", "/js/*", "/css/*", "/yt-thumb/*"],
};
