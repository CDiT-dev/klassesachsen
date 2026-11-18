<script>
	// One station: runs the steps the content file lists for it (spiel.ablauf), each a reusable minigame.
	import { spiel, r, t, bild, station, naechsterSchritt } from '$lib/spiel.svelte.js';
	import Leiste from './Leiste.svelte';
	import QuellenZeile from './QuellenZeile.svelte';
	import SuchenUndFinden from './spiele/SuchenUndFinden.svelte';
	import Abstimmung from './spiele/Abstimmung.svelte';
	import Begruenden from './spiele/Begruenden.svelte';
	import Teamraetsel from './spiele/Teamraetsel.svelte';

	const st = $derived(station(spiel.station));
	const sp = $derived(st.spiel);
	const schritt = $derived(sp.ablauf[spiel.schritt]);
	const info = $derived(`${r('station', { n: st.nummer, ort: st.ort.anzeige })} · ${r('schritt', { i: spiel.schritt + 1, k: sp.ablauf.length })}`);
	// In the classroom the photo stands in for the room, shown with the first task.
	const raum = $derived(spiel.ort === 'klasse' && spiel.schritt === 1 ? { text: st.texte.klassenraum, bild: bild(sp.raumbild) } : null);
</script>

<Leiste {info} />

{#if schritt === 'auftrag'}
	<div class="zwei">
		<div class="stapel">
			<h1 tabindex="-1">{st.ort.anzeige}</h1>
			<p>{t(st.texte.einleitung)}</p>
			<QuellenZeile ids={st.texte.einleitung.quellen} />
			{#if spiel.ort === 'burg'}
				<p class="auftrag">{t(st.texte[sp.auftrag_burg])}</p>
			{/if}
			<button class="knopf haupt" onclick={naechsterSchritt}>
				{spiel.ort === 'burg' ? r('wir-sind-da') : r('weiter')} <span aria-hidden="true">→</span>
			</button>
		</div>
		{#if sp.einleitungsbild}
			<figure><img src={bild(sp.einleitungsbild).src} alt={bild(sp.einleitungsbild).alt} /></figure>
		{/if}
	</div>
{:else if schritt === 'suchen'}
	<SuchenUndFinden {st} {raum} />
{:else if schritt === 'abstimmen'}
	<Abstimmung {st} {raum} />
{:else if schritt === 'begruenden'}
	<Begruenden {st} />
{:else if schritt === 'raetsel'}
	<Teamraetsel {st} {raum} />
{/if}

<style>
	.auftrag { background: var(--leiste); padding: 1rem 1.25rem; border-left: 6px solid #fff; font-weight: 700; }
	figure { margin: 0; max-width: 30rem; }
</style>
