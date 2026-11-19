<script>
	import { spiel, r, Q, geheZu } from '$lib/spiel.svelte.js';
	import { PUNKTE, linieDazu } from '$lib/regeln.js';
	import Leiste from './Leiste.svelte';
	import Wahl from './Wahl.svelte';

	/** @type {number | null} */
	let erster = $state(null);
	let ansage = $state('');

	/** @param {number} i */
	function tippe(i) {
		if (erster === null) {
			erster = i;
			ansage = `Punkt ${PUNKTE[i]} gewählt. Jetzt den zweiten Punkt.`;
			return;
		}
		const vorher = spiel.zeichen.length;
		spiel.zeichen = linieDazu(spiel.zeichen, erster, i);
		ansage = spiel.zeichen.length > vorher ? `Linie von ${PUNKTE[erster]} nach ${PUNKTE[i]}.` : 'Keine neue Linie.';
		erster = null;
	}
	function rueckgaengig() {
		spiel.zeichen = spiel.zeichen.slice(0, -1);
		erster = null;
		ansage = 'Letzte Linie entfernt.';
	}
	function vorschlagen() {
		spiel.zeichen = Q.demo.zeichen_vorschlag;
		erster = null;
		ansage = 'Ein Zeichen ist vorgeschlagen. Ihr könnt es ändern.';
	}
	/** @param {number} i */
	const xy = (i) => [20 + (i % 3) * 30, 20 + Math.floor(i / 3) * 30];

	function los() {
		if (!spiel.zeichen.length) spiel.zeichen = Q.demo.zeichen_vorschlag;
		spiel.amTablet = 'Stift';
		geheZu('vitrine');
	}
</script>

<Leiste />
<div class="zwei">
	<div class="stapel">
		<h1 class="gross" tabindex="-1">{r('gruppe-titel')}</h1>
		<Wahl legende={r('tiername')} name="tier" bind:wert={spiel.tier} optionen={Q.demo.tiere.map((/** @type {string} */ t) => ({ wert: t, text: t }))} />
		{#if spiel.modus === 'klasse'}
			<Wahl legende={r('groesse')} name="groesse" bind:wert={spiel.groesse} optionen={Q.demo.gruppengroesse.map((/** @type {number} */ n) => ({ wert: n, text: String(n) }))} />
		{/if}
		<Wahl legende={r('ort-frage')} name="ort" bind:wert={spiel.ort} optionen={[{ wert: 'burg', text: r('ort-burg') }, { wert: 'klasse', text: r('ort-klasse') }]} />
		{#if spiel.modus === 'klasse'}
			<div>
				<p class="fett">{r('rollen-titel')}</p>
				<ul class="karte-hell rollen">
					<li>{r('rolle-plan')}</li>
					<li>{r('rolle-lupe')}</li>
					<li>{r('rolle-stift')}</li>
				</ul>
				<p class="leise klein">{r('rollen-teilen')}</p>
			</div>
		{/if}
	</div>
	<div class="stapel">
		<p class="leise">{r('zeichen-text')}</p>
		<div class="brett" role="group" aria-label="Steinmetzzeichen zeichnen">
			<svg viewBox="0 0 100 100" aria-hidden="true">
				{#each spiel.zeichen as [a, b], i (i)}
					<line x1={xy(a)[0]} y1={xy(a)[1]} x2={xy(b)[0]} y2={xy(b)[1]} stroke="#16181a" stroke-width="3.5" stroke-linecap="round" />
				{/each}
			</svg>
			{#each PUNKTE as name, i (i)}
				<button
					class="punkt"
					style:left="{xy(i)[0]}%"
					style:top="{xy(i)[1]}%"
					aria-pressed={erster === i}
					aria-label="Punkt {name}"
					onclick={() => tippe(i)}
				></button>
			{/each}
		</div>
		<p class="sr" aria-live="polite">{ansage}</p>
		<div class="reihe">
			<button class="knopf" onclick={rueckgaengig} disabled={!spiel.zeichen.length}>{r('rueckgaengig')}</button>
			<button class="knopf" onclick={vorschlagen}>{r('vorschlagen')}</button>
		</div>
		<button class="knopf haupt breit" aria-disabled={!spiel.tier} onclick={() => spiel.tier && los()}>
			{r('los')} <span aria-hidden="true">→</span>
		</button>
		{#if !spiel.tier}<p class="leise klein">{r('tiername')}</p>{/if}
	</div>
</div>

<style>
	.rollen { list-style: none; margin: 0 0 0.75rem; }
	.rollen li + li { margin-top: 0.4rem; }
	.brett { position: relative; aspect-ratio: 1; max-width: 24rem; background: var(--karte); }
	.brett svg { position: absolute; inset: 0; width: 100%; height: 100%; }
	.punkt {
		position: absolute; width: 76px; height: 76px; transform: translate(-50%, -50%);
		background: transparent; border: 0; cursor: pointer; padding: 0;
	}
	.punkt::after {
		content: ''; position: absolute; left: 50%; top: 50%; width: 30px; height: 30px;
		transform: translate(-50%, -50%); border-radius: 50%; background: var(--kobalt);
	}
	.punkt[aria-pressed='true']::after { width: 40px; height: 40px; box-shadow: 0 0 0 5px var(--karte), 0 0 0 9px var(--kobalt); }
</style>
