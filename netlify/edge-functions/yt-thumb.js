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
  headers.set("Cache-Control", "public, max-age=604800");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
};

export const config = {
  path: "/yt-thumb/:size/:id",
};
