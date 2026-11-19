<script>
	// The team's mason's mark, drawn small (top bar, collage). Decorative next to the group name.
	/** @type {{ linien: number[][], groesse?: number, farbe?: string }} */
	let { linien, groesse = 44, farbe = '#fff' } = $props();
	/** @param {number} i */
	const xy = (i) => [20 + (i % 3) * 30, 20 + Math.floor(i / 3) * 30];
</script>

<svg width={groesse} height={groesse} viewBox="0 0 100 100" aria-hidden="true" class="zeichen">
	<rect x="2" y="2" width="96" height="96" fill="none" stroke={farbe} stroke-width="4" />
	{#each linien as [a, b], i (i)}
		<line x1={xy(a)[0] + 0} y1={xy(a)[1]} x2={xy(b)[0]} y2={xy(b)[1]} stroke={farbe} stroke-width="7" stroke-linecap="round" />
	{/each}
</svg>

<style>
	.zeichen { flex: none; }
</style>
