import { Diagrammer } from '../src/diagrammer';

// chordSample
const chord = {
	frets: [1, 3, 3, 1, 0, -1],
	fingers: [1, 3, 3, 1, 0,0],
	barres: [1, 3],
	capo: true,
};
const instrument = {
	strings: 6,
	fretsOnChord: 4,
	name: 'Guitar',
	keys: [],
	tunings: {
		standard: ['E', 'A', 'D', 'G', 'B', 'E'],
	},
};

const generator = new Diagrammer();
var svg = generator.builder(chord, instrument);
document.body.appendChild(svg);
console.log(svg);

var s = new XMLSerializer();
var str = s.serializeToString(svg);
//console.log(str);
