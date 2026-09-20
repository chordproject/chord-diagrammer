import { Helper } from "./helper";
import { ChordDiagram } from "./models/chordDiagram";
import { Instrument } from "./models/instrument";
import { Neck } from "./neck";
import { Barre } from "./barre";
import { Dot } from "./dot";
import { Settings } from "./settings";
import { TREBLE_CLEF_PATH } from "./assets/trebleClef";

export class SvgBuilder {
    settings: Settings = new Settings();

    build(chord: ChordDiagram, instrument: Instrument, chordTones?: string[]): SVGElement {
        var stringNames = this.getStringNames(chord, instrument.tuning, chordTones);
        var stringsCount = instrument.stringsCount;
        var fretsOnChord = instrument.fretsOnDiagram;
        var baseFret = chord.baseFret > 0 ? chord.baseFret : 1;

        const baseBoxWidth =
            (stringsCount - 1) * this.settings.stringSpace +
            2 * (this.settings.dot.radius + this.settings.dot.borderWidth);
        const baseFretTextWidth = baseFret <= 1 || !this.settings.neck.baseFret.visible
            ? 0
            : 9 + this.settings.neck.baseFret.margin;
        const viewBoxWidth = baseBoxWidth + 2 * baseFretTextWidth;

        const baseBoxHeight = fretsOnChord * this.settings.fretSpace;
        const stringNamesHeight = !this.settings.neck.stringName.visible
            ? 0
            : 10 + this.settings.neck.stringName.margin;
        const nutHeight = baseFret > 1 || !this.settings.neck.nut.visible ? 0 : this.settings.neck.nut.width;
        const stringInfoHeight = !this.settings.neck.stringInfo.visible
            ? 0
            :
            4 +
            this.settings.dot.openStringRadius +
            this.settings.neck.stringInfo.margin +
            this.settings.dot.borderWidth;
        const viewBoxHeight = baseBoxHeight + stringNamesHeight + nutHeight + stringInfoHeight;

        var svg = Helper.createSVGElement("svg", {
            class: "chordproject-diagram",
            width: "100%",
            "font-family": this.settings.fontFamily,
            preserveAspectRatio: "xMinYMin meet",
            viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
        });

        const translateX = baseFretTextWidth + this.settings.dot.radius;
        const translateY = nutHeight + stringInfoHeight;
        var rootElement = Helper.createSVGElement("g", {
            transform: `translate(${translateX}, ${translateY})`,
        });

        // Neck
        const neck = new Neck(this.settings);
        rootElement.appendChild(neck.build(stringNames.map((note) => this.formatNoteName(note)), stringsCount, fretsOnChord, baseFret));

        // Barres
        if (chord.barres.length > 0) {
            const barresData = chord.barres;
            barresData.forEach((barreData) => {
                const barre = new Barre(this.settings);
                rootElement.appendChild(barre.build(barreData.fret, barreData.startString, barreData.endString));
            });
        }

        // Dots
        this.onlyDots(chord).forEach((dotData) => {
            const dot = new Dot(this.settings);
            const finger = chord.fingers ? chord.fingers[dotData.fret] : 0;
            rootElement.appendChild(dot.build(dotData.fret, dotData.value, finger, baseFret === 1 && this.settings.neck.nut.visible));
        });

        svg.appendChild(rootElement);

        return svg;
    }

    buildStaff(chord: ChordDiagram, instrument: Instrument, chordTones?: string[]): SVGElement {
        const staff = Helper.createSVGElement("svg", {
            class: "chordproject-staff",
            width: "100%",
            height: "100%",
            "font-family": this.settings.fontFamily,
            preserveAspectRatio: "xMidYMid meet",
            viewBox: "-8 -12 50 30",
        });
        staff.appendChild(this.buildStaffGraphic(chordTones ?? this.getStringNames(chord, instrument.tuning), 0, 3));
        return staff;
    }

    private onlyDots(chord: ChordDiagram) {
        let dots = chord.frets.map((f, index) => ({ fret: index, value: f }));
        return dots;
    }

    private getStringNames(chord: ChordDiagram, tuning: string[], chordTones?: string[]): string[] {
        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

        return tuning.map((openNote, index) => {
            const fret = chord.frets[index] ?? -1;
            if (fret < 0) {
                return "x";
            }

            const openNotePitch = this.getPitchClass(openNote);
            if (openNotePitch === undefined) {
                return openNote;
            }

            const position = fret === 0 ? 0 : (chord.baseFret > 0 ? chord.baseFret : 1) + fret - 1;
            const playedPitch = (openNotePitch + position) % noteNames.length;
            return chordTones?.find((tone) => this.getPitchClass(tone) === playedPitch) ?? noteNames[playedPitch];
        });
    }

