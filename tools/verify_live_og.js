const https = require('https');

https.get('https://gdmlr.web.app', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const titleMatch = body.match(/property="og:title" content="([^"]+)"/);
    const imgMatch = body.match(/property="og:image" content="([^"]+)"/);
    const descMatch = body.match(/property="og:description" content="([^"]+)"/);
    const hasContemp = body.toLowerCase().includes('contemporânea') || body.toLowerCase().includes('contemporanea');
    
    console.log('--- VERIFICAÇÃO LIVE OG TAGS ---');
    console.log('Status HTTP:', res.statusCode);
    console.log('OG Title:', titleMatch ? titleMatch[1] : 'NÃO ENCONTRADO');
    console.log('OG Image:', imgMatch ? imgMatch[1] : 'NÃO ENCONTRADO');
    console.log('OG Desc:', descMatch ? descMatch[1] : 'NÃO ENCONTRADO');
    console.log('Palavra contemporânea no HTML inicial:', hasContemp ? 'PRESENTE (ERRO)' : 'REMOVIDA (SUCESSO)');
  });
}).on('error', e => console.error(e));
