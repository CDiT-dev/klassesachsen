<script>
	import { spiel, r, Q, geheZu } from '$lib/spiel.svelte.js';
	import { CODE, normCode } from '$lib/regeln.js';
	import Leiste from './Leiste.svelte';

	let eingabe = $state('');
	let fehler = $state(false);

	/** @param {SubmitEvent} e */
	function pruefen(e) {
		e.preventDefault();
		const c = normCode(eingabe);
		// shortcut: the demo knows one class code; a real class list comes with the teacher view (COS-206)
		if (!CODE.test(c) || c !== Q.demo.klassencode) {
			fehler = true;
			return;
		}
		spiel.code = c;
		geheZu('gruppe');
	}
</script>

<Leiste />
<form class="stapel code" onsubmit={pruefen} novalidate>
	<h1 tabindex="-1">{r('code-titel')}</h1>
	<label for="code" class="leise">{r('code-text')}</label>
	<input
		id="code"
		bind:value={eingabe}
		oninput={() => (fehler = false)}
		maxlength="7"
		autocomplete="off"
		autocapitalize="characters"
		spellcheck="false"
		aria-invalid={fehler}
		aria-describedby="code-hilfe code-fehler"
	/>
	<p id="code-fehler" role="alert" class="fehler">{fehler ? r('code-fehler') : ''}</p>
	<p id="code-hilfe" class="leise klein">{r('code-demo', { code: Q.demo.klassencode })}</p>
	<div class="reihe">
		<button type="button" class="knopf" onclick={() => geheZu('start')}>{r('zurueck')}</button>
		<button type="submit" class="knopf haupt">{r('weiter')} <span aria-hidden="true">→</span></button>
	</div>
	<button type="button" class="knopf" onclick={() => geheZu('gruppe')}>{r('ohne-code')}</button>
</form>

<style>
	.code { max-width: 34rem; }
	input {
		display: block; width: 100%; max-width: 22rem; min-height: 4.5rem;
		font: 700 2.25rem/1 var(--mono); letter-spacing: 0.35em; text-transform: uppercase;
		padding: 0.5rem 1rem; color: var(--tinte); background: var(--karte); border: var(--ring); border-radius: 0;
	}
	input[aria-invalid='true'] { border-color: #ffb4ad; border-width: 5px; }
	.fehler { color: #fff; font-weight: 700; min-height: 1.5em; }
	.fehler:not(:empty)::before { content: '! '; color: #ffb4ad; }
</style>
