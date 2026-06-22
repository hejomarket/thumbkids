import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'src'), { recursive: true });
await mkdir(join(dist, 'assets'), { recursive: true });

const html = await readFile(join(root, 'index.html'), 'utf8');
await writeFile(join(dist, 'index.html'), html.replace('/src/main.js', './src/main.js'));
await cp(join(root, 'src'), join(dist, 'src'), { recursive: true });
await cp(join(root, 'public', 'assets'), join(dist, 'assets'), { recursive: true });

console.log('Built Thumb Kids prototype to dist/');
