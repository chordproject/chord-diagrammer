import { Helper } from './helper';
import { ChordDiagram } from './models/chordDiagram';
import { Instrument } from './models/instrument';
import { Neck } from './neck';
import { Barre } from './barre';
import { Dot } from './dot';

export class Diagrammer {
	builder(chord: ChordDiagram, instrument: Instrument): SVGElement {
		var tuning = instrument.tunings.standard;
		var strings = instrument.strings;
		var frets = chord.frets;
		var capo = chord.capo;
		var fretsOnChord = instrument.fretsOnChord;
		var baseFret = chord.baseFret ? chord.baseFret : 1;

		var svg = Helper.createSVGElement('svg', {
			width: '100%',
			preserveAspectRatio: 'xMinYMin meet',
			viewBox: '0 0 80 70',
		});

		var rootElement = Helper.createSVGElement('g', {
			transform: 'translate(13, 13)',
		});

		// Neck
		const neck = new Neck();
		rootElement.appendChild(
			neck.build(tuning, strings, frets, capo, fretsOnChord, baseFret)
		);

		// Barres
		if (chord.barres) {
			chord.barres.forEach((value, index) => {
				const barre = new Barre();
				rootElement.appendChild(barre.build(index, chord, value));
			});
		}

		// Dots
		this.onlyDots(chord).forEach((fret) => {
			const dot = new Dot();
			const finger = chord.fingers ? chord.fingers[fret.position] : null;
			rootElement.appendChild(
				dot.build(fret.position, fret.value, instrument.strings, finger)
			);
		});

		svg.appendChild(rootElement);

		return svg;
	}

	private onlyDots(chord: ChordDiagram) {
		return chord.frets
			.map((f, index) => ({ position: index, value: f }))
			.filter((f) => !chord.barres || chord.barres.indexOf(f.value) === -1);
	}
}
