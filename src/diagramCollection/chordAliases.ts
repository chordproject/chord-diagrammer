export class ChordAliases {
    static readonly keyAliases = new Map<string, string>([
        ["A#", "Bb"],
        ["B#", "C"],
        ["C#", "Db"],
        ["D#", "Eb"],
        ["E#", "F"],
        ["F#", "Gb"],
        ["G#", "Ab"],
        ["Fb", "E"],
        ["Cb", "B"],
    ]);

    static readonly typeAliases = new Map<string, string>([
        ["M", ""],
        ["maj", ""],
        ["Major", ""],
        ["major", ""],
        ["-", "m"],
        ["minor", "m"],
        ["min", "m"],
        ["mi", "m"],
        ["sus", "sus4"],
        ["4", "sus4"],
        ["2", "sus2"],
        ["add2", "add9"],
        ["(4)", "sus4"],
        ["+", "aug"],
        ["5+", "aug"],
        ["7sus", "7sus4"],
        ["M7", "maj7"],
        ["Maj7", "maj7"],
        ["mM7", "mmaj7"],
    ]);

    static key(key: string): string {
        return this.keyAliases.get(key) ?? key;
    }

    static type(type: string): string {
        return this.typeAliases.get(type) ?? type;
    }
}
