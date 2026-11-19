<script>
	import { spiel, r, station, geheZu } from '$lib/spiel.svelte.js';
	import Leiste from './Leiste.svelte';
	import Karte from './Karte.svelte';

	const n = $derived(spiel.station);
	const zustand = $derived(spiel.karten[n] ?? { gedreht: false, abgelegt: '' });
	let seite = $state(/** @type {'vorne' | 'hinten'} */ ('vorne'));
	let hinweis = $state(false);

	function umdrehen() {
		seite = seite === 'vorne' ? 'hinten' : 'vorne';
		if (seite === 'hinten') spiel.karten[n] = { ...zustand, gedreht: true };
	}
	function ablegen() {
		if (!zustand.gedreht) {
			hinweis = true;
			return;
		}
		const d = new Date();
		spiel.karten[n] = { gedreht: true, abgelegt: `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.` };
		geheZu('vitrine');
	}
</script>

<Leiste info={r('station', { n, ort: station(n).ort.anzeige })} />
<div class="zwei">
	<div class="stapel">
		<h1 tabindex="-1">{station(n).objekt}</h1>
		<p class="leise">{r('karte-neu')}</p>
		<div class="reihe">
			<button class="knopf" onclick={umdrehen}>
				<span aria-hidden="true">⇄</span>
				{seite === 'vorne' ? r('umdrehen') : r('vorderseite')}
			</button>
			<button class="knopf haupt" aria-disabled={!zustand.gedreht} onclick={ablegen}>{r('ablegen')}</button>
		</div>
		<p role="status" class:fett={hinweis}>{!zustand.gedreht ? r('erst-umdrehen') : ''}</p>
	</div>
	<div aria-live="polite">
		{#key seite}<Karte {n} {seite} />{/key}
	</div>
</div>
