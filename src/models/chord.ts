export class Chord {
    constructor(
        public readonly key: string,
        public readonly type: string,
        public readonly bass: string = ""
    ) {}
}
