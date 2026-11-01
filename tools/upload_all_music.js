/**
 * upload_all_music.js
 * Copia todos os 402 MP3s de Minhas_Musicas para frontend/public/audio
 * com nomes sanitizados (slug), e regenera webPlaylist.ts com todas as faixas.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve('E:\\GDM_LIVE_RADIO\\Minhas_Musicas');
const DEST_DIR = path.resolve('E:\\GDM_LIVE_RADIO\\frontend\\public\\audio');
const PLAYLIST_FILE = path.resolve('E:\\GDM_LIVE_RADIO\\frontend\\src\\config\\webPlaylist.ts');

// --- Slugify ---
function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
    .replace(/[çÇ]/g, 'c')
    .replace(/[ãÃõÕ]/g, function(m) { return m.toLowerCase() === 'ã' ? 'a' : 'o'; })
    .replace(/[^a-zA-Z0-9\s\-_]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- Título limpo ---
function cleanTitle(filename) {
  return filename
    .replace(/\s+v\d+$/i, '')          // remove " v1", " v2", etc. no final
    .replace(/_/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Lê arquivos fonte
const files = fs.readdirSync(SRC_DIR)
  .filter(f => f.toLowerCase().endsWith('.mp3'))
  .sort();

console.log(`[INFO] Encontrados ${files.length} arquivos MP3 em ${SRC_DIR}`);

// Cria diretório destino se não existir
fs.mkdirSync(DEST_DIR, { recursive: true });

const playlist = [];
const slugMap = {};  // para detectar colisões

let copied = 0;
let skipped = 0;
let errors = 0;

files.forEach((f, i) => {
  const baseName = path.basename(f, '.mp3');
  let slug = slugify(baseName);
  
  // Resolve colisões de slug adicionando índice
  if (slugMap[slug]) {
    slug = slug + '-' + (i + 1);
  }
  slugMap[slug] = true;
  
  const destFileName = slug + '.mp3';
  const srcPath = path.join(SRC_DIR, f);
  const destPath = path.join(DEST_DIR, destFileName);
  
  try {
    fs.copyFileSync(srcPath, destPath);
    copied++;
    
    const title = cleanTitle(baseName);
    playlist.push({
      id: destFileName,
      title: title,
      artist: 'Graça Digital (GDM)',
      album: 'GDM Live Radio',
      url: `/audio/${destFileName}`,
      coverUrl: '/images/player-album-art.jpg'
    });
    
    if ((i + 1) % 50 === 0 || i === files.length - 1) {
      process.stdout.write(`\r[INFO] Copiando... ${i + 1}/${files.length} (${copied} ok, ${errors} erros)`);
    }
  } catch (err) {
    errors++;
    console.error(`\n[ERRO] ${f}: ${err.message}`);
  }
});

console.log(`\n[INFO] Cópia concluída: ${copied} arquivos copiados, ${skipped} ignorados, ${errors} erros.`);

// Gera webPlaylist.ts
const playlistContent = `// AUTO-GERADO por tools/upload_all_music.js
// ${new Date().toISOString()}
// Total de faixas: ${playlist.length}

export interface WebTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string;
  coverUrl: string;
}

export const GDM_WEB_PLAYLIST: WebTrack[] = ${JSON.stringify(playlist, null, 2)};
`;

fs.writeFileSync(PLAYLIST_FILE, playlistContent, 'utf8');
console.log(`[INFO] webPlaylist.ts gerado com ${playlist.length} faixas em ${PLAYLIST_FILE}`);
console.log('[OK] Tudo pronto! Execute: npm --prefix frontend run build');

