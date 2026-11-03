/**
 * release_perfect_hybrid.js
 * Combines all 402 previously-uploaded audio file hashes from version 2c0ae1bd759fda78
 * with the latest frontend build (HTML, JS, CSS, Open Graph preview image) from cd5ff7b020f59f61.
 * Deploys instantly to both gdmlr and gdm-live-radio via the Firebase Hosting API!
 */

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const path = require('path');
const sa = require(path.resolve(__dirname, '../gdm-live-radio-firebase-adminsdk-fbsvc-f253de6196.json'));
const SITES = ['gdmlr', 'gdm-live-radio'];

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

async function getVersionFiles(token, site, version) {
  const res = await request(`https://firebasehosting.googleapis.com/v1beta1/sites/${site}/versions/${version}/files?pageSize=1000`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.files || [];
}

async function deploySite(token, site) {
  console.log(`\n========================================`);
  console.log(`🚀 Preparando release completo para: ${site}`);
  console.log(`========================================`);

  // 1. Get audio files from version 2c0ae1bd759fda78
  const baseFiles = await getVersionFiles(token, 'gdmlr', '2c0ae1bd759fda78');
  console.log(`✓ Recuperados ${baseFiles.length} arquivos base da versão de áudio`);

  // 2. Get latest build files from version cd5ff7b020f59f61
  const latestBuildFiles = await getVersionFiles(token, 'gdmlr', 'cd5ff7b020f59f61');
  console.log(`✓ Recuperados ${latestBuildFiles.length} arquivos da compilação mais recente`);

  // 3. Build unified file map
  const fileMap = {};
  baseFiles.forEach(f => fileMap[f.path] = f.hash);
  // Overwrite with latest HTML/JS/CSS/OG image
  latestBuildFiles.forEach(f => fileMap[f.path] = f.hash);

  const totalFiles = Object.keys(fileMap).length;
  const audioCount = Object.keys(fileMap).filter(p => p.startsWith('/audio/')).length;
  console.log(`✓ Mapa unificado: ${totalFiles} arquivos totais, sendo ${audioCount} faixas de áudio MP3`);

  // 4. Create new version with hosting configuration
  const config = {
    headers: [
      {
        glob: '**/*.@(mp3)',
        headers: {
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=86400'
        }
      },
      {
        glob: '**/*.@(js|css|woff|woff2|ttf|eot)',
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable'
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
  console.log(`2. Populando todos os ${totalFiles} arquivos via tabela de hashes (sem upload repetido)...`);
  const populateRes = await request(`https://firebasehosting.googleapis.com/v1beta1/${versionName}:populateFiles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, { files: fileMap });

  const uploadRequired = populateRes.uploadRequiredHashes || [];
  console.log(`✓ Arquivos mapeados com sucesso! Hashes requeridos para upload: ${uploadRequired.length}`);
  if (uploadRequired.length > 0) {
    console.warn(`Atenção: ${uploadRequired.length} hashes não foram encontrados no armazenamento.`);
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
  console.log('=== GDM LIVE RADIO — LANÇAMENTO DEFINITIVO 402 MÚSICAS ===');
  const token = await getToken();
  console.log('✓ Token OAuth obtido com sucesso!');

  for (const site of SITES) {
    await deploySite(token, site);
  }

  console.log('\n======================================================');
  console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO EM AMBOS OS SITES!');
  console.log('🌐 https://gdmlr.web.app/');
  console.log('🌐 https://gdm-live-radio.web.app/');
  console.log('======================================================');
}

main().catch(err => {
  console.error('\n❌ ERRO FATAL:', err.message);
  process.exit(1);
});
