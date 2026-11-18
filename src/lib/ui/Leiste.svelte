<script>
	import { spiel, r } from '$lib/spiel.svelte.js';
	import Zeichen from './Zeichen.svelte';

	/** @type {{ info?: string, links?: import('svelte').Snippet }} */
	let { info = '', links } = $props();
</script>

<header class="leiste">
	<div class="wer">
		{#if spiel.tier}
			<Zeichen linien={spiel.zeichen} groesse={44} />
			<div>
				<div class="fett">{r('gruppe', { tier: spiel.tier })}</div>
				<div class="leise klein">
					{r('am-tablet')}: <strong class="weiss">{spiel.amTablet || r('alle')}</strong>
					{#if info}<span class="info"> · {info}</span>{/if}
				</div>
			</div>
		{:else if links}
			{@render links()}
		{/if}
	</div>
	<div class="werkzeug">
		<fieldset class="sprache">
			<legend class="sr">{r('sprache')}</legend>
			{#each ['einfach', 'leicht'] as s (s)}
				<label class:an={spiel.sprache === s}>
					<input class="sr" type="radio" name="sprache" value={s} bind:group={spiel.sprache} />
					<span aria-hidden="true" class="haken">{spiel.sprache === s ? '✓' : ''}</span>{r(s)}
				</label>
			{/each}
		</fieldset>
		<button class="knopf" aria-pressed={spiel.gross} onclick={() => (spiel.gross = !spiel.gross)}>
			<span aria-hidden="true">A+</span><span class="sr">{r('groesser')}</span>
		</button>
	</div>
</header>
{#if spiel.banner}
	<p class="banner" role="status">{spiel.banner}</p>
{/if}

<style>
	.leiste {
		display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;
		margin-bottom: 1.5rem;
	}
	.wer { display: flex; gap: 0.9rem; align-items: center; flex: 1 1 16rem; }
	.weiss { color: #fff; }
	.werkzeug { display: flex; gap: 0.75rem; flex-wrap: wrap; }
	.sprache { display: flex; margin: 0; padding: 0; border: var(--ring); min-inline-size: 0; }
	.sprache label {
		display: inline-flex; align-items: center; gap: 0.4rem; min-height: calc(3.5rem - 6px);
		padding: 0.4rem 1rem; font-weight: 700; cursor: pointer;
	}
	.sprache label.an { background: var(--kobalt); }
	.haken { display: inline-block; width: 1em; }
	.sprache label:has(input:focus-visible) { outline: 3px solid #fff; outline-offset: 3px; box-shadow: 0 0 0 9px var(--kobalt); position: relative; }
	@media (max-width: 30rem) {
		.werkzeug { flex-wrap: nowrap; width: 100%; }
		.sprache { flex: 1; }
		.sprache label { flex: 1; padding: 0.3rem 0.5rem; font-size: 0.95rem; line-height: 1.15; }
	}
	.banner {
		background: var(--leiste); padding: 0.75rem 1rem; margin: -0.5rem 0 1.25rem; max-width: none;
		border-left: 6px solid #fff;
	}
</style>
