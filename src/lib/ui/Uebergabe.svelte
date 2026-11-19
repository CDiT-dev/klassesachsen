<script>
	// Full-screen hand-over, printed twice so it reads from both sides of a tablet lying flat.
	import { spiel, r, geheZu } from '$lib/spiel.svelte.js';
	const rolle = $derived(spiel.amTablet);
</script>

<div class="uebergabe">
	<div class="kopfueber" aria-hidden="true">
		<p class="rolle titel">{rolle}</p>
		<p>{r('uebergabe', { rolle })}</p>
	</div>
	<div class="stapel">
		<p class="rolle titel" aria-hidden="true">{rolle}</p>
		<h1 tabindex="-1">{r('uebergabe', { rolle })}</h1>
		<p class="leise">{r(`uebergabe-${rolle}`)}</p>
		<button class="knopf haupt" onclick={() => geheZu(spiel.weiter.screen, spiel.weiter)}>{r('uebergabe-ok')}</button>
	</div>
</div>

<style>
	.uebergabe {
		min-height: 75vh; display: grid; grid-template-rows: 1fr auto; gap: 2rem;
		background: var(--leiste); margin: -1rem; padding: 2rem 1.5rem;
	}
	@media (min-width: 52rem) { .uebergabe { margin: -1.75rem -3.5rem 0; padding: 2.5rem 3.5rem; } }
	.kopfueber { transform: rotate(180deg); align-self: start; opacity: 0.85; border-bottom: 2px dashed var(--aus); padding-bottom: 1rem; }
	.rolle { font-size: clamp(3rem, 10vw, 6rem); margin: 0; }
	h1 { font-size: clamp(1.6rem, 3vw + 0.5rem, 2.5rem); }
</style>
