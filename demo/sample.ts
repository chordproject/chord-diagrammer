import { Diagrammer } from "../src/diagrammer";
import { ChordDiagram } from "../src/models/chordDiagram";

// chordSample
const chord = new ChordDiagram();
chord.frets = [-1,3,2,3,2,3];
chord.fingers = [0,2,1,3,1,4];
chord.baseFret = 1;

const instrument = {
  strings: 6,
  fretsOnChord: 4,
  name: "Guitar",
  keys: [],
  tunings: {
    standard: ["E", "A", "D", "G", "B", "E"],
  },
};

const generator = new Diagrammer();
var svg = generator.builder(chord, instrument);
document.body.appendChild(svg);
console.log(svg);
