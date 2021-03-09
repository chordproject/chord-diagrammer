import { Diagrammer } from "../src/diagrammer";
import { ChordDiagram } from "../src/models/chordDiagram";
import { Instrument } from "../src/models/instrument";

// chordSample
const chordDiagram = new ChordDiagram({
  frets : [-1, 3, 2, 0, 1, 0],
  fingers : [0, 3, 2, 0, 1, 0],
  baseFret : 1,
});

const instrument:Instrument = {
  stringsCount: 6,
  fretsOnDiagram: 4,
  name: "Guitar",
  tuning: ["E", "A", "D", "G", "B", "E"]
};

const generator = new Diagrammer();
var svg = generator.builder(chordDiagram, instrument);
document.body.appendChild(svg);
console.log(svg);
