/**
 * copy_audio_to_dist.js
 * Copia todos os MP3s de Minhas_Musicas para frontend/dist/audio/ com nomes slug
 * Deve ser executado APÓS o build do Vite
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve('E:\\GDM_LIVE_RADIO\\Minhas_Musicas');
const DEST_DIR = path.resolve('E:\\GDM_LIVE_RADIO\\frontend\\dist\\audio');

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ãÃõÕ]/g, function(m) { return m.toLowerCase() === 'ã' ? 'a' : 'o'; })
    .replace(/[^a-zA-Z0-9\s\-_]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const files = fs.readdirSync(SRC_DIR)
  .filter(f => f.toLowerCase().endsWith('.mp3'))
  .sort();

console.log(`[INFO] Copiando ${files.length} MP3s para dist/audio/...`);
fs.mkdirSync(DEST_DIR, { recursive: true });

const slugMap = {};
let copied = 0;
let errors = 0;

files.forEach((f, i) => {
  const baseName = path.basename(f, '.mp3');
  let slug = slugify(baseName);
  if (slugMap[slug]) { slug = slug + '-' + (i + 1); }
  slugMap[slug] = true;

  const destFile = slug + '.mp3';
  try {
    fs.copyFileSync(path.join(SRC_DIR, f), path.join(DEST_DIR, destFile));
    copied++;
    if ((i + 1) % 50 === 0 || i === files.length - 1) {
      process.stdout.write(`\r[INFO] ${i + 1}/${files.length} (${copied} ok, ${errors} erros)`);
    }
  } catch (err) {
    errors++;
    console.error(`\n[ERRO] ${f}: ${err.message}`);
  }
});

console.log(`\n[OK] Concluído: ${copied} copiados, ${errors} erros.`);
console.log(`[OK] Arquivos disponíveis em: ${DEST_DIR}`);

