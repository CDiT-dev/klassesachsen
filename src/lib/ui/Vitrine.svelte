<script>
	// Home between stations: the wall with three mounts and the next hand-over at the bottom.
	import { spiel, r, Q, station, offeneStation, zurStation, geheZu } from '$lib/spiel.svelte.js';
	import Leiste from './Leiste.svelte';
	import Karte from './Karte.svelte';

	const naechste = $derived(offeneStation());
</script>

<Leiste />
<h1 class="gross" tabindex="-1">{r('titel')}</h1>
<p class="leise">{r('vitrine-text')}</p>

<ul class="wand">
	{#each Q.stationen as s (s.id)}
		<li>
			{#if spiel.karten[s.nummer]?.abgelegt}
				<Karte n={s.nummer} kompakt />
			{:else}
				<div class="leer" class:ziel={s.nummer === naechste}>
					<span class="leise klein fett nr">{s.fund}</span>
					<h2>{s.objekt}</h2>
					<p class="leise klein">{r('leer', { ort: s.ort.anzeige })}</p>
				</div>
			{/if}
		</li>
	{/each}
</ul>

<div class="leiste-unten">
	{#if naechste}
		<p class="hinweis">{r('naechste', { ort: station(naechste).ort.anzeige })}</p>
		<button class="knopf haupt" onclick={() => zurStation(naechste)}>
			{r('zu-station', { n: naechste })} <span aria-hidden="true">→</span>
		</button>
	{:else}
		<p class="hinweis">{r('alle-gefunden')}</p>
		<button class="knopf haupt" onclick={() => { spiel.amTablet = r('alle'); geheZu('gestalten'); }}>
			{r('gestalten-los')} <span aria-hidden="true">→</span>
		</button>
	{/if}
</div>

<style>
	.wand { list-style: none; padding: 0; margin: 1.5rem 0 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); }
	.leer {
		height: 100%; min-height: 12rem; border: 3px dashed var(--aus); padding: 1rem;
		display: flex; flex-direction: column; justify-content: flex-end;
	}
	.leer.ziel { border-color: #fff; }
	.leer h2 { margin: 0.4rem 0; }
	.nr { font-family: var(--mono); }
	.leiste-unten {
		display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;
		background: var(--leiste); padding: 1rem 1.25rem; margin-top: 1.5rem;
	}
	.leiste-unten .hinweis { flex: 1 1 18rem; margin: 0; }
</style>
