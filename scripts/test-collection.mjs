import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { Chord, ChordDiagram, ChordDiagramCollection, Instrument, SvgBuilder } from '../dist/index.js';

const dom = new JSDOM();
globalThis.document = dom.window.document;

const definitions = JSON.parse(await readFile(new URL('../data/guitar.json', import.meta.url), 'utf8'));
const collection = new ChordDiagramCollection(definitions);

assert.equal(collection.get(new Chord('C', 'M')).length > 0, true);
assert.equal(collection.get(new Chord('A', 'm')).length > 0, true);
assert.equal(collection.get(new Chord('A', 'm', 'E')).length > 0, true);
assert.equal(collection.get(new Chord('C', '', 'G')).length > 0, true);
assert.equal(collection.get(new Chord('D', '', 'F#')).length > 0, true);

const builder = new SvgBuilder();
const testChord = new ChordDiagram({ frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 });
const guitar = new Instrument('Guitar', 6, 4, ['E', 'A', 'D', 'G', 'B', 'E']);

builder.settings.neck.nut.visible = false;
builder.settings.neck.stringInfo.visible = false;
builder.settings.fingering.margin = 0;
const svg = builder.build(testChord, guitar);
assert.equal(svg.querySelectorAll('path').length, 1);
assert.equal(svg.querySelectorAll('circle').length, 3);
assert.equal(svg.textContent?.includes('x'), false);
assert.equal(svg.textContent?.includes('1'), true);
assert.equal([...svg.querySelectorAll('text')].find((element) => element.textContent === '1')?.getAttribute('y'), '7');

console.log('ChordDiagramCollection smoke tests passed');
