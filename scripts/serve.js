import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 5173);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg' };

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://localhost:${port}`);
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = join(root, pathname);
  if (!filePath.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    await stat(filePath);
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
