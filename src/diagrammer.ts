import { Helper } from "./helper";
import { ChordDiagram } from "./models/chordDiagram";
import { Instrument } from "./models/instrument";
import { Neck } from "./neck";
import { Barre } from "./barre";
import { Dot } from "./dot";
import { Settings } from "./settings";

export class Diagrammer {
  private _settings: Settings;
  constructor(settings: Settings = null) {
    if (!settings) {
      settings = new Settings();
    }

    this._settings = settings;
  }

  builder(chord: ChordDiagram, instrument: Instrument): SVGElement {
    var tuning = instrument.tunings.standard;
    var stringsCount = instrument.strings;
    var frets = chord.frets;
    var fretsOnChord = instrument.fretsOnChord;
    var baseFret = chord.baseFret ? chord.baseFret : 1;

    var svg = Helper.createSVGElement("svg", {
      width: "100%",
      preserveAspectRatio: "xMinYMin meet",
      viewBox: `0 0 ${8* this._settings.spacing.stringSpace} ${
        6 * this._settings.spacing.fretSpace
      }`,
    });

    var rootElement = Helper.createSVGElement("g", {
      transform: "translate(13, 13)",
    });

    // Neck
    const neck = new Neck(this._settings.neck, this._settings.spacing);
    rootElement.appendChild(
      neck.build(tuning, stringsCount, frets, fretsOnChord, baseFret)
    );

    // Barres
    if (chord.barres.length > 0) {
      const barresData = chord.barres;
      barresData.forEach((barreData) => {
        const barre = new Barre(this._settings.dot, this._settings.spacing);
        rootElement.appendChild(
          barre.build(
            barreData.fret,
            barreData.startString,
            barreData.endString
          )
        );
      });
    }

    // Dots
    this.onlyDots(chord).forEach((dotData) => {
      const dot = new Dot(this._settings.dot, this._settings.spacing);
      const finger = chord.fingers ? chord.fingers[dotData.fret] : null;
      rootElement.appendChild(
        dot.build(dotData.fret, dotData.value, finger, chord.baseFret === 1)
      );
    });

    svg.appendChild(rootElement);

    return svg;
  }

  private onlyDots(chord: ChordDiagram) {
    let dots = chord.frets.map((f, index) => ({ fret: index, value: f }));
    return dots;
  }
}
