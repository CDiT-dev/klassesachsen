<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { spiel, laden, speichern } from '$lib/spiel.svelte.js';

	let { children } = $props();
	let bereit = $state(false);

	onMount(() => {
		// after a deploy an open page may ask for chunks that are gone: load the new version
		window.addEventListener('vite:preloadError', () => location.reload());
		laden();
		bereit = true;
	});
	$effect(() => {
		document.documentElement.classList.toggle('gross', spiel.gross);
		if (bereit) speichern(); // JSON.stringify reads every field, so any change saves
	});
</script>

<a class="skip" href="#main">Zum Inhalt</a>
<main id="main">{@render children()}</main>
<footer>
	<a href="/quellen/">Quellen und Bilder</a>
	<a href="/demo/">Was diese Demo zeigt</a>
	<a href="/impressum/">Impressum</a>
	<a href="/datenschutz/">Datenschutz</a>
	<a href="https://github.com/CDiT-dev/klassesachsen">Quellcode (EUPL 1.2)</a>
</footer>

<style>
	main { padding: 1rem 1rem 2rem; max-width: 76rem; margin: 0 auto; min-height: 80vh; }
	@media (min-width: 52rem) { main { padding: 1.75rem 3.5rem 2.5rem; } }
	footer {
		display: flex; gap: 0.25rem 1.5rem; flex-wrap: wrap;
		padding: 1rem; max-width: 76rem; margin: 0 auto;
		font-size: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.2);
	}
	@media (min-width: 52rem) { footer { padding: 1rem 3.5rem; } }
	footer a { min-height: 48px; display: inline-flex; align-items: center; color: var(--gedaempft); }
	.skip { position: absolute; left: -999px; }
	.skip:focus { left: 1rem; top: 1rem; background: #000; padding: 0.5rem; z-index: 10; }
</style>
