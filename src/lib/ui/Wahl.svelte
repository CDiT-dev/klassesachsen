<script>
	// A row of choice chips: native radios, so arrow keys and screen readers work as expected.
	/** @type {{ legende: string, name: string, optionen: { wert: any, text: string }[], wert: any, sichtbar?: boolean }} */
	let { legende, name, optionen, wert = $bindable(), sichtbar = true } = $props();
</script>

<fieldset class="wahl">
	<legend class:sr={!sichtbar} class="fett">{legende}</legend>
	<div class="reihe">
		{#each optionen as o (o.wert)}
			<label class="knopf" class:an={wert === o.wert}>
				<input class="sr" type="radio" {name} value={o.wert} bind:group={wert} />
				<span aria-hidden="true" class="haken">{wert === o.wert ? '✓' : ''}</span>{o.text}
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.wahl { border: 0; padding: 0; margin: 0.5rem 0 0; min-inline-size: 0; }
	legend { padding: 0; margin-bottom: 0.6rem; }
	label.an { background: var(--kobalt); color: #fff; }
	label { gap: 0.3rem; }
	.haken { display: inline-block; min-width: 0.8em; }
	label:has(input:focus-visible) { outline: 3px solid #fff; outline-offset: 3px; box-shadow: 0 0 0 9px var(--kobalt); }
</style>
