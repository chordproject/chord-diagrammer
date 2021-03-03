import { Helper } from './helper';
import { ChordDiagram } from './models/chordDiagram';
import { Instrument } from './models/instrument';
import { Neck } from './neck';

export class DiagramGenerator {
	generate(chord: ChordDiagram, instrument: Instrument): any {
		var tuning = instrument.tunings.standard;
		var strings = instrument.strings;
		var frets = chord.frets;
		var capo = chord.capo;
		var fretsOnChord = instrument.fretsOnChord;
		var baseFret = chord.baseFret;

		var svg = Helper.createSVGElement('svg', {
			width: '100%',
			preserveAspectRatio: 'xMinYMin meet',
			viewBox: '0 0 80 70',
		});

		var rootElement = Helper.createSVGElement('g', {
			transform: 'translate(13, 13)',
		});

		const neck = new Neck();
		rootElement.appendChild(
			neck.build(tuning, strings, frets, capo, fretsOnChord, baseFret)
		);
		svg.appendChild(rootElement);

		return svg;
	}
}
