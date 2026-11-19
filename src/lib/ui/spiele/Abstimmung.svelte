<script>
	// Minigame "Dilemma": two invented, labelled voices with a source each, a show of hands in the room,
	// and Stift enters only the tally. A tie means one re-vote; a second tie puts both sides on the card.
	import { untrack } from 'svelte';
	import { spiel, r, t, label, naechsterSchritt } from '$lib/spiel.svelte.js';
	import { summe, sieger } from '$lib/regeln.js';
	import QuellenZeile from '../QuellenZeile.svelte';
	import Raum from './Raum.svelte';

	/** @type {{ st: any, raum: any }} */
	let { st, raum } = $props();
	const tx = $derived(st.texte);
	const ab = $derived(st.spiel.abstimmung);
	const e = $derived(spiel.ergebnis[st.nummer]);
	const optionen = $derived(tx.auswahl.optionen);

	let stimmen = $state([0, 0]);
	let gleichstand = $state(untrack(() => e.runden.length > 0));
	let meldung = $state('');
	let quellenOffen = $state(false);
	const gezaehlt = $derived(summe(stimmen));
	const voll = $derived(gezaehlt >= spiel.groesse);

	/** @param {number} i @param {number} d */
	function zaehle(i, d) {
		meldung = '';
		if (d > 0 && voll) {
			meldung = r('zu-viele');
			return;
		}
		stimmen[i] = Math.max(0, stimmen[i] + d);
	}
	function eintragen() {
		if (!gezaehlt) {
			meldung = r('keine-stimme');
			return;
		}
		e.runden.push([...stimmen]);
		const w = sieger(stimmen);
		if (w === -1 && e.runden.length < 2) {
			gleichstand = true;
			stimmen = [0, 0];
			meldung = '';
			return;
		}
		e.wahl = w;
		naechsterSchritt();
	}
</script>

<h1 tabindex="-1">{t(tx[ab.frage])}</h1>
<Raum {raum} />
<p class="leise klein">{t(tx['hinweis-stimmen'])}</p>
<div class="stimmen">
	{#each ab.stimmen as v, i (v)}
		<section class="stimme" class:kohle={i === 1} aria-labelledby="stimme-{v}">
			<h2 id="stimme-{v}">{label(tx[v])}</h2>
			<p>{t(tx[v])}</p>
			<p class="quelle">{t(tx[`${v}-quelle`])}</p>
		</section>
	{/each}
</div>

{#if quellenOffen}
	<div class="quellen">
		{#if tx['was-die-burg-schreibt']}<p>{t(tx['was-die-burg-schreibt'])}</p>{/if}
		<QuellenZeile ids={[...new Set(ab.stimmen.flatMap((/** @type {string} */ v) => tx[v].quellen ?? []))]} />
	</div>
{/if}

<p class="regel">{t(tx.abstimmen)}</p>
{#if gleichstand}
	<p class="gleich" role="status">{t(tx.gleichstand)} {t(tx['gleichstand-2'])}</p>
{/if}
<div class="zaehler">
	{#each optionen as o, i (o)}
		<div class="stepper" role="group" aria-label={o}>
			<span class="name fett">{o}</span>
			<button class="knopf haupt" aria-label={r('stimme-weniger', { wahl: o })} onclick={() => zaehle(i, -1)} aria-disabled={stimmen[i] === 0}>−</button>
			<output class="zahl" aria-live="polite">{stimmen[i]}</output>
			<button class="knopf haupt" aria-label={r('stimme-mehr', { wahl: o })} onclick={() => zaehle(i, 1)} aria-disabled={voll}>+</button>
		</div>
	{/each}
</div>
<p class="leise klein" aria-live="polite">{r('stimmen-gezaehlt', { a: gezaehlt, b: spiel.groesse })}</p>
{#if meldung}<p role="alert" class="fett">{meldung}</p>{/if}
<div class="unten">
	<button class="knopf" aria-expanded={quellenOffen} onclick={() => (quellenOffen = !quellenOffen)}>
		{quellenOffen ? r('quellen-zu') : r('quellen')}
	</button>
	<button class="knopf haupt" onclick={eintragen}>{r('ergebnis')} <span aria-hidden="true">→</span></button>
</div>

<style>
	.stimmen { display: grid; gap: 1rem; grid-template-columns: 1fr; margin-bottom: 1rem; }
	@media (min-width: 52rem) { .stimmen { grid-template-columns: 1fr 1fr; } }
	.stimme { background: var(--karte); color: var(--tinte); padding: 1.25rem 1.5rem; }
	.stimme.kohle { background: var(--kohle); color: #fff; }
	.stimme h2 { font-size: 1.4rem; }
	.quelle { font-size: 0.95rem; margin: 0; opacity: 0.85; }
	.quellen { background: var(--leiste); padding: 1rem 1.25rem; margin-bottom: 1rem; }
	.regel { margin-top: 1rem; }
	.gleich { background: var(--leiste); padding: 0.75rem 1rem; border-left: 6px solid #fff; font-weight: 700; }
	.zaehler { display: flex; flex-wrap: wrap; gap: 1rem; }
	.stepper { display: flex; align-items: stretch; border: var(--ring); }
	.stepper .name { background: var(--karte); color: var(--tinte); padding: 0 1rem; display: flex; align-items: center; min-width: 6.5rem; }
	.stepper .knopf { border: 0; font-size: 1.6rem; min-width: 4rem; }
	.zahl { background: var(--karte); color: var(--tinte); min-width: 3.5rem; display: flex; align-items: center; justify-content: center; font: 800 1.8rem var(--titel); }
</style>
