// Proxy per le miniature YouTube (/yt-thumb/:size/:id -> img.youtube.com).
// Il semplice redirect in netlify.toml lascia passare l'header Cache-Control
// originale di YouTube (max-age=7200, 2h) invece di quello dichiarato nelle
// [[headers]] di netlify.toml, perché quella regola non si applica alle
// risposte di un redirect proxy verso un'origine esterna. Qui il fetch è
// esplicito, quindi possiamo sovrascrivere l'header sulla risposta.
export default async (request) => {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/yt-thumb\/([^/]+)\/([^/]+)$/);
  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const [, size, id] = match;
  const upstream = await fetch(`https://img.youtube.com/vi_webp/${id}/${size}.webp`);

  if (!upstream.ok) {
    return new Response("Thumbnail not found", { status: upstream.status });
  }

  const headers = new Headers(upstream.headers);
  // 1 anno: sono video propri (vedi commento in youtube2.html), la miniatura non
  // cambia mai in pratica. PageSpeed segnalava "durata cache inefficiente" sui 7gg
  // precedenti; qui non c'è un hash nel path da invalidare a un eventuale cambio,
  // ma è un compromesso accettato consapevolmente (non fingerprintato come css/js).
  headers.set("Cache-Control", "public, max-age=31536000");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
};

export const config = {
  path: "/yt-thumb/:size/:id",
};
