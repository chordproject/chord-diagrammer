import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Chord, ChordDiagramCollection } from '../dist/index.js';

const definitions = JSON.parse(await readFile(new URL('../data/guitar.json', import.meta.url), 'utf8'));
const collection = new ChordDiagramCollection(definitions);

assert.equal(collection.get(new Chord('C', 'M')).length > 0, true);
assert.equal(collection.get(new Chord('A', 'm')).length > 0, true);
assert.equal(collection.get(new Chord('A', 'm', 'E')).length > 0, true);
assert.equal(collection.get(new Chord('C', '', 'G')).length > 0, true);
assert.equal(collection.get(new Chord('D', '', 'F#')).length > 0, true);

console.log('ChordDiagramCollection smoke tests passed');
