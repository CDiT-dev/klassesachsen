// Checks the built PWA: manifest, service worker, legal pages, no third-party URLs.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const out = 'build';
for (const f of ['index.html', 'quellen/index.html', 'demo/index.html', 'fonts/archivo-latin-wdth-normal.woff2', 'bilder/zellengewoelbe.jpg', 'impressum/index.html', 'datenschutz/index.html', 'manifest.webmanifest', 'service-worker.js'])
	assert.ok(existsSync(join(out, f)), `missing ${f}`);

const manifest = JSON.parse(readFileSync(join(out, 'manifest.webmanifest'), 'utf8'));
assert.ok(manifest.icons.length >= 2 && manifest.display === 'standalone');

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const allowed = /^https?:\/\/(www\.w3\.org|github\.com\/CDiT-dev\/klassesachsen|klassesachsen\.cdit-works\.de|svelte\.dev)/;
// Source and licence links from the content file are citations the reader may follow, never loaded by the app.
const zitate = new Set(readFileSync('content/quest.de.json', 'utf8').match(/https?:\/\/[^\s"]+/g));
const urls = /https?:\/\/[^\s"'`)<>\\]+/g;
for (const f of walk(out).filter((f) => /\.(html|js|css|webmanifest)$/.test(f))) {
	const text = readFileSync(f, 'utf8');
	for (const u of text.match(urls) ?? [])
		// the URL pattern stops at ")", so a citation may show up cut short
		if (![...zitate].some((z) => z.startsWith(u.replace(/&amp;/g, '&')))) assert.match(u, allowed, `third-party URL ${u} in ${f}`);
	// nothing is ever loaded from another origin
	assert.doesNotMatch(text, /\b(src|srcset|data)=["']?https?:\/\//i, `foreign resource in ${f}`);
}
console.log('build ok');
