import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Chord, ChordAliases, ChordDiagramCollection } from '../dist/index.js';

const songsPath = process.argv[2] || '../chordproject-client/backups/firestore-homenajesus-app-latest/collections/songs.json';
const datasetPath = process.argv[3] || 'data/guitar.json';
const outputPath = process.argv[4] || 'reports/homena-jesus-chord-corrections.json';
const songsBackup = JSON.parse(await readFile(path.resolve(songsPath), 'utf8'));
const definitions = JSON.parse(await readFile(path.resolve(datasetPath), 'utf8'));
const collection = new ChordDiagramCollection(definitions);
const usage = new Map();
const sequenceUsage = new Map();

for (const document of songsBackup.documents ?? []) {
    const content = document.data?.content;
    if (typeof content !== 'string') continue;

    for (const token of content.matchAll(/\[([^\]]+)\]/g)) {
        const sequence = expandCombinedToken(token[1]);
        if (sequence.length > 1) {
            const original = `[${token[1].trim()}]`;
            const entry = sequenceUsage.get(original) ?? {
                original,
                replacement: sequence.map(formatChord).map((chord) => `[${chord}]`).join(' '),
                occurrences: 0,
                songIds: new Set(),
                titles: new Set(),
                chords: sequence.map(formatChord),
            };
            entry.occurrences++;
            entry.songIds.add(document.id);
            if (document.data?.title) entry.titles.add(document.data.title);
            sequenceUsage.set(original, entry);
            continue;
        }

        const parsed = parseChordToken(token[1]);
        if (!parsed) continue;

        const key = formatChord(parsed);
        const entry = usage.get(key) ?? {
            ...parsed,
            chord: key,
            occurrences: 0,
            songIds: new Set(),
            titles: new Set(),
        };
        entry.occurrences++;
        entry.songIds.add(document.id);
        if (document.data?.title) entry.titles.add(document.data.title);
        usage.set(key, entry);
    }
}

const suggestions = [];
const unresolved = [];

for (const entry of sequenceUsage.values()) {
    const result = {
        original: entry.original,
        replacement: entry.replacement,
        occurrences: entry.occurrences,
                songIds: [...entry.songIds],
        songs: entry.songIds.size,
        titles: [...entry.titles].slice(0, 5),
        reason: 'split_combined_chords',
    };
    if (entry.chords.every((chord) => hasDiagram(canonicalChord(parseChordToken(chord))))) {
        suggestions.push(result);
    } else {
        unresolved.push({ ...result, reason: 'split_combined_chords_with_missing_diagram' });
    }
}

for (const entry of usage.values()) {
    const currentSupported = hasDiagram(entry);
    const canonical = canonicalChord(entry);
    const canonicalSupported = canonical && hasDiagram(canonical);

    const result = {
        original: entry.chord,
        occurrences: entry.occurrences,
        songIds: [...entry.songIds],
        songs: entry.songIds.size,
        titles: [...entry.titles].slice(0, 5),
    };

    if (canonical && canonical.type !== entry.type && canonicalSupported) {
        suggestions.push({
            ...result,
            replacement: `${entry.key}${canonical.type}${entry.bass ? `/${entry.bass}` : ''}`,
            reason: 'canonical_alias',
        });
    } else if (!currentSupported) {
        unresolved.push({
            ...result,
            reason: 'no_known_diagram',
        });
    }
}

suggestions.sort(compareUsage);
unresolved.sort(compareUsage);

const report = {
    source: path.resolve(songsPath),
    dataset: path.resolve(datasetPath),
    generatedAt: new Date().toISOString(),
    songsAnalyzed: songsBackup.documents?.length ?? 0,
    suggestions,
    unresolved,
};

await mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
await writeFile(path.resolve(outputPath), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
    output: path.resolve(outputPath),
    songsAnalyzed: report.songsAnalyzed,
    suggestions: suggestions.length,
    unresolved: unresolved.length,
    topSuggestions: suggestions.slice(0, 20),
    topUnresolved: unresolved.slice(0, 20),
}, null, 2));

function parseChordToken(value) {
    const token = value.trim();
    if (!token || token.startsWith('*') || /\s/.test(token)) return null;
    const match = token.match(/^([A-G](?:#|b)?)(.*)$/);
    if (!match) return null;

    const suffix = match[2] ?? '';
    const slashIndex = suffix.indexOf('/');
    if (slashIndex >= 0) {
        const bass = suffix.slice(slashIndex + 1);
        if (!/^[A-G](?:#|b)?$/.test(bass)) return null;
        return { key: match[1], type: suffix.slice(0, slashIndex), bass };
    }
    return { key: match[1], type: suffix, bass: '' };
}

function expandCombinedToken(value) {
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

function canonicalChord(chord) {
    const key = ChordAliases.key(chord.key);
    const type = ChordAliases.type(chord.type);
    const bass = chord.bass ? ChordAliases.key(chord.bass) : '';
    const canonical = { key, type, bass };
    return { ...canonical, chord: formatChord(canonical) };
}

function hasDiagram(chord) {
    return collection.get(new Chord(chord.key, chord.type, chord.bass)).length > 0;
}

function formatChord(chord) {
    return `${chord.key}${chord.type}${chord.bass ? `/${chord.bass}` : ''}`;
}

function compareUsage(left, right) {
    return right.occurrences - left.occurrences || right.songs - left.songs || left.original.localeCompare(right.original);
}
