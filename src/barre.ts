import { Helper } from './helper';
import { ChordDiagram } from './models/chordDiagram';

export class Barre {
	fretXPosition = {
		4: [10, 20, 30, 40, 50],
		6: [0, 10, 20, 30, 40, 50],
	};

	fretYPosition = [2.35, 13.9, 26, 38];

	offset = {
		4: 0,
		6: -1,
	};

	positions = {
		string: [50, 40, 30, 20, 10, 0],
		fret: [-4, 6.5, 18, 30, 42, 54],
		finger: [-3, 8, 19.5, 31.5, 43.5],
	};

	build(index: number, chord: ChordDiagram, barre: number): SVGElement {
		const strings = chord.frets.length;
		const barreFrets = this.onlyBarres(chord.frets, barre);

		const string1 = barreFrets[0].position;
		const string2 = barreFrets[barreFrets.length - 1].position;
		const width = (string2 - string1) * 10;
		const y = this.fretYPosition[barre - 1];

		const finger = chord.fingers
			? chord.fingers[chord.frets.indexOf(barre)]
			: null;

		var barreElement = Helper.createSVGElement('g');

		// Capo
		if (index === 0 && chord.capo) {
			var capoGroupElement = Helper.createSVGElement('g');

			var capoGroupLElement = Helper.createSVGElement('g', {
				transform: `translate(${this.getStringPosition(strings, strings)}, ${
					this.positions.fret[barreFrets[0].value]
				})`,
			});

			var pathLElement = Helper.createSVGElement(
				'path',
				{
					d: `M 0, 0
                    m -4, 0
                    a 4,4 0 1,1 8,0`,
					fill: '#555',
					fillOpacity: 0.2,
					transform: 'rotate(-90)',
				},
				true
			);
			capoGroupLElement.appendChild(pathLElement);

			var rectElement = Helper.createSVGElement(
				'rect',
				{
					fill: '#555',
					x: this.fretXPosition[strings][0],
					y: this.fretYPosition[barre - 1],
					width: (strings - 1) * 10,
					fillOpacity: 0.2,
					height: 8.25,
				},
				true
			);

			var capoGroupRElement = Helper.createSVGElement('g', {
				transform: `translate(${this.getStringPosition(1, strings)}, ${
					this.positions.fret[barreFrets[0].value]
				})`,
			});
			var pathRElement = Helper.createSVGElement(
				'path',
				{
					d: `M 0, 0
                    m -4, 0
                    a 4,4 0 1,1 8,0`,
					fill: '#555',
					fillOpacity: 0.2,
					transform: 'rotate(90)',
				},
				true
			);
			capoGroupRElement.appendChild(pathRElement);

			capoGroupElement.appendChild(capoGroupLElement);
			capoGroupElement.appendChild(rectElement);
			capoGroupElement.appendChild(capoGroupRElement);

			barreElement.appendChild(capoGroupElement);
		}

		// Barres
		barreFrets.map((fret) => {
			var circleElement = Helper.createSVGElement(
				'circle',
				{
					key: fret.position,
					strokeWidth: '0.25',
					stroke: '#444',
					fill: '#444',
					cx: this.getStringPosition(strings - fret.position, strings),
					cy: this.positions.fret[fret.value],
					r: 4,
				},
				true
			);
			barreElement.appendChild(circleElement);
		});
		var rect2Element = Helper.createSVGElement(
			'rect',
			{
				fill: '#444',
				x: this.fretXPosition[strings][string1],
				y: y,
				width: width,
				height: 8.25,
			},
			true
		);
		barreElement.appendChild(rect2Element);
		if (finger) {
			barreFrets.map((fret) => {
				var textElement = Helper.createSVGElement(
					'text',
					{
						key: fret.position,
						fontSize: '3pt',
						fontFamily: 'Verdana',
						textAnchor: 'middle',
						fill: 'white',
						x: this.getStringPosition(strings - fret.position, strings),
						y: this.positions.finger[fret.value],
					},
					true
				);
				barreElement.appendChild(
					Helper.appendTextNode(textElement, finger.toString())
				);
			});
		}

		return barreElement;
	}

	private getStringPosition(string: number, strings: number): number {
		return this.positions.string[string + this.offset[strings]];
	}

	private onlyBarres(frets: number[], barre: number) {
		return frets
			.map((f, index) => ({ position: index, value: f }))
			.filter((f) => f.value === barre);
	}
}
