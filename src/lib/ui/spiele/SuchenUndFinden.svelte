<script>
	// Minigame "Suchen und Finden": the castle answers. A miss locks the choices until the team
	// says it looked again; hints are a free three-step ladder. Filled from the station's content.
	import { spiel, r, t, bild, naechsterSchritt } from '$lib/spiel.svelte.js';
	import QuellenZeile from '../QuellenZeile.svelte';
	import Raum from './Raum.svelte';

	/** @type {{ st: any, raum: any }} */
	let { st, raum } = $props();
	const tx = $derived(st.texte);
	const cfg = $derived(st.spiel.suchen);
	const e = $derived(spiel.ergebnis[st.nummer]);
	const richtig = $derived(tx.auswahl.richtig);
	const geloest = $derived(e.versuche.includes(richtig));
	const letzter = $derived(e.versuche.at(-1));

	let gesperrt = $state(false);
	let gesperrtTipp = $state(false);
	let geheimOffen = $state(false);
	const tippZeilen = ['tipp-1', 'tipp-2', 'tipp-3'];

	/** @param {number} i */
	function waehle(i) {
		if (gesperrt) {
			gesperrtTipp = true;
			return;
		}
		e.versuche.push(i);
		if (i !== richtig) gesperrt = true;
	}
	function nachgesehen() {
		gesperrt = false;
		gesperrtTipp = false;
	}
</script>

<h1 tabindex="-1">{t(tx.frage)}</h1>

{#if !geloest}
	<div class="zwei links">
		<div class="stapel">
			<Raum {raum} />
			<fieldset class="optionen">
				<legend class="sr">{t(tx.frage)}</legend>
				{#each tx.auswahl.optionen as o, i (i)}
					<button class="knopf breit" aria-disabled={gesperrt} onclick={() => waehle(i)}>
						{o}
						{#if gesperrt && letzter === i}<span class="klein">· {r('euer-versuch')}</span>{/if}
					</button>
				{/each}
			</fieldset>
			{#if gesperrtTipp}<p role="alert" class="fett">{r('gesperrt-grund')}</p>{/if}
			<div role="status">
				{#if gesperrt && letzter !== undefined}
					<div class="fehl">
						<p>{t(tx[cfg.fehl[letzter]])}</p>
						<QuellenZeile ids={tx[cfg.fehl[letzter]].quellen} />
						{#if spiel.ort === 'burg'}<p class="fett">{t(tx.gesperrt)}</p>{/if}
					</div>
				{/if}
			</div>
			{#if gesperrt}
				<button class="knopf haupt" onclick={nachgesehen}>{r('nachgesehen')}</button>
			{/if}
		</div>
		<aside class="stapel">
			{#if spiel.amTablet === 'Lupe' || spiel.modus === 'allein'}
				<div class="geheim karte-hell hell">
					<div class="reihe zwischen">
						<span class="fett">{r('geheim')}</span>
						<button class="knopf" aria-expanded={geheimOffen} aria-controls="geheim" onclick={() => (geheimOffen = !geheimOffen)}>
							{geheimOffen ? r('verdecken') : r('zeigen')}
						</button>
					</div>
					<p id="geheim" hidden={!geheimOffen}>{t(tx[cfg.geheim])}</p>
				</div>
			{/if}
			<div class="tipps">
				<p class="leise klein">{r('tipps-frei')}</p>
				<ol aria-live="polite">
					{#each tippZeilen.slice(0, e.tipps) as k (k)}<li>{t(tx[k])}</li>{/each}
				</ol>
				{#if e.tipps < 3}
					<button class="knopf" onclick={() => e.tipps++}>{r('tipp-zeigen', { n: e.tipps + 1 })}</button>
				{/if}
			</div>
		</aside>
	</div>
{:else}
	<div class="zwei">
		<div class="stapel" role="status">
			<p class="geloest">{t(tx.geloest)}</p>
			<QuellenZeile ids={tx.geloest.quellen} />
			{#if spiel.ort === 'burg'}<p class="fett">{t(tx.nachsehen)}</p>{/if}
			<button class="knopf haupt" onclick={naechsterSchritt}>{r('zur-fundkarte')} <span aria-hidden="true">→</span></button>
		</div>
		<figure>
			<img src={bild(st.spiel.raumbild).src} alt={bild(st.spiel.raumbild).alt} />
		</figure>
	</div>
{/if}

<style>
	.optionen { border: 0; padding: 0; margin: 0; display: grid; gap: 0.75rem; max-width: 30rem; }
	.fehl { background: var(--leiste); padding: 1rem 1.25rem; border-left: 6px solid var(--aus); }
	.geheim .zwischen { justify-content: space-between; }
	.geheim p { margin-top: 0.75rem; font-weight: 700; }
	.tipps ol { padding-left: 1.25rem; margin: 0 0 0.75rem; }
	.tipps li { margin-bottom: 0.4rem; }
	.geloest { font-size: 1.35rem; font-weight: 700; }
	figure { margin: 0; }
</style>
