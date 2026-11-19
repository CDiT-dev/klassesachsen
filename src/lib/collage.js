// The team's showcase as a square PNG (2048 px, LV 4.4), drawn on a canvas in the browser.
// No names: only the animal group name, the mason's mark, the cards and the sentence.

const S = 2048;

/**
 * @param {CanvasRenderingContext2D} c
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} breite
 * @param {number} zeile line height
 */
function umbrechen(c, text, x, y, breite, zeile) {
	let z = '';
	for (const w of text.split(' ')) {
		const probe = z ? `${z} ${w}` : w;
		if (c.measureText(probe).width > breite && z) {
			c.fillText(z, x, y);
			y += zeile;
			z = w;
		} else z = probe;
	}
	c.fillText(z, x, y);
	return y + zeile;
}

/** @param {string} src */
async function laden(src) {
	const img = new Image();
	img.src = src;
	await img.decode();
	return img;
}

/**
 * @param {{ satz: string, gruppe: string, zeichen: number[][], karten: { src: string, objekt: string, zeile: string }[] }} d
 * @returns {Promise<Blob>}
 */
export async function collage(d) {
	await Promise.all([document.fonts.load('800 140px Archivo'), document.fonts.load('700 48px Atkinson'), document.fonts.load('400 40px Atkinson')]);
	const bilder = await Promise.all(d.karten.map((k) => laden(k.src)));
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = S;
	const c = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
	if ('fontStretch' in c) /** @type {any} */ (c).fontStretch = 'expanded';

	c.fillStyle = '#173e35';
	c.fillRect(0, 0, S, S);
	c.fillStyle = '#ffffff';
	c.textBaseline = 'top';
	c.font = '800 140px Archivo, sans-serif';
	umbrechen(c, d.satz, 130, 140, S - 260, 150);

	const w = 560, h = 820, y0 = 820;
	const winkel = [-3.5, 0, 3.5];
	d.karten.forEach((k, i) => {
		const cx = 130 + w / 2 + i * (w + 64);
		c.save();
		c.translate(cx, y0 + h / 2);
		c.rotate((winkel[i] * Math.PI) / 180);
		c.translate(-w / 2, -h / 2);
		c.fillStyle = '#e7ecef';
		c.fillRect(0, 0, w, h);
		// image, cropped to a square
		const img = bilder[i];
		const q = Math.min(img.naturalWidth, img.naturalHeight);
		c.drawImage(img, (img.naturalWidth - q) / 2, (img.naturalHeight - q) / 2, q, q, 30, 30, w - 60, w - 60);
		c.fillStyle = '#16181a';
		c.font = '800 54px Archivo, sans-serif';
		const y = umbrechen(c, k.objekt, 30, w + 10, w - 60, 58);
		if (k.zeile) {
			c.font = '400 38px Atkinson, sans-serif';
			umbrechen(c, k.zeile, 30, y + 6, w - 60, 46);
		}
		c.restore();
	});

	// footer: mason's mark and group name
	const fx = 130, fy = 1810, fs = 110;
	c.strokeStyle = '#ffffff';
	c.lineWidth = 6;
	c.strokeRect(fx, fy, fs, fs);
	c.lineWidth = 9;
	c.lineCap = 'round';
	/** @param {number} p */
	const pt = (p) => [fx + fs * (0.2 + (p % 3) * 0.3), fy + fs * (0.2 + Math.floor(p / 3) * 0.3)];
	for (const [a, b] of d.zeichen) {
		c.beginPath();
		c.moveTo(pt(a)[0], pt(a)[1]);
		c.lineTo(pt(b)[0], pt(b)[1]);
		c.stroke();
	}
	c.fillStyle = '#ffffff';
	c.font = '700 48px Atkinson, sans-serif';
	c.fillText(d.gruppe, fx + fs + 40, fy + 30);

	return new Promise((ok, fehler) => canvas.toBlob((b) => (b ? ok(b) : fehler(new Error('PNG'))), 'image/png'));
}
