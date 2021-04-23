import { Chord } from "../models/chord";

export abstract class ChordAliases {
    // aliases for the chord keys
    public static readonly keyAliases = new Map([
        ["A#", "Bb"],
        ["B#", "C"],
        ["C#", "Db"],
        ["D#", "Eb"],
        ["E#", "F"],
        ["F#", "Gb"],
        ["G#", "Ab"],
        ["A##", "B"],
        ["B##", "Db"],
        ["C##", "D"],
        ["D##", "E"],
        ["E##", "Gb"],
        ["F##", "G"],
        ["G##", "A"],
        ["Abb", "G"],
        ["Bbb", "A"],
        ["Cbb", "Bb"],
        ["Dbb", "C"],
        ["Ebb", "D"],
        ["Fbb", "Eb"],
        ["Gbb", "F"],
        ["Fb", "E"],
        ["Cb", "B"],
    ]);

    //aliases for the chord types
    public static readonly typeAliases = new Map([
        ["M", ""],
        ["maj", ""],
        ["Major", ""],
        ["-", "m"],
        ["", "m"],
        ["sus", "sus4"],
        ["4", "sus4"],
        ["2", "sus2"],
        ["aug", "+"],
        ["b5", "Mb5"],
        ["-#5", "m#5"],
        ["maj7", "M7"],
    ]);

    public static getNoteAlias(note: string): string {
        if (!note) {
            return note;
        }

        const noteAliasName = this.keyAliases.get(note);
        return noteAliasName ? noteAliasName : note;
    }

    public static getTypeAlias(type: string) {
        return this.typeAliases.get(type) ? this.typeAliases.get(type) : type;
    }
}
