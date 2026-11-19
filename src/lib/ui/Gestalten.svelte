<script>
	// "Was ist sächsisch?": the team arranges its three cards and picks one sentence for its showcase.
	import { spiel, r, Q, karte, geheZu } from '$lib/spiel.svelte.js';
	import { tausche } from '$lib/regeln.js';
	import Leiste from './Leiste.svelte';
	import Wahl from './Wahl.svelte';
	import Zeichen from './Zeichen.svelte';

	/** @type {number | null} */
	let gewaehlt = $state(null);
	let ansage = $state('');
	let fehlt = $state(false);
	const wort = $derived(spiel.satz === '__eigen' ? spiel.eigenerSatz.trim() : spiel.satz);
	const satz = $derived(wort ? `${r('sachsen-ist').replace(' …', '')} ${wort}.` : r('sachsen-ist'));

	/** @param {number} platz */
	function tippe(platz) {
		if (gewaehlt === null) {
			gewaehlt = platz;
			ansage = r('ausgewaehlt', { objekt: karte(spiel.ordnung[platz]).objekt });
			return;
		}
		spiel.ordnung = tausche(spiel.ordnung, gewaehlt, platz);
		ansage = `${karte(spiel.ordnung[platz]).objekt}: ${r('platz', { n: platz + 1 })}.`;
		gewaehlt = null;
	}
</script>

<Leiste />
<div class="zwei">
	<div class="vorschau" aria-label="Vorschau eurer Vitrine">
		<p class="satz titel" aria-hidden="true">{satz}</p>
		<div class="karten">
			{#each spiel.ordnung as n, platz (n)}
				{@const k = karte(n)}
				<button class="mini" aria-pressed={gewaehlt === platz} aria-label="{r('platz', { n: platz + 1 })}: {k.objekt}" onclick={() => tippe(platz)}>
					<img src={k.bild.src} alt="" />
					<span class="name">{k.objekt}</span>
					{#if k.wahl}<span class="wahl">{r('eure-wahl', { wahl: k.wahl })}</span>{/if}
				</button>
			{/each}
		</div>
		<div class="fuss"><Zeichen linien={spiel.zeichen} groesse={30} /> {r('gruppe', { tier: spiel.tier })}</div>
	</div>
	<div class="stapel">
		<h1 tabindex="-1">{r('gestalten-titel')}</h1>
		<p class="leise">{r('gestalten-text')}</p>
		<p class="leise klein">{r('tausch-hilfe')}</p>
		<p class="sr" aria-live="polite">{ansage}</p>
		<Wahl
			legende={r('sachsen-ist')}
			name="satz"
			bind:wert={spiel.satz}
			optionen={[...Q.demo.saetze.map((/** @type {string} */ s) => ({ wert: s, text: s })), { wert: '__eigen', text: r('eigener-satz') }]}
		/>
		{#if spiel.satz === '__eigen'}
			<div>
				<label for="eigener-satz" class="sr">{r('eigener-satz')}</label>
				<input id="eigener-satz" bind:value={spiel.eigenerSatz} maxlength="40" placeholder="… (ohne Namen)" aria-describedby="satz-hilfe" />
				<p id="satz-hilfe" class="leise klein">{r('grund-hilfe')}</p>
			</div>
		{/if}
		<button class="knopf haupt breit" aria-disabled={!wort} onclick={() => (wort ? geheZu('ende') : (fehlt = true))}>{r('fertig')} <span aria-hidden="true">→</span></button>
		{#if fehlt && !wort}<p role="alert" class="fett">{r('satz-fehlt')}</p>{/if}
	</div>
</div>

<style>
	.vorschau { background: var(--wand-dunkel); padding: 1.5rem; aspect-ratio: 1; display: flex; flex-direction: column; min-width: 0; }
	.satz { font-size: clamp(1.4rem, 3.5vw, 2.4rem); margin: 0 0 auto; }
	.karten { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin: 1rem 0; align-items: start; }
	.mini {
		background: var(--karte); color: var(--tinte); border: 3px solid transparent; padding: 0.4rem;
		text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 0.3rem; font: inherit; min-height: 48px;
	}
	.mini:nth-child(1) { transform: rotate(-2deg); }
	.mini:nth-child(3) { transform: rotate(2deg); }
	.mini[aria-pressed='true'] { border-color: #fff; box-shadow: 0 0 0 4px var(--kobalt); }
	.mini img { aspect-ratio: 1; object-fit: cover; width: 100%; }
	.name { font: 800 0.95rem/1.1 var(--titel); font-stretch: 125%; }
	.wahl { font-size: 0.8rem; }
	.fuss { display: flex; gap: 0.6rem; align-items: center; font-size: 0.95rem; }
	input {
		width: 100%; max-width: 28rem; min-height: 3.5rem; padding: 0.5rem 1rem;
		font: 1.125rem var(--text); color: var(--tinte); background: var(--karte); border: var(--ring); border-radius: 0;
	}
</style>
