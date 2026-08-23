/*
 * Import di un vecchio file .md (frontmatter YAML + corpo) per compilare da soli tutti i
 * campi dell'articolo, invece di ricopiarli a mano uno per uno.
 *
 * Come si usa: il campo "import_markdown" (primo campo di ogni collection in config.yml) è
 * un normale widget "text" — apri il vecchio .md (es. su GitHub), copia tutto il contenuto
 * (frontmatter compreso) e incollalo lì. Al Salva, l'handler preSave qui sotto lo riparsa e
 * sovrascrive i campi veri con quello che ha trovato, poi rimuove il campo di appoggio così
 * non finisce mai nel file .md pubblicato.
 *
 * Perché non è un bottone "Carica file": un campo custom con un vero <input type="file">
 * richiederebbe CMS.registerFieldType(...) — provato in un giro precedente, ma nell'editor
 * si vedeva solo l'etichetta/hint del campo, nessun controllo (bug o incompatibilità non
 * diagnosticabile senza poter testare dal vivo l'ambiente Sveltia). Il copia-incolla con un
 * widget "text" standard è garantito funzionare sempre, quindi si è tornati a quello.
 *
 * Perché non aggiorna i campi mentre scrivi: l'API di Sveltia per i campi (vedi
 * https://sveltiacms.app/en/docs/api/field-types) fa leggere ma non scrivere gli altri campi
 * dell'entry da un campo custom — l'unico punto documentato dove si può riscrivere l'intera
 * entry è l'evento "preSave" (.../api/events), che gira quando si preme Salva/Pubblica.
 */

// Elenco dei campi di frontmatter noti (stessi nomi dichiarati in config.yml per blog_it/
// blog_en) che il preSave può sovrascrivere. "body" è gestito a parte (non è frontmatter).
const IMPORT_MD_KNOWN_FIELDS = [
  'title',
  'description',
  'image',
  'date',
  'categories',
  'continent',
  'country',
  'type',
  'draft',
  'slug',
  'language',
];

/**
 * Divide un file .md in frontmatter YAML + corpo, stile Hugo: "---\n<yaml>\n---\n<body>".
 * Ritorna null se il testo non ha un blocco frontmatter riconoscibile (non è un errore
 * bloccante: il chiamante non tocca gli altri campi in quel caso).
 */
function parseFrontmatterFile(raw) {
  if (typeof raw !== 'string') return null;
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/);
  if (!match) return null;

  let data;
  try {
    // JSON_SCHEMA invece del default: evita che js-yaml converta le date tipo
    // "2024-01-01T10:00:00.000" in oggetti Date JS (comportamento di default per i
    // timestamp YAML) — ci serve la STRINGA così com'è nel file, non un oggetto Date,
    // perché è quello che il campo "datetime" del CMS si aspetta di ricevere/riscrivere.
    // I booleani (true/false minuscoli, es. "draft: true") restano comunque riconosciuti.
    data = jsyaml.load(match[1], { schema: jsyaml.JSON_SCHEMA }) || {};
  } catch (e) {
    console.warn('[import-markdown] frontmatter YAML non valido:', e);
    return null;
  }

  return { data, body: match[2].replace(/^\r?\n/, '') };
}

CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    const raw = entry.getIn(['data', 'import_markdown']);
    let data = entry.get('data');

    // BUG osservato: quando il campo è vuoto (nessun import), il primo "return entry"
    // qui sotto usava saltare anche il delete — ma essendo un campo DICHIARATO in
    // config.yml, Sveltia lo scrive comunque nel frontmatter pubblicato con valore ''
    // se non viene esplicitamente rimosso (visto in produzione: "import_markdown: ''"
    // in cima a un articolo pubblicato). Il delete va quindi fatto SEMPRE, non solo
    // quando c'è davvero qualcosa da importare.
    if (raw) {
      const parsed = parseFrontmatterFile(raw);
      if (parsed) {
        IMPORT_MD_KNOWN_FIELDS.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(parsed.data, key)) {
            data = data.set(key, parsed.data[key]);
          }
        });
        if (typeof parsed.body === 'string') {
          data = data.set('body', parsed.body);
        }
      }
      // testo non vuoto ma non parsabile: non tocco gli altri campi (resta lì da
      // correggere/annullare), ma il campo di appoggio viene comunque rimosso sotto.
    }

    data = data.delete('import_markdown');
    return entry.set('data', data);
  },
});
