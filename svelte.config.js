import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({ fallback: undefined, strict: true }),
		// Prerender everything; the service worker handles offline.
		prerender: { handleHttpError: 'fail' }
	}
};
