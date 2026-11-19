<script>
	// A Fundkarte: head (Fund n · Jahr), image, object name, claim, the team's choice and sources.
	import { spiel, r, t, karte } from '$lib/spiel.svelte.js';
	import QuellenZeile from './QuellenZeile.svelte';

	/** @type {{ n: number, seite?: 'vorne' | 'hinten', kompakt?: boolean }} */
	let { n, seite = 'vorne', kompakt = false } = $props();
	const k = $derived(karte(n));
	const text = $derived(seite === 'vorne' ? k.vorne : k.hinten);
	const abgelegt = $derived(spiel.karten[n]?.abgelegt ?? '');
	const bild = $derived(seite === 'hinten' && k.bildHinten ? k.bildHinten : k.bild);
</script>

<article class="karte" class:kompakt class:hinten={seite === 'hinten'} aria-label="Fundkarte {k.objekt}, {seite === 'vorne' ? r('vorderseite') : r('rueckseite')}">
	<div class="kopf">
		<span class="nr">{k.kopf}</span>
		<span>{seite === 'vorne' ? r('vorderseite') : r('rueckseite')}</span>
	</div>
	<img src={bild.src} alt={kompakt ? '' : bild.alt} loading="lazy" />
	<h2 class="objekt">{k.objekt}</h2>
	<p class="claim">{text.titel}</p>
	{#if !kompakt}
		<p>{t(text)}</p>
		{#if seite === 'vorne' && k.wahl}<p class="wahl">{r('eure-wahl', { wahl: k.wahl })}</p>{/if}
		{#if seite === 'vorne' && k.grund}<p class="wahl">{r('euer-grund', { grund: k.grund })}</p>{/if}
		{#if seite === 'hinten' && k.zusatz}
			<details>
				<summary>{r('zusatzfrage')}</summary>
				<p>{t(k.zusatz)}</p>
			</details>
		{/if}
		<QuellenZeile ids={text.quellen} />
	{:else if k.wahl}
		<p class="wahl klein">{r('eure-wahl', { wahl: k.wahl })}</p>
	{/if}
	{#if abgelegt}
		<div class="stempel" aria-label="{r('erfasst')} {abgelegt}">
			<span class="titel">{r('erfasst').toUpperCase()}</span>
			<span class="nr">{abgelegt} · {spiel.tier}</span>
		</div>
	{/if}
</article>

<style>
	.karte {
		position: relative; background: var(--karte); color: var(--tinte);
		padding: 1.1rem 1.25rem 1.25rem; max-width: 34rem;
	}
	.karte.hinten { background: var(--papier); }
	.kopf {
		display: flex; justify-content: space-between; gap: 1rem; font-weight: 700; font-size: 1rem;
		padding-bottom: 0.4rem; margin-bottom: 0.9rem; border-bottom: 4px solid var(--stempel);
	}
	.nr { font-family: var(--mono); font-weight: 400; }
	img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #ccd5d8; }
	.objekt { font-size: 1.6rem; margin: 0.9rem 0 0.3rem; color: var(--tinte); }
	.claim { font-weight: 700; font-size: 1.2rem; margin-bottom: 0.6rem; }
	.wahl { border-left: 5px solid var(--tinte); padding-left: 0.6rem; font-weight: 700; }
	details { margin: 0.75rem 0; }
	summary { cursor: pointer; font-weight: 700; color: var(--kobalt); min-height: 48px; display: flex; align-items: center; }
	.kompakt { padding: 0.75rem; }
	.kompakt .kopf { font-size: 0.85rem; margin-bottom: 0.6rem; }
	.kompakt .objekt { font-size: 1.15rem; margin-top: 0.6rem; }
	.kompakt .claim { font-size: 1rem; margin: 0; }
	.stempel {
		position: absolute; right: -0.4rem; top: 42%; transform: rotate(-8deg);
		border: 4px solid var(--stempel); color: var(--stempel); background: rgba(255, 255, 255, 0.92);
		padding: 0.2rem 0.75rem; display: flex; flex-direction: column; align-items: center; line-height: 1.1;
	}
	.stempel .titel { margin: 0; font-size: 1.3rem; letter-spacing: 0.08em; }
	.stempel .nr { font-size: 0.85rem; }
</style>
