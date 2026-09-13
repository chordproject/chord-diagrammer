import { ChordDiagram } from "../models/chordDiagram";
import { Chord } from "../models/chord";
import { ChordAliases } from "./chordAliases";

export interface DiagramDefinition {
    key: string;
    type: string;
    bass?: string;
    frets: number[];
    fingers?: number[];
    baseFret?: number;
    variation?: number;
    instrument?: number;
}

export class ChordDiagramCollection {
    private readonly definitions: readonly DiagramDefinition[];

    constructor(definitions: readonly DiagramDefinition[] = []) {
        this.definitions = definitions;
    }

    get(chord: Chord): ChordDiagram[] {
        const key = ChordAliases.key(chord.key);
        const type = ChordAliases.type(chord.type);
        const bass = ChordAliases.key(chord.bass || "");

        return this.definitions
            .filter((definition) => {
                return (
                    ChordAliases.key(definition.key) === key &&
                    ChordAliases.type(definition.type) === type &&
                    ChordAliases.key(definition.bass ?? "") === bass
                );
            })
            .sort((left, right) => (left.variation ?? 0) - (right.variation ?? 0))
            .map((definition) => {
                return new ChordDiagram({
                    frets: definition.frets,
                    fingers: definition.fingers ?? [],
                    baseFret: definition.baseFret ?? this.getBaseFret(definition.frets),
                    variation: definition.variation,
                });
            });
    }

    private getBaseFret(frets: number[]): number {
        const playedFrets = frets.filter((fret) => fret > 0);
        return playedFrets.length > 0 ? Math.min(...playedFrets) : 1;
    }
}
