<script>
	// Source line under a text: short titles, each linked to the attribution page.
	import { Q, r } from '$lib/spiel.svelte.js';
	/** @type {{ ids?: string[] }} */
	let { ids = [] } = $props();
</script>

{#if ids.length}
	<p class="quellen">
		{r('quellen')}:
		{#each ids as id, i (id)}<a href="/quellen/#{id}">{Q.quellen[id].titel}</a>{i < ids.length - 1 ? '; ' : ''}{/each}
	</p>
{/if}

<style>
	.quellen { font-size: 0.9rem; margin: 0.75rem 0 0; opacity: 0.9; }
	.quellen a { color: inherit; }
</style>
