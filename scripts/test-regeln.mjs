// Checks the game rules in src/lib/regeln.js and that every station's game structure can run.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sieger, summe, pruefeSchale, CODE, normCode, tausche, linieDazu } from '../src/lib/regeln.js';

assert.equal(summe([3, 1]), 4);
assert.equal(sieger([3, 1]), 0);
assert.equal(sieger([1, 3]), 1);
assert.equal(sieger([2, 2]), -1, 'tie');
assert.equal(sieger([1, 0]), 0, 'solo vote');

assert.equal(pruefeSchale([0, 1], [0, 1, 2]), 'zu-wenig');
assert.equal(pruefeSchale([2, 0, 1], [0, 1, 2]), 'ok', 'order does not matter');
assert.equal(pruefeSchale([0, 3, 1], [0, 1, 2]), 3, 'first wrong ingredient');

assert.ok(CODE.test('BURG25'));
assert.equal(normCode(' burg-25 '), 'BURG25');
for (const bad of ['BURG2O', 'BURG21', 'LURG25', 'BURG2']) assert.ok(!CODE.test(bad), bad);

assert.deepEqual(tausche([1, 2, 3], 0, 2), [3, 2, 1]);
assert.deepEqual(linieDazu([[0, 1]], 1, 0), [[0, 1]], 'no duplicate line');
assert.deepEqual(linieDazu([], 4, 4), [], 'no dot line');
assert.deepEqual(linieDazu([], 0, 8), [[0, 8]]);

// content: the demo code passes the code rule, every station plays at least one minigame
const q = JSON.parse(readFileSync(new URL('../content/quest.de.json', import.meta.url), 'utf8'));
assert.ok(CODE.test(q.demo.klassencode));
for (const st of q.stationen) {
	assert.equal(st.spiel.ablauf[0], 'auftrag', st.id);
	assert.ok(st.spiel.ablauf.some((s) => ['suchen', 'abstimmen', 'raetsel'].includes(s)), st.id);
	if (st.spiel.abstimmung) assert.equal(st.texte.auswahl.optionen.length, st.spiel.abstimmung.stimmen.length, st.id);
}
console.log('regeln ok');
