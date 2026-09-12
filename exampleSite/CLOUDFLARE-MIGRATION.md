# Migrazione a Cloudflare Pages

Questo branch porta il sito da Netlify a Cloudflare Pages **senza spegnere Netlify**:
i due hosting possono restare live in parallelo finché non si è verificato che tutto
funziona, e il cutover finale è solo un cambio di nameserver sui due domini.

## Cosa cambia, file per file

| Netlify | Cloudflare | File |
|---|---|---|
| `netlify-host-redirects` (routing per dominio, `200!`) | Pages Function `_middleware` | [functions/_middleware.js](functions/_middleware.js) |
| `netlify/edge-functions/custom-404.js` | stessa function, integrata | [functions/_middleware.js](functions/_middleware.js) |
| `netlify/edge-functions/yt-thumb.js` | Pages Function dedicata | [functions/yt-thumb/[size]/[id].js](functions/yt-thumb/%5Bsize%5D/%5Bid%5D.js) |
| `[[headers]]` in `netlify.toml` | file `_headers` | [_headers](_headers) (copiato in `public/_headers` a build time — vedi sotto) |
| redirect SEO path-only in `static/_redirects` | invariati | copiati in `public/_redirects` a build time (nessun cambio di contenuto) |
| OAuth `github` backend via api.netlify.com | Cloudflare Worker dedicato | blocco commentato in [static/admin/config.yml](static/admin/config.yml) |

`netlify.toml`, `netlify-host-redirects`, `netlify/edge-functions/*` **non sono stati
toccati**: il sito su Netlify continua a funzionare esattamente come prima.

## Perché il routing è finito in una Function e non in `_redirects`

Cloudflare Pages `_redirects` supporta solo pattern sul **path**, non sull'host, e solo
status 301/302/303/307/308 — non il 200 "rewrite trasparente" che qui serve per
mostrare `vandipety.it/blog/...` mantenendo internamente `/it/blog/...`. Tutta la
logica che su Netlify dipendeva dall'host (routing IT/EN, `/admin`, 404 per dominio,
redirect categoria ambigui) è quindi in `functions/_middleware.js`, l'unica parte
davvero riscritta di questa migrazione — vedi i commenti nel file per il dettaglio.

I redirect SEO "path-only" (senza dipendenza dall'host, la maggioranza di
`static/_redirects`) restano invece un semplice file `_redirects`, che secondo la
documentazione Cloudflare viene valutato PRIMA delle Functions — quindi dovrebbero
continuare a funzionare senza passare da `_middleware.js`. **Questo è il punto #1 da
verificare in test** (vedi checklist sotto): se in pratica non fosse così, la funzione
ha già un commento che spiega come portare anche quelle regole al suo interno.

## Cosa devi fare tu (fuori da questo repo)

### 1. Primo deploy di prova (nessun dominio reale coinvolto)

1. Cloudflare Dashboard → Workers & Pages → crea un progetto Pages collegato a questo
   repo GitHub, branch `cloudflare-pages-migration`.
2. Impostazioni build:
   - **Root directory**: `exampleSite`
   - **Build command**:
     ```
     npm install && npx --yes terser assets/js/script.js -o assets/js/script.min.js -c passes=2,pure_getters,unsafe,unsafe_math,unsafe_proto,unsafe_regexp,unsafe_undefined,conditionals,dead_code,evaluate,booleans,loops,unused,drop_console=true,drop_debugger=true -m --comments '/^!/' && hugo --minify --gc --themesDir ../themes --theme geeky-hugo && cp _headers public/_headers && cp static/_redirects public/_redirects && cp 404-fallback.html public/404.html
     ```
     `--themesDir ../themes --theme geeky-hugo` è OBBLIGATORIO: `exampleSite/themes/geeky-hugo`
     nel repo è quasi vuoto (un solo file), il tema vero vive solo in `themes/geeky-hugo` alla
     radice — senza questi due flag la build fallisce con "template for shortcode ... not found"
     (osservato in produzione: shortcode `extLink`). Stessi flag già usati per `hugo server`
     in sviluppo locale (vedi CLAUDE.md).
   - **Build output directory**: `public`
   - **Variabili d'ambiente**: `HUGO_VERSION` = `0.163.3`
