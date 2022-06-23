export interface BarreData {
    fret: number;
    startString: number;
    endString: number;
}

export class ChordDiagram {
    frets: number[] = [];
    fingers: number[] = [];
    baseFret: number = 1;

    constructor(init?: Partial<ChordDiagram>) {
        Object.assign(this, init);
    }

    public get barres(): BarreData[] {
        let barres: BarreData[] = [];
        if (this.fingers.filter((f) => f > 0).length == 0) {
            return [];
        }

        let dots: [number, number][] = [];
        for (let index = 0; index < this.frets.length; index++) {
            dots.push([this.frets[index], this.fingers[index]]);
        }

        const onlyFrets = this.frets
            .filter((value, index, self) => value > 0 && self.indexOf(value) === index)
            .sort((a, b) => a - b);
        onlyFrets.forEach((fret) => {
            for (let index = 0; index < dots.length; index++) {
                const dot = dots[index];
                if (dot[0] !== fret) {
                    continue;
                }
                const startString = index;
                const finger = dot[1];
                let totalFingers = 1;
                while (++index < dots.length && (dots[index][0] >= fret || dots[index][0] === -1)) {
                    if (dots[index][0] === fret) {
                        //Check if it's the same finger
                        if (dots[index][1] !== finger) {
                            continue;
                        }
                        totalFingers++;
                    }
                }
                if (totalFingers > 1) {
                    barres.push({
                        fret: fret,
                        startString: startString,
                        endString: index - 1,
                    });
                }
            }
        });
        return barres;
    }
}
