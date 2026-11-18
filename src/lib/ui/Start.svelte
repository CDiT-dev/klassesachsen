<script>
	import { spiel, r, Q, geheZu, neuAnfangen } from '$lib/spiel.svelte.js';
	import Leiste from './Leiste.svelte';

	function allein() {
		neuAnfangen();
		Object.assign(spiel, { modus: 'allein', groesse: 1, ort: 'klasse' });
		geheZu('gruppe');
	}
	function klasse() {
		neuAnfangen();
		spiel.modus = 'klasse';
		geheZu('code');
	}
</script>

<Leiste>
	{#snippet links()}<p class="leise klein angebot">{r('angebot')}</p>{/snippet}
</Leiste>

<div class="zwei links">
	<div class="stapel">
		<h1 class="gross" tabindex="-1">{r('titel')}</h1>
		<p class="leise">{r('start-text')}</p>
		<button class="knopf haupt breit" onclick={klasse}>
			<span>{r('klasse')} <span class="sub">{r('klasse-sub')}</span></span><span aria-hidden="true">→</span>
		</button>
		<button class="knopf breit" onclick={allein}>
			<span>{r('allein')} <span class="sub">{r('allein-sub')}</span></span><span aria-hidden="true">→</span>
		</button>
		<div class="reihe">
			<a class="knopf" href="/demo/">{r('demo-zeigt')}</a>
			<a class="knopf" href="/quellen/">{r('quellen-link')}</a>
		</div>
	</div>
	<ul class="mounts" aria-hidden="true">
		{#each Q.stationen as s (s.id)}
			<li><span class="leise klein fett">Fund {s.nummer}</span><span class="titel">{s.objekt}</span></li>
		{/each}
	</ul>
</div>

<style>
	.angebot { max-width: 28rem; margin: 0; }
	.mounts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.9rem; align-self: center; }
	.mounts li {
		border: 3px dashed var(--aus); min-height: 13rem; padding: 0.9rem;
		display: flex; flex-direction: column; justify-content: flex-end; gap: 0.3rem;
	}
	.mounts .titel { font-size: 1.15rem; margin: 0; hyphens: auto; }
	@media (max-width: 52rem) { .mounts { display: none; } }
</style>
