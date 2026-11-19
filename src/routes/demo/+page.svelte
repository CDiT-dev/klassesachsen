<script>
	// For evaluators: what each part of the demo proves (storyboard, COS-202).
	import { Q } from '$lib/spiel.svelte.js';
</script>

<svelte:head><title>Was diese Demo zeigt · klasseSachsen</title></svelte:head>

<h1 tabindex="-1">Was diese Demo zeigt</h1>
<p>
	Eine spielbare Quest aus der App klasseSachsen, für die Albrechtsburg Meißen. Sie gehört zum Angebot von CDiT
	für die öffentliche Ausschreibung klasseSachsen. Eine Gruppe von drei bis fünf Kindern spielt drei Stationen an
	einem Tablet, sammelt drei Fundkarten und gestaltet am Ende ihre Vitrine als Antwort auf „Was ist sächsisch?“.
</p>
<p>{Q.demo.minispiele}</p>
<dl>
	{#each Q.demo.zeigt as [thema, wo] (thema)}
		<dt>{thema}</dt>
		<dd>{wo}</dd>
	{/each}
</dl>
<p>Schnell durchspielen: „Allein ausprobieren“ übernimmt alle drei Rollen; die Übergaben werden zu einer Zeile.</p>
<p><a class="knopf haupt" href="/">Zum Spiel</a></p>
<p><a href="https://github.com/CDiT-dev/klassesachsen">Quellcode auf GitHub (EUPL 1.2)</a> · <a href="/quellen/">Quellen und Bilder</a></p>

<style>
	dl { max-width: 48rem; }
	dt { font-weight: 700; margin-top: 1rem; }
	dd { margin: 0.2rem 0 0; color: var(--gedaempft); }
</style>
