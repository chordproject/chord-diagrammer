import { Helper } from './helper';
import { ChordDiagram } from './models/chordDiagram';
import { Instrument } from './models/instrument';
import { Neck } from './neck';
import { Barre } from './barre';
import { Dot } from './dot';
import { Settings } from './settings';

export class SvgBuilder {
	private _settings: Settings = new Settings();

	set settings(value: Settings) {
		this._settings = value;
	}

	build(chord: ChordDiagram, instrument: Instrument): SVGElement {
		var tuning = instrument.tuning;
		var stringsCount = instrument.stringsCount;
		var fretsOnChord = instrument.fretsOnDiagram;
		var baseFret = chord.baseFret > 0 ? chord.baseFret : 1;

		const baseBoxWidth =
			(stringsCount - 1) * this._settings.spacing.stringSpace +
			2 * (this._settings.dot.radius + this._settings.dot.border.width);
		const baseFretTextWidth =
			baseFret <= 1 ? 0 : 9 + this._settings.neck.baseFret.margin;
		const viewBoxWidth = baseBoxWidth + baseFretTextWidth;

		const baseBoxHeight = fretsOnChord * this._settings.spacing.fretSpace;
		const stringNamesHeight = !this._settings.neck.stringName.visible
			? 0
			: 10 + this._settings.neck.stringName.margin;
		const nutHeight = baseFret > 1 ? 0 : this._settings.neck.nut.width;
		const stringInfoHeight =
			4 +
			this._settings.dot.stringInfo.openStringRadius +
			this._settings.dot.stringInfo.margin +
			this._settings.dot.border.width;
		const viewBoxHeight =
			baseBoxHeight + stringNamesHeight + nutHeight + stringInfoHeight;

		var svg = Helper.createSVGElement('svg', {
			width: '100%',
			preserveAspectRatio: 'xMinYMin meet',
			viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
		});

		const translateX = baseFretTextWidth + this._settings.dot.radius;
		const translateY = nutHeight + stringInfoHeight;
		var rootElement = Helper.createSVGElement('g', {
			transform: `translate(${translateX}, ${translateY})`,
		});

		// Neck
		const neck = new Neck(this._settings);
		rootElement.appendChild(
			neck.build(tuning, stringsCount, fretsOnChord, baseFret)
		);

		// Barres
		if (chord.barres.length > 0) {
			const barresData = chord.barres;
			barresData.forEach((barreData) => {
				const barre = new Barre(this._settings);
				rootElement.appendChild(
					barre.build(
						barreData.fret,
						barreData.startString,
						barreData.endString
					)
				);
			});
		}

		// Dots
		this.onlyDots(chord).forEach((dotData) => {
			const dot = new Dot(this._settings);
			const finger = chord.fingers ? chord.fingers[dotData.fret] : 0;
			rootElement.appendChild(
				dot.build(dotData.fret, dotData.value, finger, chord.baseFret === 1)
			);
		});

		svg.appendChild(rootElement);

		return svg;
	}

	private onlyDots(chord: ChordDiagram) {
		let dots = chord.frets.map((f, index) => ({ fret: index, value: f }));
		return dots;
	}
}
