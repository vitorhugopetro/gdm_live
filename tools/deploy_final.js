/**
 * deploy_final.js  
 * Usa o token OAuth via service account JWT e faz deploy site por site.
 * Usa spawn em vez de execSync para não travar em background tasks.
 */

const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const { spawn } = require('child_process');
const path = require('path');

const SA_PATH = 'E:\\GDM_LIVE_RADIO\\gdm-live-radio-firebase-adminsdk-fbsvc-f253de6196.json';
const PROJECT = 'gdm-live-radio';
const SITES = ['gdmlr', 'gdm-live-radio'];

// ── Step 1: Get access token ───────────────────────────────────────────────
function getToken() {
  return new Promise((resolve, reject) => {
    const sa = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: sa.client_email, sub: sa.client_email,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now, exp: now + 3600,
      scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase'
    })).toString('base64url');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${header}.${payload}`);
    const jwt = `${header}.${payload}.${sign.sign(sa.private_key, 'base64url')}`;

    const postData = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }).toString();
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const data = JSON.parse(body);
        if (data.access_token) resolve(data.access_token);
        else reject(new Error('No access token: ' + body));
      });
    });
    req.on('error', reject);
    req.write(postData); req.end();
  });
}

// ── Step 2: Deploy one site using spawn ───────────────────────────────────
function deploySite(site, token) {
  return new Promise((resolve, reject) => {
    console.log(`\n[DEPLOY] Iniciando deploy do site: ${site}...`);
    
    const args = [
      'firebase-tools', 'deploy',
      '--only', `hosting:${site}`,
      '--project', PROJECT,
      '--token', token,
      '--force'
    ];

    const proc = spawn('npx', args, {
      cwd: 'E:\\GDM_LIVE_RADIO',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, CI: '1', FORCE_COLOR: '0' }
    });

    let lastLine = '';
    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        const clean = line.replace(/\r/g, '').trim();
        if (clean && clean !== lastLine) {
          console.log(`  [${site}] ${clean}`);
          lastLine = clean;
        }
      });
    });
    proc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        const clean = line.replace(/\r/g, '').trim();
        if (clean && !clean.startsWith('!') && !clean.includes('deprecated')) {
          console.error(`  [${site}][ERR] ${clean}`);
        }
      });
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`\n  ✓ Site "${site}" deployed com sucesso!`);
        resolve();
      } else {
        reject(new Error(`Deploy do site "${site}" falhou com código ${code}`));
      }
    });
    proc.on('error', reject);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== GDM Live Radio — Deploy Final ===\n');
  
  // Verify dist/audio
  const audioDir = 'E:\\GDM_LIVE_RADIO\\frontend\\dist\\audio';
  const mp3Count = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3')).length;
  console.log(`[INFO] dist/audio: ${mp3Count} MP3s prontos`);
  
  // Get token
  console.log('[1/3] Obtendo token de acesso...');
  const token = await getToken();
  console.log('  ✓ Token obtido!');

  // Deploy each site sequentially (not parallel — avoids stat race conditions on Windows)
  console.log('[2/3] Fazendo deploy dos sites (sequencial)...');
  for (const site of SITES) {
    await deploySite(site, token);
  }

  console.log('\n[3/3] ✓ Deploy completo!');
  console.log('  🌐 https://gdmlr.web.app/');
  console.log('  🌐 https://gdm-live-radio.web.app/');
}

main().catch(err => {
  console.error('\n[FATAL]', err.message);
  process.exit(1);
});

