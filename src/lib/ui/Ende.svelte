<script>
	// Result: the showcase as PNG and, per station, what the team did in words, with its competence levels.
	// No points, no grades, no ranking (Anlage 2).
	import { onMount } from 'svelte';
	import { spiel, r, t, Q, karte, neuAnfangen, geheZu } from '$lib/spiel.svelte.js';
	import { collage } from '$lib/collage.js';
	import Leiste from './Leiste.svelte';

	const E = Q.ende;
	const wort = $derived(spiel.satz === '__eigen' ? spiel.eigenerSatz.trim() : spiel.satz);
	const satz = $derived(`${r('sachsen-ist').replace(' …', '')} ${wort}.`);
	let url = $state('');
	let fehler = $state(false);
	let sicher = $state(false);

	onMount(() => {
		const karten = spiel.ordnung.map((n) => {
			const k = karte(n);
			return { src: k.bild.src, objekt: k.objekt, zeile: k.wahl ? r('eure-wahl', { wahl: k.wahl }) : '' };
		});
		collage({ satz, gruppe: r('gruppe', { tier: spiel.tier }), zeichen: spiel.zeichen, karten })
			.then((b) => (url = URL.createObjectURL(b)))
			.catch(() => (fehler = true));
		return () => url && URL.revokeObjectURL(url);
	});

	/** What the team did at station n, as sentences. @param {number} n */
	function bericht(n) {
		const st = Q.stationen[n - 1];
		const e = spiel.ergebnis[n];
		/** @type {string[]} */
		const s = [];
		for (const schritt of st.spiel.ablauf) {
			if (schritt === 'suchen') {
				s.push(t(E[e.versuche.length > 1 ? 'suchen-wechsel' : 'suchen-erster']));
				s.push(t(E[e.tipps ? 'tipps' : 'ohne-tipp']));
			}
			if (schritt === 'raetsel') s.push(t(E[e.fehl.length ? 'raetsel-wechsel' : 'raetsel-erster']));
			if (schritt === 'abstimmen') {
				if (e.runden.length > 1) s.push(t(E['neu-abgestimmt']));
				s.push(e.wahl === -1 ? t(E['abstimmen-beide']) : t(E['abstimmen-wahl'], { wahl: karte(n).wahl }));
			}
			if (schritt === 'begruenden' && e.grund) s.push(t(E.grund, { grund: e.grund }));
		}
		return s;
	}
</script>

<Leiste />
<div class="zwei">
	<div>
		{#if url}
			<img class="collage" src={url} alt="Eure Vitrine. {satz} Drei Fundkarten: {spiel.ordnung.map((n) => karte(n).objekt).join(', ')}." />
		{:else if fehler}
			<p role="alert">Das Bild konnte nicht erzeugt werden.</p>
		{:else}
			<p class="leise" role="status">{r('bild-wird')}</p>
		{/if}
	</div>
	<div class="stapel">
		<h1 tabindex="-1">{r('ende-titel')}</h1>
		<p class="leise">{r('ende-text')}</p>
		<div class="reihe">
			{#if url}<a class="knopf haupt" href={url} download="vitrine-gruppe-{spiel.tier.toLowerCase()}.png">{r('speichern')}</a>{/if}
		</div>
	</div>
</div>

<section class="bericht" aria-labelledby="bericht-titel">
	<h2 id="bericht-titel">{r('ende-gemacht')}</h2>
	<p class="leise">{t(E.einleitung)}</p>
	<ol>
		{#each Q.stationen as st (st.id)}
			<li class="karte-hell">
				<h3>{st.objekt}</h3>
				<p class="stufen">{t(E.stufen, { stufen: st.kompetenz.join(', ') })}</p>
				{#each bericht(st.nummer) as satz, i (i)}<p>{satz}</p>{/each}
				<p class="lehrplan">{r('lehrplan', { lp: st.lehrplan.join('; ') })}</p>
			</li>
		{/each}
		<li class="karte-hell">
			<h3>{r('titel')}</h3>
			<p>{t(E.vitrine, { satz })}</p>
		</li>
	</ol>
</section>

<div class="unten">
	{#if sicher}
		<p role="alert" class="hinweis fett">{r('neu-sicher')}</p>
		<button class="knopf" onclick={() => (sicher = false)}>{r('zurueck')}</button>
		<button class="knopf haupt" onclick={() => { neuAnfangen(); geheZu('start'); }}>{r('ja-neu')}</button>
	{:else}
		<button class="knopf" onclick={() => (sicher = true)}>{r('nochmal-spielen')}</button>
	{/if}
</div>

<style>
	.collage { width: 100%; max-width: 34rem; aspect-ratio: 1; }
	.bericht { margin-top: 2.5rem; }
	.bericht ol { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
	.bericht h3 { margin-bottom: 0.4rem; }
	.lehrplan { font-size: 0.9rem; color: #4a5257; margin-top: 0.75rem; }
	.stufen { font-weight: 700; border-bottom: 4px solid var(--stempel); padding-bottom: 0.4rem; }
</style>
