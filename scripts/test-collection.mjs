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
const staffSvg = builder.buildStaff(testChord, guitar);
const fSharpMinorSeventhStaff = builder.buildStaff(new ChordDiagram({ frets: [2, -1, 2, 2, 2, -1], baseFret: 1 }), guitar, ['F#', 'A', 'C#', 'E']);
const gSharpMinorSixthStaff = builder.buildStaff(new ChordDiagram(), guitar, ['G#', 'B', 'D#', 'E#']);
const eSharpNinthStaff = builder.buildStaff(new ChordDiagram(), guitar, ['E', 'G#', 'B', 'D', 'F##']);
const gSharpMinorSixthDiagram = builder.build(new ChordDiagram({ frets: [1, -1, -1, -1, -1, -1], baseFret: 1 }), guitar, ['G#', 'B', 'D#', 'E#']);
const eSharpNinthDiagram = builder.build(new ChordDiagram({ frets: [3, -1, -1, -1, -1, -1], baseFret: 1 }), guitar, ['E', 'G#', 'B', 'D', 'F##']);
const stackedAccidentalsStaff = builder.buildStaff(new ChordDiagram(), guitar, ['E#', 'G#', 'B#']);
const cThirteenthStaff = builder.buildStaff(new ChordDiagram(), guitar, ['C', 'E', 'G', 'Bb', 'D', 'F', 'A']);
const cMajorStaff = builder.buildStaff(new ChordDiagram(), guitar, ['C', 'E', 'G']);
assert.equal(svg.querySelectorAll('path').length, 7);
assert.equal(staffSvg.getAttribute('viewBox'), '-8 -12 50 30');
assert.equal(svg.querySelectorAll('circle').length, 3);
assert.equal(staffSvg.querySelector('g').querySelectorAll('line').length, 6);
assert.equal(staffSvg.querySelector('g').querySelectorAll('ellipse').length, 3);
assert.equal(staffSvg.querySelector('g').querySelectorAll('.chord-staff-label').length, 3);
assert.equal(staffSvg.querySelectorAll('.chord-staff-clef').length, 1);
assert.equal(staffSvg.textContent?.includes('𝄞'), false);
assert.equal(staffSvg.querySelector('g').getAttribute('transform'), 'translate(0, 3)');
assert.ok(Math.abs(Math.abs(Number(fSharpMinorSeventhStaff.querySelectorAll('ellipse')[0].getAttribute('cx')) - Number(fSharpMinorSeventhStaff.querySelectorAll('ellipse')[1].getAttribute('cx'))) - 4) < 0.001);
assert.deepEqual([...fSharpMinorSeventhStaff.querySelectorAll('ellipse')].map((notehead) => notehead.getAttribute('cx')), ['29', '25', '25', '25']);
assert.deepEqual([...fSharpMinorSeventhStaff.querySelectorAll('.chord-staff-label')].map((label) => label.textContent), ['C♯', 'A', 'F♯', 'E']);
assert.equal(fSharpMinorSeventhStaff.querySelectorAll('.chord-staff-stem').length, 1);
assert.equal(fSharpMinorSeventhStaff.querySelector('.chord-staff-stem').getAttribute('stroke-width'), '0.4');
assert.deepEqual([...fSharpMinorSeventhStaff.querySelectorAll('.chord-staff-label')].map((label) => label.getAttribute('font-size')), ['3.2', '3.2', '3.2', '3.2']);
assert.equal(fSharpMinorSeventhStaff.querySelector('.chord-staff-stem').getAttribute('y2'), '9.3');
assert.deepEqual([...gSharpMinorSixthStaff.querySelectorAll('.chord-staff-label')].map((label) => label.textContent), ['D♯', 'B', 'G♯', 'E♯']);
assert.equal([...gSharpMinorSixthStaff.querySelectorAll('text')].filter((element) => element.textContent === '♯').length, 3);
assert.equal([...eSharpNinthStaff.querySelectorAll('.chord-staff-label')].some((label) => label.textContent === 'F𝄪'), true);
assert.equal(eSharpNinthStaff.querySelector('.chord-staff-label tspan')?.getAttribute('font-size'), '1.9em');
assert.equal(eSharpNinthStaff.querySelector('.chord-staff-label tspan')?.getAttribute('dy'), '0.12em');
assert.equal([...eSharpNinthStaff.querySelectorAll('text')].find((element) => element.textContent === '𝄪')?.getAttribute('font-size'), '6.2');
assert.equal(eSharpNinthDiagram.querySelector('.neck tspan')?.getAttribute('dy'), '-0.20em');
assert.deepEqual([...stackedAccidentalsStaff.querySelectorAll('.chord-staff-accidental')].map((element) => element.getAttribute('data-lane')), ['0', '1', '2']);
assert.deepEqual([...stackedAccidentalsStaff.querySelectorAll('.chord-staff-accidental')].map((element) => element.getAttribute('x')), ['22.5', '18.3', '14.1']);
assert.deepEqual([...cThirteenthStaff.querySelectorAll('.chord-staff-label')].map((label) => label.getAttribute('font-size')), Array(7).fill('2.6'));
assert.ok(Number(cThirteenthStaff.querySelectorAll('.chord-staff-label')[1].getAttribute('y')) - Number(cThirteenthStaff.querySelectorAll('.chord-staff-label')[0].getAttribute('y')) >= 3);
assert.equal(Number(cMajorStaff.querySelectorAll('.chord-staff-label')[1].getAttribute('y')) - Number(cMajorStaff.querySelectorAll('.chord-staff-label')[0].getAttribute('y')), 4);
assert.equal([...gSharpMinorSixthDiagram.querySelector('.neck').querySelectorAll('text')].some((element) => element.textContent === 'E♯'), true);
assert.equal(svg.textContent?.includes('x'), true);
assert.equal(svg.textContent?.includes('1'), true);
assert.deepEqual([...svg.querySelector('.neck').querySelectorAll('text')].map((element) => element.textContent), ['I', 'x', 'A', 'E', 'A', 'C', 'E']);
assert.equal([...svg.querySelectorAll('text')].find((element) => element.textContent === '1')?.getAttribute('y'), '7');

console.log('ChordDiagramCollection smoke tests passed');
