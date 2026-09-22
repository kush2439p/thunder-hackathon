const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {createGzip} = require('node:zlib');
const root = path.resolve(__dirname, '../out');
const port = Number(process.env.PORT || 3001);
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain'};
http.createServer((req,res) => {
 let pathname;
 try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
 if (pathname === '/favicon.ico') { res.writeHead(302, {Location:'/icon.svg'}); return res.end(); }
 let target = path.resolve(root, '.' + pathname);
 if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
 if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
 if (!fs.existsSync(target)) { res.writeHead(404); return res.end('Not found'); }
 const ext = path.extname(target);
 const gzip = /gzip/.test(req.headers['accept-encoding'] || '') && ['.html','.js','.css','.json','.txt','.svg'].includes(ext);
 res.writeHead(200, {'Content-Type':mime[ext] || 'application/octet-stream','Cache-Control':'no-cache','Vary':'Accept-Encoding',...(gzip ? {'Content-Encoding':'gzip'} : {})});
 if (req.method === 'HEAD') return res.end();
 const stream = fs.createReadStream(target);
 stream.on('error', () => res.destroy());
 if (gzip) stream.pipe(createGzip()).pipe(res); else stream.pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('STRIKE preview: http://localhost:'+port));
