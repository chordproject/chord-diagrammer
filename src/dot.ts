import { Helper } from './helper';

export class Dot {
	positions = {
		string: [50, 40, 30, 20, 10, 0],
		fret: [-4, 6.5, 18, 30, 42, 54],
		finger: [-3, 8, 19.5, 31.5, 43.5],
	};

	offset = {
		4: 0,
		6: -1,
	};

	radius = {
		open: 2,
		fret: 4,
	};

	build(
		key: number,
		fret: number,
		strings: number,
		finger: number
	): SVGElement {
		const stringNumber = strings - key;

		if (fret === -1) {
			var textElement = Helper.createSVGElement(
				'text',
				{
					fontSize: '0.7rem',
					fill: '#444',
					fontFamily: 'Verdana',
					textAnchor: 'middle',
					x: this.getStringPosition(stringNumber, strings),
					y: '-2',
				},
				true
			);

			return Helper.appendTextNode(textElement, 'x');
		} else {
			var dotElement = Helper.createSVGElement('g');
			var circleElement = Helper.createSVGElement(
				'circle',
				{
					strokeWidth: '0.25',
					stroke: '#444',
					fill: fret === 0 ? 'transparent' : '#444',
					cx: this.getStringPosition(stringNumber, strings),
					cy: this.positions.fret[fret],
					r: fret === 0 ? this.radius['open'] : this.radius['fret'],
				},
				true
			);
			dotElement.appendChild(circleElement);

			if (finger > 0) {
				var text2Element = Helper.createSVGElement(
					'text',
					{
						fontSize: '3pt',
						fontFamily: 'Verdana',
						textAnchor: 'middle',
						fill: 'white',
						x: this.getStringPosition(stringNumber, strings),
						y: this.positions.finger[fret],
					},
					true
				);
				dotElement.appendChild(
					Helper.appendTextNode(text2Element, finger.toString())
				);
			}

			return dotElement;
		}
	}

	private getStringPosition(string: number, strings: number): number {
		return this.positions.string[string + this.offset[strings]];
	}
}
