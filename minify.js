const Terser = require('terser');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'exampleSite', 'assets', 'js', 'script.js');
const outputFile = path.join(__dirname, 'exampleSite', 'assets', 'js', 'script.min.js');

async function minify() {
  try {
    const code = fs.readFileSync(inputFile, 'utf8');
    const result = await Terser.minify(code, {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
    });

    if (result.error) {
      throw result.error;
    }

    fs.writeFileSync(outputFile, result.code);
    console.log('File minificato con successo!');
  } catch (error) {
    console.error('Errore durante la minificazione:', error);
  }
}

minify(); 