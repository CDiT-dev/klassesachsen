<script>
	// Attribution page, generated from the content file like content/quellen-und-bilder.md.
	import { Q, bild } from '$lib/spiel.svelte.js';
</script>

<svelte:head><title>Quellen und Bilder · klasseSachsen</title></svelte:head>

<h1 tabindex="-1">Quellen und Bilder</h1>
<p>
	Die Texte der Demo schreibt CDiT; sie stehen unter CC BY-SA 4.0. Die Stimmen von Maler, Köhler, August dem
	Starken und Böttger sind für das Spiel erfunden und im Spiel so gekennzeichnet. Jede Sachaussage stützt sich
	auf eine der Quellen unten. Stand: {Q.stand}.
</p>
<h2>Quellen</h2>
<ul class="liste">
	{#each Object.entries(Q.quellen) as [id, q] (id)}
		<li id={id}>
			<strong>{q.titel}</strong>. {q.werk}. <a href={q.url}>{q.url}</a> (gelesen am {q.gelesen}).
			<br /><span class="leise">Belegt: {q.belegt}</span>
		</li>
	{/each}
</ul>
<h2>Bilder</h2>
<p>
	Alle Bilder sind gemeinfrei oder frei lizenziert. Die Wandbilder der Albrechtsburg zeigen wir über Postkarten
	von 1899 aus Wikimedia Commons. Fotos der Staatlichen Schlösser, Burgen und Gärten Sachsen nutzen wir nicht.
</p>
<ul class="liste bilder">
	{#each Object.entries(Q.bilder) as [id, b] (id)}
		<li id="bild-{id}">
			<img src={bild(id).src} alt="" loading="lazy" />
			<div>
				<strong>{b.titel}</strong>.{#if b.werk}{' '}{b.werk}.{/if} {b.urheber}.
				Lizenz: <a href={b.lizenz_url}>{b.lizenz}</a>. <a href={b.quelle_url}>Quelle</a>.
				<br /><span class="leise">Alt-Text: {b.alt}</span>
			</div>
		</li>
	{/each}
</ul>
<h2>Schriften</h2>
<p>
	Archivo und Atkinson Hyperlegible Next stehen unter der SIL Open Font License 1.1
	(<a href="/fonts/OFL-archivo.txt">Archivo</a>, <a href="/fonts/OFL-atkinson-hyperlegible.txt">Atkinson Hyperlegible</a>)
	und kommen von diesem Server.
</p>
<p><a href="/">Zurück zum Spiel</a></p>

<style>
	.liste { padding-left: 1.25rem; max-width: 52rem; }
	.liste li { margin-bottom: 1rem; overflow-wrap: anywhere; }
	.bilder { list-style: none; padding: 0; }
	.bilder li { display: flex; gap: 1rem; align-items: flex-start; }
	.bilder img { width: 6rem; flex: none; }
</style>
