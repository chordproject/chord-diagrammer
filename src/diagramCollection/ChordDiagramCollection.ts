import { ChordAliases } from "./ChordAliases";
import { Chord } from "../models/Chord";
import { ChordDiagram } from "../models/ChordDiagram";

export class ChordDiagramCollection {
    async get(chord: Chord): Promise<ChordDiagram[] | undefined> {
        const note = ChordAliases.getNoteAlias(chord.key);
        if (!note) {
            return undefined;
        }

        return undefined;
    }

    private async getDiagrams(chord: Chord, path: string): Promise<ChordDiagram[] | undefined> {
        let diagrams = require("./chordAliases").json()
        let allDiagrams: DiagramDefinition[] = import(path).then((module) => module.chords);
        const bass = chord.bass ? chord.bass.toString() : "";
        const type = chord.type;
        const diagrams: ChordDiagram[] = allDiagrams
            .filter((d) => d.bass == bass && d.type == type)
            .map((d) => new ChordDiagram(chord, d.frets, d.fingers, d.variation));
        return diagrams;
    }
}
