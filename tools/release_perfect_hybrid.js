/**
 * release_perfect_hybrid.js
 * Combines all 402 previously-uploaded audio file hashes from version 2c0ae1bd759fda78
 * with the latest frontend build (HTML, JS, CSS, images, Open Graph cards) from frontend/dist.
 * Uploads any newly changed files to Firebase Hosting and deploys instantly to both gdmlr and gdm-live-radio!
 */

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const sa = require(path.resolve(__dirname, '../gdm-live-radio-firebase-adminsdk-fbsvc-f253de6196.json'));
const SITES = ['gdmlr', 'gdm-live-radio'];
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');

function getToken() {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: sa.client_email,
      sub: sa.client_email,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
      scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase'
    })).toString('base64url');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(header + '.' + payload);
    const jwt = header + '.' + payload + '.' + sign.sign(sa.private_key, 'base64url');
    const postData = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }).toString();

    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        const parsed = JSON.parse(b);
        if (parsed.access_token) resolve(parsed.access_token);
        else reject(new Error('Token error: ' + b));
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode} on ${url}: ${body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(body);
          else reject(new Error(`HTTP ${res.statusCode} on ${url}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

function uploadFile(uploadUrl, token, hash, gzippedBuffer) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${uploadUrl}/${hash}`;
    const req = https.request(fullUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': gzippedBuffer.length
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(b);
        } else {
          reject(new Error(`Upload failed for hash ${hash} with status ${res.statusCode}: ${b}`));
        }
      });
    });
    req.on('error', reject);
    req.write(gzippedBuffer);
    req.end();
  });
}

async function getVersionFiles(token, site, version) {
  const res = await request(`https://firebasehosting.googleapis.com/v1beta1/sites/${site}/versions/${version}/files?pageSize=1000`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.files || [];
}

function scanDistFiles(dir, baseDir = dir) {
  const list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Ignore audio dir in local scan since we use the verified hosting audio hashes
    if (entry.isDirectory()) {
      if (entry.name !== 'audio') {
        list.push(...scanDistFiles(fullPath, baseDir));
      }
    } else {
      const relPath = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const raw = fs.readFileSync(fullPath);
      // Firebase Hosting requires gzipped uploads, and the hash in populateFiles must match the gzipped payload
      const gzipped = zlib.gzipSync(raw, { level: 9 });
      const hash = crypto.createHash('sha256').update(gzipped).digest('hex');
      list.push({ path: relPath, hash, gzipped, fullPath });
    }
  }
  return list;
}

async function deploySite(token, site) {
  console.log(`\n========================================`);
  console.log(`🚀 Preparando release completo para: ${site}`);
  console.log(`========================================`);

  // 1. Get 402 audio files from permanent version 2c0ae1bd759fda78
  const baseFiles = await getVersionFiles(token, 'gdmlr', '2c0ae1bd759fda78');
  const audioFiles = baseFiles.filter(f => f.path.startsWith('/audio/'));
  console.log(`✓ Recuperadas ${audioFiles.length} faixas de áudio da biblioteca hospedada`);

  // 2. Scan local dist files (HTML, JS, CSS, images, etc.)
  const distFiles = scanDistFiles(DIST_DIR);
  console.log(`✓ Escaneados ${distFiles.length} arquivos locais recém-compilados em frontend/dist`);

  // 3. Build unified file map and hash-to-buffer map
  const fileMap = {};
  const hashToBuffer = {};

  // Audio files mapping
  audioFiles.forEach(f => fileMap[f.path] = f.hash);

  // Local dist files mapping (will overwrite any older web asset)
  distFiles.forEach(f => {
    fileMap[f.path] = f.hash;
    hashToBuffer[f.hash] = f.gzipped;
  });

  const totalFiles = Object.keys(fileMap).length;
  const audioCount = Object.keys(fileMap).filter(p => p.startsWith('/audio/')).length;
  console.log(`✓ Mapa unificado: ${totalFiles} arquivos totais (${audioCount} áudios + ${distFiles.length} estáticos)`);

  // 4. Create new version with hosting configuration including complete CORS & Cache headers
  const config = {
    headers: [
      {
        glob: '**',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*'
        }
      },
      {
        glob: '/index.html',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      },
      {
        glob: '**/*.@(jpg|jpeg|png|webp|svg|ico)',
        headers: {
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      },
      {
        glob: '**/*.@(mp3)',
        headers: {
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      },
      {
        glob: '**/*.@(js|css|woff|woff2|ttf|eot)',
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*'
        }
      }
    ],
    rewrites: [
      {
        glob: '**',
        path: '/index.html'
      }
    ]
  };

  console.log(`1. Criando nova versão no Firebase Hosting...`);
  const newVersion = await request(`https://firebasehosting.googleapis.com/v1beta1/sites/${site}/versions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, { config });

  const versionName = newVersion.name;
  console.log(`✓ Nova versão criada: ${versionName}`);

  // 5. Populate files using hash mapping
  console.log(`2. Populando todos os ${totalFiles} arquivos via tabela de hashes...`);
  const populateRes = await request(`https://firebasehosting.googleapis.com/v1beta1/${versionName}:populateFiles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, { files: fileMap });

  const uploadRequired = populateRes.uploadRequiredHashes || [];
  const uploadUrl = populateRes.uploadUrl;
  console.log(`✓ Arquivos mapeados com sucesso! Hashes requeridos para upload: ${uploadRequired.length}`);

  // Upload any new or modified file
  if (uploadRequired.length > 0) {
    console.log(`Enviando ${uploadRequired.length} arquivo(s) novo(s)...`);
    for (const h of uploadRequired) {
      const buf = hashToBuffer[h];
      if (buf) {
        await uploadFile(uploadUrl, token, h, buf);
        console.log(`  ✓ Upload concluído para hash ${h.slice(0, 12)}...`);
      } else {
        console.warn(`  ⚠️ Buffer não encontrado localmente para hash ${h}`);
      }
    }
  }

  // 6. Finalize version
  console.log(`3. Finalizando versão para publicação...`);
  const finalized = await request(`https://firebasehosting.googleapis.com/v1beta1/${versionName}?update_mask=status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, { status: 'FINALIZED' });
  console.log(`✓ Versão finalizada com status: ${finalized.status} (Arquivos: ${finalized.fileCount})`);

  // 7. Create release to set it live
  console.log(`4. Liberando versão publicamente no site ${site}...`);
  const release = await request(`https://firebasehosting.googleapis.com/v1beta1/sites/${site}/releases?versionName=${encodeURIComponent(versionName)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log(`🎉 RELEASE PUBLICADO COM SUCESSO!`);
  console.log(`Release ID: ${release.name}`);
  console.log(`Release Time: ${release.releaseTime}`);
}

async function main() {
  console.log('=== GDM LIVE RADIO — DEPLOY HÍBRIDO AVANÇADO (CORS + OPEN GRAPH + 402 ÁUDIOS) ===');
  const token = await getToken();
  console.log('✓ Token OAuth obtido com sucesso!');

  for (const site of SITES) {
    await deploySite(token, site);
  }

  console.log('\n======================================================');
  console.log('✅ DEPLOY 100% CONCLUÍDO E ATIVO EM PRODUÇÃO!');
  console.log('🌐 https://gdmlr.web.app/');
  console.log('🌐 https://gdm-live-radio.web.app/');
  console.log('======================================================');
}

main().catch(err => {
  console.error('\n❌ ERRO FATAL:', err.message);
  process.exit(1);
});
