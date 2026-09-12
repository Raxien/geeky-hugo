// Porting di netlify/edge-functions/yt-thumb.js su Cloudflare Pages Functions.
// Proxy per le miniature YouTube (/yt-thumb/:size/:id -> img.youtube.com): un
// semplice redirect lascerebbe passare il Cache-Control originale di YouTube
// (max-age=7200, 2h) invece di quello impostato qui sotto — il fetch esplicito
// permette di sovrascriverlo sulla risposta, stessa ragione della versione Netlify.
//
// Routing basato su file: la cartella [size]/[id].js mappa automaticamente
// /yt-thumb/:size/:id, esposti in context.params.
export async function onRequestGet(context) {
  const { size, id } = context.params;
  const upstream = await fetch(`https://img.youtube.com/vi_webp/${id}/${size}.webp`);

  if (!upstream.ok) {
    return new Response("Thumbnail not found", { status: upstream.status });
  }

  const headers = new Headers(upstream.headers);
  // 1 anno: sono video propri (vedi commento in youtube2.html), la miniatura non
  // cambia mai in pratica. Stesso valore della versione Netlify.
  headers.set("Cache-Control", "public, max-age=31536000");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
