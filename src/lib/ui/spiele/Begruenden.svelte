<script>
	// After a vote: the team picks a reason (or writes its own, without names); it goes on the card front.
	import { untrack } from 'svelte';
	import { spiel, r, t, naechsterSchritt, geheZu } from '$lib/spiel.svelte.js';
	import Wahl from '../Wahl.svelte';

	/** @type {{ st: any }} */
	let { st } = $props();
	const e = $derived(spiel.ergebnis[st.nummer]);
	const ab = $derived(st.spiel.abstimmung);
	const tx = $derived(st.texte[`begruenden-${ab.stimmen[e.wahl ?? 0]}`]);
	const gruende = $derived(spiel.sprache === 'leicht' ? tx.gruende_leicht : tx.gruende);

	// start from a reason given before (after "Nochmal abstimmen" or a reload)
	const vorher = untrack(() => ({ g: e.grund, bekannt: gruende.includes(e.grund) }));
	let auswahl = $state(vorher.bekannt ? vorher.g : vorher.g ? '__eigen' : '');
	let eigen = $state(vorher.bekannt ? '' : vorher.g);
	const grund = $derived(auswahl === '__eigen' ? eigen.trim() : auswahl);

	function schreiben() {
		if (!grund) return;
		e.grund = grund;
		naechsterSchritt();
	}
	function nochmal() {
		Object.assign(e, { runden: [], wahl: null, grund: '' });
		geheZu('station', { schritt: spiel.schritt - 1 });
	}
</script>

<h1 tabindex="-1">{r('begruenden-titel')}</h1>
<p class="leise">{t(tx)}</p>
<div class="stapel">
	<Wahl
		legende={r('grund-waehlen')}
		name="grund"
		bind:wert={auswahl}
		optionen={[...gruende.map((/** @type {string} */ g) => ({ wert: g, text: g })), { wert: '__eigen', text: t(st.texte['eigener-grund']) }]}
	/>
	{#if auswahl === '__eigen'}
		<div>
			<label for="eigen" class="sr">{t(st.texte['eigener-grund'])}</label>
			<input id="eigen" bind:value={eigen} maxlength="80" placeholder={r('grund-platzhalter')} aria-describedby="eigen-hilfe" />
			<p id="eigen-hilfe" class="leise klein">{r('grund-hilfe')}</p>
		</div>
	{/if}
</div>
<div class="unten">
	<button class="knopf" onclick={nochmal}>{r('nochmal')}</button>
	<button class="knopf haupt" aria-disabled={!grund} onclick={schreiben}>{r('auf-karte')} <span aria-hidden="true">→</span></button>
</div>

<style>
	input {
		width: 100%; max-width: 36rem; min-height: 3.5rem; padding: 0.5rem 1rem;
		font: 1.125rem var(--text); color: var(--tinte); background: var(--karte); border: var(--ring); border-radius: 0;
	}
</style>
