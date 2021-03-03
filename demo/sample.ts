import { DiagramGenerator } from '../src/diagramGenerator';

// chordSample
const chord = {
	frets: [4, 2, 1, 1, -1, -1],
	fingers: [4, 2, 1, 1, 0, 0],
	barres: [1],
	baseFret: 10,
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

const generator = new DiagramGenerator();
var svg = generator.generate(chord, instrument);
document.body.appendChild(svg);
console.log(svg);

var s = new XMLSerializer();
var str = s.serializeToString(svg);
console.log(str);
