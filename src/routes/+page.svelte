<script>
	import { spiel } from '$lib/spiel.svelte.js';
	import Start from '$lib/ui/Start.svelte';
	import Code from '$lib/ui/Code.svelte';
	import Gruppe from '$lib/ui/Gruppe.svelte';
	import Vitrine from '$lib/ui/Vitrine.svelte';
	import Uebergabe from '$lib/ui/Uebergabe.svelte';
	import Station from '$lib/ui/Station.svelte';
	import Fundkarte from '$lib/ui/Fundkarte.svelte';
	import Gestalten from '$lib/ui/Gestalten.svelte';
	import Ende from '$lib/ui/Ende.svelte';

	const screens = { start: Start, code: Code, gruppe: Gruppe, vitrine: Vitrine, uebergabe: Uebergabe, station: Station, fundkarte: Fundkarte, gestalten: Gestalten, ende: Ende };
	const Screen = $derived(screens[/** @type {keyof typeof screens} */ (spiel.screen)] ?? Start);
</script>

<svelte:head><title>Was ist sächsisch? · klasseSachsen Demonstrator</title></svelte:head>

{#key `${spiel.screen}-${spiel.station}-${spiel.schritt}`}
	<Screen />
{/key}
