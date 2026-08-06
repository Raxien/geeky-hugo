# Setup di /admin/ (Sveltia CMS) — passi manuali una tantum

Questo file non viene pubblicato sul sito (Hugo non lo processa, è solo documentazione per
`exampleSite/static/admin/`). I passi qui sotto vanno fatti **una sola volta**, fuori da
questo repo, su dashboard esterne a cui io non ho accesso.

## 1. Login GitHub via Netlify (obbligatorio, senza non si entra in /admin/)

Il sito è già su Netlify, quindi non serve Netlify Identity: si usa il proxy OAuth che
Netlify offre a qualunque sito ospitato da loro (Sveltia è compatibile con lo stesso
meccanismo usato da Decap/Netlify CMS).

1. Su GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://vandipety.it`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Copiare **Client ID** e **Client secret** generati.
2. Sul dashboard Netlify del sito: **Site configuration → Access & security → OAuth →
   Install provider** → scegliere GitHub → incollare Client ID e Client secret.
3. Fatto: aprendo `https://vandipety.it/admin/` comparirà un pulsante di login GitHub che
   chiede accesso al repo `Raxien/geeky-hugo`.

   Nota: il sito è in modalità **multihost** (`vandipety.it` per IT, `vandipety.com` per
   EN — vedi `config/_default/languages.toml`), quindi `static/admin/` viene pubblicato
   identico su entrambi i domini. Non è un problema, l'OAuth passa comunque da
   `api.netlify.com` indipendentemente da quale dominio ha aperto la pagina.

## 2. Cloudinary (per l'upload della copertina)

1. `cloud_name` è già impostato (`ilgattodicitturin`, già pubblico nel sito — vedi
   `carousel.html` e le URL immagine esistenti). Manca solo l'**API Key**: sul
   [Cloudinary Console](https://console.cloudinary.com/), in alto nella dashboard.
2. In `exampleSite/static/admin/config.yml`, sostituire `API_KEY_DA_SOSTITUIRE` con la
   tua API Key (NON l'API Secret, quella non va mai messa qui).
3. Non serve creare un "upload preset unsigned": anche in Sveltia il widget apre la Media
   Library di Cloudinary vera e propria, con login sull'account già in uso
   (`ilgattodicitturin`). Cloud name e API key non sono dati segreti — finiranno comunque
   visibili pubblicamente in `/admin/config.yml`, è normale e documentato da Cloudinary
   stesso.

## 3. Test prima di fidarsi in produzione

- `hugo server` in locale e apri `http://localhost:1313/admin/`: la UI si carica, ma il
  login GitHub funziona solo dal dominio vero (`vandipety.it`) perché il callback OAuth è
  registrato su quello — per testare il login serve un deploy reale (anche un Deploy
  Preview di una PR va bene, se il dominio è tra quelli autorizzati).
- Primo articolo di prova: crealo con "Bozza" spuntata. Verifica che NON compaia sul sito
  pubblicato (Hugo esclude i draft per default), poi togli la spunta per pubblicarlo.

## Perché questo branch e non `cms/decap-poc`

Sveltia è un fork moderno di Decap CMS, pensato come sostituto "drop-in": stesso
`config.yml`, stessa API per gli editor component custom (`shortcodes.js` è quasi
identico). Differenze rilevanti rispetto al branch Decap:

- **Manutenzione**: Sveltia riceve rilasci molto frequenti (più aggiornamenti a settimana);
  Decap/Netlify CMS è sostanzialmente in manutenzione minima.
- **Cloudinary nativo**: un solo script invece di due, nessun plugin esterno da caricare.
- **UI più moderna e reattiva** (dichiarato dal progetto, da verificare con mano).
- **i18n di prima classe**: non sfruttato in questo POC (vedi nota in `config.yml`) ma
  potenzialmente utile in futuro per la coppia IT/EN.
- **Contro**: progetto pre-1.0 (versione 0.x), quindi possibili breaking change tra
  aggiornamenti; l'anteprima dei blocchi shortcode custom DENTRO l'editor (`toPreview`)
  non è ancora implementata — il blocco funziona (si inserisce, si compila, si salva) ma
  senza rendering visivo lì. Aggirato per il pannello di anteprima laterale (diverso
  dall'editor) da `preview.js`, vedi sotto — quello funziona identico su entrambi i CMS.

## Cosa copre già questo POC

- Login online, niente VS Code — gestione elenco articoli IT/EN (label chiarite: "Blog
  Italiano"/"Blog English", la lingua si sceglie scegliendo la collection, non un campo).
- Editor con blocchi a form per 7 shortcode (`image`, `extLink`, `youtube2`, `button`,
  `carousel`, `indice`, `gmap` — scelti in base agli usi reali nel contenuto) invece di
  sintassi scritta a mano — vedi `shortcodes.js`.
- Nel blocco `carousel`, le immagini sono una lista trascinabile per riordinarle.
- Copertina caricata direttamente su Cloudinary dall'editor (integrazione nativa,
  `cloud_name` già impostato).
- Campi `slug`/`language` dichiarati esplicitamente, per non perderli sui file che li hanno
  già (vedi nota su data loss più sopra).
- Data pubblicazione precompilata a oggi sui nuovi articoli (`default: '{{now}}'`).
- Toggle nativo "Rich text / Markdown grezzo" nella toolbar dell'editor del corpo articolo.
- **Anteprima laterale con lo stile vero del sito** (`preview.js`): converte gli shortcode
  coperti in HTML reale (stessa struttura dei template Hugo veri) invece di lasciarli come
  testo grezzo, e carica il CSS vero del tema recuperato da una pagina pubblicata. Risolve
  qui anche l'assenza di preview dei blocchi custom nell'editor (limite di Sveltia sopra):
  non è la stessa cosa (qui vedi tutto l'articolo, non il singolo blocco mentre lo scrivi),
  ma dà comunque un riscontro visivo vero. Verificato su tutto il corpus attuale (322
  articoli, >2000 shortcode): solo 5 casi non riconosciuti, tutti per sintassi già
  "sporca" nel markdown sorgente. Limiti: niente JS del sito reale (il carousel diventa
  una griglia statica), niente header/nav/footer, `indice` mostra solo un placeholder.
- Pubblicazione = commit diretto su `master` (Netlify fa il deploy come sempre).

## Cosa NON copre ancora (prossimi passi, fuori scope di questo giro)

- **Altri shortcode** (`omap`, `card`, `chart`, `citazione`, `underline`, `bold`, ...):
  stesso schema di `shortcodes.js`/`preview.js`, da aggiungere man mano — `underline`/
  `bold` in particolare sono usati INLINE dentro una frase, non su riga propria, quindi
  richiedono `inline: true` nel component invece del pattern a blocco usato finora.
- **Drag&drop di blocchi già inseriti nel corpo articolo**: si inseriscono via form, ma il
  riordino a trascinamento del testo già scritto nell'editor rich-text non è garantito
  nativamente — verificare nell'uso reale quanto è comodo così.
- **Tasto destro per i link**: la modalità Rich Text ha un pulsante "link" in toolbar (non
  letteralmente tasto destro, ma stesso risultato); il blocco `extLink` copre i link in
  stile "pulsante testuale" del tema.
- **Traduzione automatica IT→EN con un tasto**: richiede una piccola Netlify Function che
  chiami l'API gratuita di DeepL (500.000 caratteri/mese gratis) — non ancora implementata.
- **Collection "destinazioni"**: aggiungibile in `config.yml` seguendo lo stesso schema.
