<script>
	// Classroom variant: the photo stands in for the room, with its "find it in the picture" task.
	import { t } from '$lib/spiel.svelte.js';
	/** @type {{ raum: { text: any, bild: { src: string, alt: string } } | null }} */
	let { raum } = $props();
</script>

{#if raum}
	<figure class="raum">
		<img src={raum.bild.src} alt={raum.bild.alt} />
		<figcaption class="fett">{t(raum.text)}</figcaption>
	</figure>
{/if}

<style>
	.raum {
		margin: 0 0 1.25rem; background: var(--leiste); padding: 0.75rem; max-width: 48rem;
		display: grid; grid-template-columns: minmax(0, 15rem) 1fr; gap: 1rem; align-items: center;
	}
	.raum img { width: 100%; max-height: 14rem; object-fit: contain; }
	@media (max-width: 30rem) { .raum { grid-template-columns: 1fr; } }
</style>
