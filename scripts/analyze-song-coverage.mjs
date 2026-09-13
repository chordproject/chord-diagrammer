import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Chord, ChordDiagramCollection } from '../dist/index.js';

const songsPath = process.argv[2] || '../chordproject-client/backups/firestore-homenajesus-app-latest/collections/songs.json';
const datasetPath = process.argv[3] || 'data/guitar.json';
const songsBackup = JSON.parse(await readFile(path.resolve(songsPath), 'utf8'));
const definitions = JSON.parse(await readFile(path.resolve(datasetPath), 'utf8'));
const collection = new ChordDiagramCollection(definitions);
const usage = new Map();
let songsWithContent = 0;
let totalChordOccurrences = 0;
let malformedOccurrences = 0;
const malformedTokens = new Set();
let expandedSequenceOccurrences = 0;
const songsWithValidChords = new Set();

for (const document of songsBackup.documents ?? []) {
    const content = document.data?.content;
    if (typeof content !== 'string' || !content.trim()) continue;
    songsWithContent++;

    for (const token of content.matchAll(/\[([^\]]+)\]/g)) {
        const chords = expandChordToken(token[1]);
        if (chords.length === 0) {
            if (token[1].trim() && !token[1].trim().startsWith('*')) {
                malformedOccurrences++;
                malformedTokens.add(token[1].trim());
            }
            continue;
        }
        if (chords.length > 1) expandedSequenceOccurrences++;
        for (const chord of chords) {
            totalChordOccurrences++;
            songsWithValidChords.add(document.id);
            const key = `${chord.key}${chord.type}${chord.bass ? `/${chord.bass}` : ''}`;
            const entry = usage.get(key) ?? { ...chord, occurrences: 0, songs: new Set() };
            entry.occurrences++;
            entry.songs.add(document.id);
            usage.set(key, entry);
        }
    }
}

const rows = [...usage.values()].map((entry) => ({
    ...entry,
    songIds: entry.songs,
    songs: entry.songs.size,
    supported: collection.get(new Chord(entry.key, entry.type, entry.bass)).length > 0,
}));
const supported = rows.filter((row) => row.supported);
const missing = rows.filter((row) => !row.supported).sort((a, b) => b.occurrences - a.occurrences || b.songs - a.songs);
const occurrenceCoverage = totalChordOccurrences ? supported.reduce((sum, row) => sum + row.occurrences, 0) / totalChordOccurrences : 1;
const songsWithSupportedChord = new Set(supported.flatMap((row) => [...row.songIds])).size;
const songCoverage = songsWithValidChords.size ? songsWithSupportedChord / songsWithValidChords.size : 1;

console.log(JSON.stringify({
    songs: songsWithContent,
    songsWithValidChords: songsWithValidChords.size,
    totalChordOccurrences,
    expandedSequenceOccurrences,
    malformedOccurrences,
    malformedTokens: [...malformedTokens].sort(),
    uniqueChords: rows.length,
    supportedChords: supported.length,
    missingChords: missing.length,
    occurrenceCoverage: Number((occurrenceCoverage * 100).toFixed(2)),
    songCoverage: Number((songCoverage * 100).toFixed(2)),
    mostUsedMissing: missing.slice(0, 30).map(({ key, type, bass, occurrences, songs }) => ({
        chord: `${key}${type}${bass ? `/${bass}` : ''}`,
        occurrences,
        songs,
    })),
}, null, 2));

function expandChordToken(value) {
    const token = value.trim();
    if (!token || token.startsWith('*')) return [];

    const pieces = token
        .split(',')
        .flatMap((piece) => piece.trim().split(/\s+/))
        .flatMap((piece) => piece.endsWith('-') ? [piece] : piece.split(/-+/).filter(Boolean))
        .filter((piece) => piece !== '-');

    return pieces.flatMap((piece) => {
        const slashIndex = piece.indexOf('/');
        if (slashIndex >= 0 && !/^[A-G](?:#|b)?$/.test(piece.slice(slashIndex + 1))) {
            return [piece.slice(0, slashIndex), piece.slice(slashIndex + 1)]
                .map(parseChordToken)
                .filter(Boolean);
        }
        const chord = parseChordToken(piece);
        return chord ? [chord] : [];
    });
}

function parseChordToken(value) {
    if (!value || /\s/.test(value)) return null;
    const rootMatch = value.match(/^([A-G](?:#|b)?)(.*)$/);
    if (!rootMatch) return null;

    const root = rootMatch[1];
    const suffix = rootMatch[2] ?? '';
    const slashIndex = suffix.indexOf('/');
    if (suffix.includes('-') && suffix !== '-') return null;
    return slashIndex >= 0
        ? /^[A-G](?:#|b)?$/.test(suffix.slice(slashIndex + 1))
            ? { key: root, type: suffix.slice(0, slashIndex), bass: suffix.slice(slashIndex + 1) }
            : null
        : { key: root, type: suffix, bass: '' };
}