    private getPitchClass(note: string): number | undefined {
        const match = note.match(/^([A-G])((?:#{1,2}|b{1,2}|x)?)$/);
        if (!match) {
            return undefined;
        }
        const naturalPitch: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        const accidental = match[2] === "x"
            ? 2
            : [...match[2]].reduce((sum, symbol) => sum + (symbol === "#" ? 1 : -1), 0);
        return (naturalPitch[match[1]] + accidental + 12) % 12;
    }

    private buildStaffGraphic(stringNames: string[], x: number, y: number): SVGElement {
        const staff = Helper.createSVGElement("g", {
            class: "chord-staff",
            transform: `translate(${x}, ${y})`,
        });
        const color = this.settings.neck.stringName.color;
        const lineSpacing = 2.2;
        const staffWidth = 34;
        const top = 0;

        for (let line = 0; line < 5; line++) {
            staff.appendChild(Helper.createSVGElement("line", {
                x1: 0,
                y1: top + line * lineSpacing,
                x2: staffWidth,
                y2: top + line * lineSpacing,
                stroke: color,
                strokeWidth: 0.35,
            }, true));
        }

        const clef = Helper.createSVGElement("path", {
            class: "chord-staff-clef",
            d: TREBLE_CLEF_PATH,
            fill: color,
            stroke: color,
            strokeWidth: 1,
            transform: "translate(-2.2 -7.8) scale(0.145)",
        }, true);
        staff.appendChild(clef);

        const notes = [...new Set(stringNames.filter((note) => note !== "x"))]
            .map((note) => ({ note, position: this.getStaffPosition(note) }))
            .sort((left, right) => left.position - right.position);
        const noteX = 27;
        let adjacentRunIndex = 0;
        const noteLayouts = notes.map(({ note, position }, index) => {
            const y = 9 - position * (lineSpacing / 2);
            const adjacentToPrevious = index > 0 && position - notes[index - 1].position === 1;
            const adjacentToNext = index < notes.length - 1 && notes[index + 1].position - position === 1;
            adjacentRunIndex = adjacentToPrevious ? adjacentRunIndex + 1 : 0;
            const x = adjacentToPrevious || adjacentToNext
                ? noteX + (adjacentRunIndex % 2 === 0 ? 2 : -2)
                : noteX - 2;
            return { note, position, x, y };
        });

        noteLayouts.forEach(({ note, x, y }) => {
            const notehead = Helper.createSVGElement("ellipse", {
                cx: x,
                cy: y,
                rx: 2.05,
                ry: 1.22,
                fill: color,
                transform: `rotate(-20 ${x} ${y})`,
            }, true);
            staff.appendChild(notehead);
        });

        const accidentalLanes: number[][] = [];
        noteLayouts.forEach(({ note, position, y }) => {
            const accidentalSymbol = this.getAccidentalSymbol(note);
            if (!accidentalSymbol) return;

            let lane = accidentalLanes.findIndex((positions) => positions.every((existing) => Math.abs(existing - position) >= 5));
            if (lane < 0) {
                lane = accidentalLanes.length;
                accidentalLanes.push([]);
            }
            accidentalLanes[lane].push(position);

            const accidental = Helper.createSVGElement("text", {
                class: "chord-staff-accidental",
                dataLane: lane,
                x: noteX - 4.5 - lane * 4.2,
                y: y + 1.4,
                fill: color,
                fontSize: accidentalSymbol === "𝄪" ? 6.2 : 4.6,
                textAnchor: "end",
            }, true);
            staff.appendChild(Helper.appendTextNode(accidental, accidentalSymbol));
        });

        if (noteLayouts.length > 0) {
            const noteYs = noteLayouts.map(({ y }) => y);
            staff.appendChild(Helper.createSVGElement("line", {
                class: "chord-staff-stem",
                x1: noteX,
                y1: Math.min(...noteYs) - 5,
                x2: noteX,
                y2: Math.max(...noteYs) + 0.3,
                stroke: color,
                strokeWidth: 0.4,
            }, true));
        }

        const labelNotes = [...noteLayouts].sort((left, right) => right.position - left.position);
        const labelX = 36;
        const denseLabels = labelNotes.length > 4;
        const labelRange = labelNotes.length <= 1
            ? 0
            : labelNotes.length === 2
                ? 4
                : labelNotes.length === 3
                    ? 8
                    : labelNotes.length === 4
                        ? 14
                        : 18;
        const labelTop = 5 - labelRange / 2;
        const labelSpacing = labelNotes.length > 1 ? labelRange / (labelNotes.length - 1) : 0;
        const labelFontSize = labelNotes.length >= 6 ? 2.6 : denseLabels ? 2.9 : 3.2;

        labelNotes.forEach(({ note }, index) => {
            const labelY = labelTop + index * labelSpacing;
            const label = Helper.createSVGElement("text", {
                class: "chord-staff-label",
                x: labelX,
                y: labelY + labelFontSize * 0.375,
                fill: color,
                fontSize: labelFontSize,
            }, true);
            staff.appendChild(Helper.appendNoteName(label, this.formatNoteName(note), "0.12em", "1.9em"));
        });

        return staff;
    }

    private getAccidentalSymbol(note: string): string | undefined {
        const accidental = note.slice(1);
        if (accidental === "#") return "♯";
        if (accidental === "##") return "𝄪";
        if (accidental === "b") return "♭";
        if (accidental === "bb") return "♭♭";
        return undefined;
    }

    private formatNoteName(note: string): string {
        const match = note.match(/^([A-G])((?:#{1,2}|b{1,2})?)$/);
        if (!match) return note;
        const symbols: Record<string, string> = {
            "#": "♯",
            "##": "𝄪",
            b: "♭",
            bb: "𝄫",
        };
        return `${match[1]}${symbols[match[2]] ?? ""}`;
    }

    private getStaffPosition(note: string): number {
        const naturalPositions: Record<string, number> = {
            C: 5,
            D: 6,
            E: 0,
            F: 1,
            G: 2,
            A: 3,
            B: 4,
        };
        return naturalPositions[note[0]] ?? 0;
    }

}
