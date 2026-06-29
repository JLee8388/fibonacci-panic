// Build step:
//  1. Vendor the Lucide icon UMD bundle from node_modules into www/assets, so
//     the app ships it locally (no CDN, works offline, satisfies Apple 2.5.2).
//  2. Bundle the ES-module source in src/ (plus the Capacitor plugins) into a
//     single minified www/assets/app.js. Nothing is fetched at runtime.

import esbuild from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function vendorLucide() {
  const src = require.resolve('lucide/dist/umd/lucide.min.js');
  const dest = resolve(root, 'www/assets/lucide.min.js');
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(src, dest);
  console.log('Vendored lucide.min.js');
}

const options = {
  entryPoints: [resolve(root, 'src/main.js')],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  target: ['es2020', 'safari14'],
  outfile: resolve(root, 'www/assets/app.js'),
  logLevel: 'info',
};

const watch = process.argv.includes('--watch');

await vendorLucide();

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('esbuild watching for changes…');
} else {
  await esbuild.build(options);
  console.log('Built www/assets/app.js');
}
