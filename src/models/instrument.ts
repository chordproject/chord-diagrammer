export class Instrument {
    /**
     *
     */
    constructor(name: string, stringsCount: number, fretsOnDiagram: number, tuning: string[]) {
        this.name = name;
        this.stringsCount = stringsCount;
        this.fretsOnDiagram = fretsOnDiagram;
        this.tuning = tuning;
    }
    /**
     * Number of strings
     */
    stringsCount: number;
    /**
     * Number of frets to show on the diagram
     */
    fretsOnDiagram: number;
    /**
     * Instrument's name
     */
    name: string;
    /**
     * Instrument's tuning
     */
    tuning: string[];
}
