import { SvgBuilder } from '../src/svgBuilder';
import { ChordDiagram } from '../src/models/chordDiagram';
import { Instrument } from '../src/models/instrument';

// chordSample
const chordDiagram = new ChordDiagram({
	frets: [-1, 3, 2, 0, 1, 0],
	fingers: [0, 3, 2, 0, 1, 0],
	baseFret: 3,
});

const instrument: Instrument = {
	stringsCount: 6,
	fretsOnDiagram: 4,
	name: 'Guitar',
	tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
};

const builder = new SvgBuilder();
var svg = builder.build(chordDiagram, instrument);
document.body.appendChild(svg);
console.log(svg);
