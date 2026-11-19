/// <reference types="@sveltejs/kit" />
import { build, files, prerendered, version } from '$service-worker';

const CACHE = `klassesachsen-${version}`;
// a Set: addAll rejects duplicate requests, and prerendered already holds '/'
const ASSETS = [...new Set([...build, ...files, ...prerendered, '/'])];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

const IMMUTABLE = new Set([...build, ...files]);

// Same-origin GET only, never third parties. Built assets and static files: cache first.
// Pages: network first, so a deploy reaches the next load; the cache answers offline.
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	if (request.method !== 'GET' || url.origin !== self.location.origin) return;
	if (IMMUTABLE.has(url.pathname)) {
		event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request)));
		return;
	}
	event.respondWith(
		fetch(request)
			.then((res) => {
				if (res.ok) {
					const kopie = res.clone();
					caches.open(CACHE).then((c) => c.put(request, kopie));
				}
				return res;
			})
			.catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => hit ?? Response.error()))
	);
});
