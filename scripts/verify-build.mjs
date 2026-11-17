// Checks the built PWA: manifest, service worker, legal pages, no third-party URLs.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const out = 'build';
for (const f of ['index.html', 'impressum/index.html', 'datenschutz/index.html', 'manifest.webmanifest', 'service-worker.js'])
	assert.ok(existsSync(join(out, f)), `missing ${f}`);

const manifest = JSON.parse(readFileSync(join(out, 'manifest.webmanifest'), 'utf8'));
assert.ok(manifest.icons.length >= 2 && manifest.display === 'standalone');

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const allowed = /^https?:\/\/(www\.w3\.org|github\.com\/CDiT-dev\/klassesachsen|klassesachsen\.cdit-works\.de|svelte\.dev)/;
for (const f of walk(out).filter((f) => /\.(html|js|css|webmanifest)$/.test(f))) {
	for (const u of readFileSync(f, 'utf8').match(/https?:\/\/[^\s"'`)<>\\]+/g) ?? [])
		assert.match(u, allowed, `third-party URL ${u} in ${f}`);
}
console.log('build ok');