3. Deploy. Cloudflare ti darà un dominio tipo `<progetto>.pages.dev`.

### 2. Test su `*.pages.dev`

Su questo dominio la Function non riconosce l'host (non è `vandipety.it` né
`vandipety.com`), quindi **non fa alcun rewrite**: naviga direttamente
`https://<progetto>.pages.dev/it/` e `.../en/` per controllare le due lingue.

Da verificare:
- [ ] Home, un articolo, una categoria in `/it/` e `/en/`
- [ ] Un redirect SEO "vecchio" da `static/_redirects` (es. `/books` → dovrebbe dare 301 a `/`) — **questo verifica il punto #1 sopra**
- [ ] Cache header su un file `css/main.*.css` e su una miniatura `sddefault_*.webp` (DevTools → Network)
- [ ] Miniature YouTube via `/yt-thumb/mqdefault/<id>`

### 3. OAuth per Sveltia CMS

`/admin` su Cloudflare non ha il proxy OAuth automatico che ha Netlify. Serve un
Cloudflare Worker che faccia da proxy OAuth verso GitHub (stesso meccanismo di
Decap/Sveltia, documentato su sveltiacms.app — cerca "OAuth client for self-hosted
backend" / worker Cloudflare ufficiale).

1. Deploya il worker OAuth su Cloudflare Workers.
2. Nella GitHub OAuth App esistente (o una nuova), aggiungi come **callback URL**
   quello del worker (es. `https://<worker>.workers.dev/callback`).
3. Imposta come secret del worker il client id/secret della OAuth App.
4. In [static/admin/config.yml](static/admin/config.yml), scommenta `base_url` e
   `auth_endpoint` e mettici l'URL reale del worker.
5. Testa il login su `https://<progetto>.pages.dev/it/admin/` (o `/en/admin/`).

Questo worker può restare attivo e servire l'OAuth **sia per l'admin su Netlify sia
per quello su Cloudflare** contemporaneamente: non c'è conflitto nella fase di
transizione con i due siti in parallelo.

### 4. Collegare i domini veri

1. Cloudflare Dashboard → aggiungi `vandipety.it` e `vandipety.com` come siti
   ("Add a site"). Cloudflare assegnerà due coppie di nameserver.
2. Dal pannello del tuo **registrar** (non Netlify — lì oggi vivono solo i
   nameserver, la registrazione è altrove) cambia i NS di entrambi i domini con
   quelli assegnati da Cloudflare al punto 1.
3. Attendi la propagazione (di solito poche ore, nel caso peggiore fino a 24-48h:
   finché non è completa il sito Netlify resta comunque raggiungibile, nessun
   downtime).
4. Nel progetto Pages → Custom domains → aggiungi `vandipety.it`, `www.vandipety.it`,
   `vandipety.com`, `www.vandipety.com`.

### 5. Verifica finale sui domini reali

Ripeti la checklist del punto 2 ma su `vandipety.it` e `vandipety.com` veri, più:
- [ ] Login e salvataggio di una bozza da `/admin` su entrambi i domini
- [ ] Una pagina inesistente (es. `/it/pagina-a-caso`) → deve dare la vera 404 di Hugo, non quella generica
- [ ] Un redirect di categoria ambiguo (es. `/categories/africa/` su `.it` vs `.com`) → destinazioni diverse per lingua

Solo a questo punto puoi considerare la migrazione conclusa e, se vuoi, smettere di
buildare/pagare per il sito su Netlify.

## Rollback

Finché i nameserver non sono stati cambiati, non c'è nulla da annullare: Netlify
continua a servire il traffico reale, questo branch vive in parallelo. Dopo il cambio
NS, tornare indietro significa ripuntare i NS a quelli Netlify originali
(`dns[1-4].p05.nsone.net` per `.it`, `dns[1-4].p08.nsone.net` per `.com`).
