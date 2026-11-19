// Game state, text lookup and the moves between screens. Everything stays on the device.
import { tick } from 'svelte';
import quest from '../../content/quest.de.json';

/** The content file, read as is (structure checked by content/check.py). @type {any} */
export const Q = quest;

const SPEICHER = 'klassesachsen-spiel-1';

function ergebnis() {
	return { versuche: /** @type {number[]} */ ([]), tipps: 0, fehl: /** @type {number[]} */ ([]), runden: /** @type {number[][]} */ ([]), wahl: /** @type {number | null} */ (null), grund: '' };
}

function neu() {
	return {
		screen: 'start',
		modus: '', // 'klasse' | 'allein'
		code: '',
		tier: '',
		groesse: 4,
		ort: 'klasse', // 'burg' | 'klasse'
		zeichen: /** @type {number[][]} */ ([]),
		sprache: 'einfach', // 'einfach' | 'leicht'
		gross: false,
		amTablet: '',
		banner: '',
		weiter: /** @type {any} */ (null), // where the hand-over screen leads
		station: 1,
		schritt: 0,
		ergebnis: [ergebnis(), ergebnis(), ergebnis(), ergebnis()], // index = station number, 0 unused
		karten: /** @type {({ gedreht: boolean, abgelegt: string } | null)[]} */ ([null, null, null, null]),
		ordnung: [1, 2, 3],
		satz: '',
		eigenerSatz: ''
	};
}

export const spiel = $state(neu());

export function laden() {
	try {
		const s = localStorage.getItem(SPEICHER);
		if (s) Object.assign(spiel, JSON.parse(s));
	} catch {
		// private mode or blocked storage: the game still runs, it just does not survive a reload
	}
}

export function speichern() {
	try {
		localStorage.setItem(SPEICHER, JSON.stringify(spiel));
	} catch {
		// see laden()
	}
}

/** Start over but keep language and text size. */
export function neuAnfangen() {
	const { sprache, gross } = spiel;
	Object.assign(spiel, neu(), { sprache, gross });
}

/**
 * Text in the chosen language level, with {placeholders} filled.
 * @param {any} obj a text object with einfach and leicht
 * @param {Record<string, string | number>} [vars]
 */
export function t(obj, vars = {}) {
	if (!obj) return '';
	let s = obj[spiel.sprache] ?? obj.einfach;
	for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
	return s;
}

/** @param {string} key @param {Record<string, string | number>} [vars] */
export const r = (key, vars) => t(Q.rahmen[key], vars);

/** Label of an invented voice. @param {any} v */
export const label = (v) => (spiel.sprache === 'leicht' ? (v.label_leicht ?? v.label) : v.label);

/** @param {string} id */
export function bild(id) {
	const b = Q.bilder[id];
	return { src: '/' + b.datei.replace(/^static\//, ''), alt: b.alt, titel: b.titel };
}

/** @param {number} n */
export const station = (n) => Q.stationen[n - 1];

/**
 * What a station's Fundkarte shows, after what the team chose.
 * @param {number} n
 */
export function karte(n) {
	const st = station(n);
	const sp = st.spiel;
	const e = spiel.ergebnis[n];
	const ab = sp.abstimmung;
	let vorne = st.fundkarte.vorne;
	let wahl = '';
	if (ab && e && e.wahl !== null) {
		vorne = st.fundkarte[e.wahl === -1 ? 'vorne-beide' : `vorne-${ab.stimmen[e.wahl]}`] ?? vorne;
		wahl = e.wahl === -1 ? r('beide-seiten') : st.texte.auswahl.optionen[e.wahl];
	}
	return {
		st,
		kopf: st.fund,
		objekt: st.objekt,
		bild: bild(sp.kartenbild),
		bildHinten: sp.kartenbild_hinten ? bild(sp.kartenbild_hinten) : null,
		vorne,
		hinten: st.fundkarte.hinten,
		zusatz: st.fundkarte.zusatzfrage,
		wahl,
		grund: e?.grund ?? ''
	};
}

/** @param {any} obj */
async function zeige(obj) {
	Object.assign(spiel, obj);
	await tick();
	window.scrollTo(0, 0);
	/** @type {HTMLElement | null} */ (document.querySelector('main h1'))?.focus();
}

/** @param {string} screen @param {object} [extra] */
export const geheZu = (screen, extra = {}) => zeige({ screen, banner: '', ...extra });

/**
 * Hand the device to a role. With a class this is a full hand-over screen;
 * alone it shrinks to a banner on the next screen.
 * @param {string} rolle
 * @param {object} ziel state for the screen after the hand-over
 */
export function uebergeben(rolle, ziel) {
	spiel.amTablet = rolle;
	if (spiel.modus === 'allein') return zeige({ ...ziel, banner: r('allein-banner', { rolle }) });
	return zeige({ screen: 'uebergabe', weiter: ziel, banner: '' });
}

/** Next step of the current station, with a hand-over if the content file asks for one. */
export function naechsterSchritt() {
	const sp = station(spiel.station).spiel;
	let i = spiel.schritt + 1;
	// a second tie puts both sides on the card: nothing to give a reason for
	if (sp.ablauf[i] === 'begruenden' && spiel.ergebnis[spiel.station].wahl === -1) i++;
	if (i >= sp.ablauf.length) return zurFundkarte();
	const rolle = sp.uebergabe?.[sp.ablauf[i]];
	if (rolle && rolle !== spiel.amTablet) return uebergeben(rolle, { screen: 'station', schritt: i });
	if (sp.ablauf[i] === 'raetsel') spiel.amTablet = Q.rahmen.alle.einfach;
	return zeige({ screen: 'station', schritt: i, banner: '' });
}

export function zurFundkarte() {
	spiel.karten[spiel.station] = { gedreht: false, abgelegt: '' };
	return zeige({ screen: 'fundkarte', banner: '' });
}

/** The station the team plays next, or 0 when all three cards are filed. */
export function offeneStation() {
	return [1, 2, 3].find((n) => !spiel.karten[n]?.abgelegt) ?? 0;
}

/** @param {number} n */
export const zurStation = (n) => uebergeben('Plan', { screen: 'station', station: n, schritt: 0 });
