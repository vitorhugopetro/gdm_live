const https = require('https');

https.get('https://gdmlr.web.app', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const match = body.match(/assets\/index-[^"']+\.js/);
    console.log('Deployed bundle on https://gdmlr.web.app:', match ? match[0] : 'not found');
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
});

