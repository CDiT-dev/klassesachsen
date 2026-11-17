<script>
	let { children } = $props();
</script>

<a class="skip" href="#main">Zum Inhalt</a>
<main id="main">{@render children()}</main>
<footer>
	<a href="/impressum/">Impressum</a>
	<a href="/datenschutz/">Datenschutz</a>
	<a href="https://github.com/CDiT-dev/klassesachsen">Quellcode (EUPL 1.2)</a>
</footer>

<style>
	:global(body) {
		margin: 0;
		font: 1.125rem/1.5 system-ui, sans-serif;
		background: #1f4d3a;
		color: #fff;
	}
	:global(a) { color: #fff; }
	:global(:focus-visible) { outline: 3px solid #fff; outline-offset: 2px; }
	main { padding: 2rem 1rem; max-width: 60rem; margin: 0 auto; min-height: 70vh; }
	footer { display: flex; gap: 1.5rem; flex-wrap: wrap; padding: 1rem; max-width: 60rem; margin: 0 auto; }
	footer a { min-height: 48px; display: inline-flex; align-items: center; }
	.skip { position: absolute; left: -999px; }
	.skip:focus { left: 1rem; top: 1rem; background: #000; padding: .5rem; }
</style>
