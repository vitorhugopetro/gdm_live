/**
 * deploy_robust.js
 * Deploy para Firebase Hosting usando GOOGLE_APPLICATION_CREDENTIALS
 * Mais estável no Windows do que --token para muitos arquivos
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SA_PATH = 'E:\\GDM_LIVE_RADIO\\gdm-live-radio-firebase-adminsdk-fbsvc-f253de6196.json';
const DIST_DIR = 'E:\\GDM_LIVE_RADIO\\frontend\\dist';
const AUDIO_SRC = 'E:\\GDM_LIVE_RADIO\\Minhas_Musicas';
const AUDIO_DEST = path.join(DIST_DIR, 'audio');

// ── helpers ────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ãÃõÕ]/g, m => m.toLowerCase() === 'ã' ? 'a' : 'o')
    .replace(/[^a-zA-Z0-9\s\-_]/g, ' ')
    .trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

// ── Step 1: ensure MP3s are in dist/audio ─────────────────────────────────
console.log('\n[1/3] Verificando arquivos de áudio em dist/audio...');
fs.mkdirSync(AUDIO_DEST, { recursive: true });

const existing = new Set(fs.readdirSync(AUDIO_DEST).filter(f => f.endsWith('.mp3')));
const srcFiles = fs.readdirSync(AUDIO_SRC).filter(f => f.toLowerCase().endsWith('.mp3')).sort();

const slugMap = {};
let copied = 0;

srcFiles.forEach((f, i) => {
  const base = path.basename(f, '.mp3');
  let slug = slugify(base);
  if (slugMap[slug]) slug = slug + '-' + (i + 1);
  slugMap[slug] = true;
  const dest = slug + '.mp3';
  if (!existing.has(dest)) {
    fs.copyFileSync(path.join(AUDIO_SRC, f), path.join(AUDIO_DEST, dest));
    copied++;
  }
  if ((i + 1) % 100 === 0 || i === srcFiles.length - 1) {
    process.stdout.write(`\r   ${i + 1}/${srcFiles.length} verificados, ${copied} copiados`);
  }
});

const finalCount = (Get => Get)(fs.readdirSync(AUDIO_DEST).filter(f => f.endsWith('.mp3')).length);
console.log(`\n   ✓ ${finalCount} MP3s em dist/audio`);

// ── Step 2: deploy via firebase CLI with service account ──────────────────
console.log('\n[2/3] Iniciando deploy no Firebase Hosting...');
console.log('   Projeto: gdm-live-radio');
console.log('   Diretório: frontend/dist');
console.log('   Arquivos: ' + (fs.readdirSync(DIST_DIR, { recursive: false }).length) + ' na raiz + audio/');

process.env.GOOGLE_APPLICATION_CREDENTIALS = SA_PATH;

try {
  execSync(
    'npx --yes firebase-tools@latest deploy --only hosting --project gdm-live-radio',
    {
      cwd: 'E:\\GDM_LIVE_RADIO',
      encoding: 'utf8',
      stdio: 'inherit',
      timeout: 30 * 60 * 1000, // 30 min
      env: {
        ...process.env,
        GOOGLE_APPLICATION_CREDENTIALS: SA_PATH,
      }
    }
  );
  console.log('\n[3/3] ✓ Deploy concluído com sucesso!');
  console.log('   Site: https://gdmlr.web.app/');
} catch (err) {
  console.error('\n[ERRO] Deploy falhou:', err.message);
  process.exit(1);
}

