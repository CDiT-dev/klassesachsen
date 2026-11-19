<script>
	// Minigame "Teamrätsel mit Rollen": each role holds one clue, only together the team has the answer.
	// Ingredients go into a bowl by tapping (no drag needed); the bowl is checked against the content file.
	import { spiel, r, t, naechsterSchritt } from '$lib/spiel.svelte.js';
	import { pruefeSchale } from '$lib/regeln.js';
	import QuellenZeile from '../QuellenZeile.svelte';
	import Raum from './Raum.svelte';

	/** @type {{ st: any, raum: any }} */
	let { st, raum } = $props();
	const tx = $derived(st.texte);
	const cfg = $derived(st.spiel.raetsel);
	const e = $derived(spiel.ergebnis[st.nummer]);
	const zutaten = $derived(tx.zutaten.optionen);
	const plaetze = $derived(tx.zutaten.richtig.length);

	/** @type {number[]} */
	let schale = $state([]);
	/** @type {Record<string, boolean>} */
	let offen = $state({});
	/** @type {any} */
	let meldung = $state(null);
	let geloest = $state(false);

	/** @param {number} i */
	function dazu(i) {
		if (schale.includes(i) || schale.length >= plaetze) return;
		schale.push(i);
		meldung = null;
	}
	function brennen() {
		const p = pruefeSchale(schale, tx.zutaten.richtig);
		if (p === 'ok') geloest = true;
		else if (p === 'zu-wenig') meldung = tx['zu-wenig'];
		else {
			e.fehl.push(p);
			meldung = tx[cfg.fehl[p]];
		}
	}
</script>

<h1 tabindex="-1">{t(tx.frage)}</h1>
{#if !geloest}
	<p class="leise">{t(tx.regel)}</p>
	<div class="zwei links">
		<div class="stapel">
			<Raum {raum} />
			<p class="fett">{r('schale')}</p>
			<ul class="schale" aria-label={r('schale')}>
				{#each Array(plaetze) as _, i (i)}
					<li class:frei={schale[i] === undefined}>
						{#if schale[i] !== undefined}
							<span class="fett">{zutaten[schale[i]]}</span>
							<button class="knopf" aria-label={r('entfernen', { zutat: zutaten[schale[i]] })} onclick={() => schale.splice(i, 1)}>✕</button>
						{:else}
							<span>{r('noch-frei')}</span>
						{/if}
					</li>
				{/each}
			</ul>
			<p class="fett">{r('zutaten-hilfe')}</p>
			<div class="reihe">
				{#each zutaten as z, i (z)}
					<button class="knopf" aria-disabled={schale.includes(i) || schale.length >= plaetze} onclick={() => dazu(i)}>
						{#if schale.includes(i)}<span aria-hidden="true">✓</span><span class="sr">{r('in-der-schale')}:</span>{/if}
						{z}
					</button>
				{/each}
			</div>
			<div role="status">
				{#if meldung}
					<div class="meldung"><p>{t(meldung)}</p><QuellenZeile ids={meldung.quellen} /></div>
				{/if}
			</div>
			<div class="unten">
				<button class="knopf haupt" aria-disabled={schale.length < plaetze} onclick={brennen}>{t(tx.brennen)}</button>
			</div>
		</div>
		<div class="teile stapel">
			{#each cfg.teile as k (k)}
				<div class="teil" class:offen={offen[k]}>
					<div class="reihe zwischen">
						<span class="fett">{r('teil-von', { rolle: tx[k].rolle })}</span>
						<button class="knopf" aria-expanded={!!offen[k]} aria-controls="teil-{k}" onclick={() => (offen[k] = !offen[k])}>
							{offen[k] ? r('verdecken') : r('zeigen')}
						</button>
					</div>
					<p id="teil-{k}" class="hinweis" hidden={!offen[k]}>{t(tx[k])}</p>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="stapel" role="status">
		<p class="geloest">{t(tx.geloest)}</p>
		<QuellenZeile ids={tx.geloest.quellen} />
		<button class="knopf haupt" onclick={naechsterSchritt}>{r('weiter')} <span aria-hidden="true">→</span></button>
	</div>
{/if}

<style>
	.schale { list-style: none; margin: 0; padding: 0.75rem; background: var(--karte); display: grid; gap: 0.6rem; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); }
	.schale li {
		min-height: 4.5rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
		padding: 0.4rem 0.5rem 0.4rem 1rem; background: #fff; color: var(--tinte); border: 3px solid var(--tinte);
	}
	.schale li.frei { border-style: dashed; justify-content: center; color: #4a5257; background: transparent; }
	.schale .knopf { color: var(--kobalt); border-color: var(--kobalt); min-height: 3rem; min-width: 3rem; padding: 0; }
	.teil { border: var(--ring); padding: 0.75rem 1rem; }
	.teil.offen { background: #fff; color: var(--tinte); }
	.teil.offen .knopf { color: var(--kobalt); border-color: var(--kobalt); }
	.zwischen { justify-content: space-between; }
	.hinweis { margin: 0.75rem 0 0; font-weight: 700; font-size: 1.2rem; }
	.meldung { background: var(--leiste); padding: 1rem 1.25rem; border-left: 6px solid var(--aus); }
	.geloest { font-size: 1.35rem; font-weight: 700; }
</style>
