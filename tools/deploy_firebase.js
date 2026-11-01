const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const { execSync } = require('child_process');

// 1. Read service account
const saPath = 'E:\\GDM_LIVE_RADIO\\gdm-live-radio-firebase-adminsdk-fbsvc-f253de6196.json';
if (!fs.existsSync(saPath)) {
  console.error('Service account key not found at', saPath);
  process.exit(1);
}
const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));

// 2. Create JWT
const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const payload = Buffer.from(JSON.stringify({
  iss: sa.client_email,
  sub: sa.client_email,
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
  scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase'
})).toString('base64url');

const sign = crypto.createSign('RSA-SHA256');
sign.update(`${header}.${payload}`);
const signature = sign.sign(sa.private_key, 'base64url');
const jwt = `${header}.${payload}.${signature}`;

// 3. Exchange JWT for access token
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
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.access_token) {
        console.log('Access token obtained successfully!');
        // Now run firebase deploy
        process.env.FIREBASE_TOKEN = data.access_token;
        console.log('Deploying hosting to project gdm-live-radio...');
        const out = execSync(`npx --yes firebase-tools deploy --only hosting --project gdm-live-radio --token "${data.access_token}"`, {
          encoding: 'utf8',
          stdio: 'inherit'
        });
        console.log('Firebase deploy completed successfully!');
      } else {
        console.error('Failed to obtain access token:', body);
      }
    } catch (e) {
      console.error('Error parsing response:', e, body);
    }
  });
});

req.on('error', (e) => {
  console.error('Token request error:', e);
});

req.write(postData);
req.end();
