// Game rules without UI, shared by the components and scripts/test-regeln.mjs.

/** @param {number[]} stimmen */
export const summe = (stimmen) => stimmen.reduce((a, b) => a + b, 0);

/**
 * Winner of a show-of-hands vote.
 * @param {number[]} stimmen tally per option
 * @returns {number} index of the winning option, -1 on a tie
 */
export function sieger(stimmen) {
	const max = Math.max(...stimmen);
	return stimmen.filter((s) => s === max).length > 1 ? -1 : stimmen.indexOf(max);
}

/**
 * Check the bowl of the team riddle.
 * @param {number[]} schale indices of the chosen ingredients
 * @param {number[]} richtig indices of the right ingredients
 * @returns {'ok' | 'zu-wenig' | number} 'ok', 'zu-wenig', or the index of the first wrong ingredient
 */
export function pruefeSchale(schale, richtig) {
	if (schale.length < richtig.length) return 'zu-wenig';
	const falsch = schale.find((i) => !richtig.includes(i));
	return falsch === undefined ? 'ok' : falsch;
}

// Class codes avoid O, 0, I, 1 and L, which children mix up.
export const CODE = /^[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{6}$/;
/** @param {string} s */
export const normCode = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

/**
 * Swap two places of the showcase.
 * @param {number[]} ordnung
 * @param {number} a
 * @param {number} b
 */
export function tausche(ordnung, a, b) {
	const o = [...ordnung];
	[o[a], o[b]] = [o[b], o[a]];
	return o;
}

/** Dots of the 3 x 3 mason's-mark grid, 0 top left to 8 bottom right. */
export const PUNKTE = ['oben links', 'oben Mitte', 'oben rechts', 'Mitte links', 'Mitte', 'Mitte rechts', 'unten links', 'unten Mitte', 'unten rechts'];

/**
 * Add a line to a mason's mark unless it is a dot or already there.
 * @param {number[][]} linien
 * @param {number} a
 * @param {number} b
 */
export function linieDazu(linien, a, b) {
	if (a === b || linien.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return linien;
	return [...linien, [a, b]];
}
