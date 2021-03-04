import { Helper } from './helper';

export class Neck {
	offsets = {
		4: {
			x: 10,
			y: 10,
			length: 40,
		},
		6: {
			x: 0,
			y: 0,
			length: 50,
		},
	};

	build(
		tuning: string[],
		strings: number,
		frets: number[],
		capo: boolean,
		fretsOnChord: number,
		baseFret: number
	): SVGElement {
		var neckElement = Helper.createSVGElement('g');

		// grid
		var pathElement = Helper.createSVGElement(
			'path',
			{
				stroke: '#444',
				strokeWidth: '0.25',
				strokeLinecap: 'square',
				d: this.getNeckPath(strings, fretsOnChord),
			},
			true
		);
		neckElement.appendChild(pathElement);

		// base fret
		let baseFretElement: SVGElement;
		if (baseFret === 1) {
			baseFretElement = Helper.createSVGElement(
				'path',
				{
					stroke: '#444',
					strokeWidth: '2',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					d: `M ${this.offsets[strings].x} 0 H ${this.offsets[strings].length}`,
				},
				true
			);
		} else {
			var textElement = Helper.createSVGElement(
				'text',
				{
					fontSize: '0.25rem',
					fill: '#444',
					fontFamily: 'Verdana',
					x: this.getBarreOffset(strings, frets, baseFret, capo),
					y: '8',
				},
				true
			);
			baseFretElement = Helper.appendTextNode(textElement, baseFret + 'fr');
		}
		neckElement.appendChild(baseFretElement);

		// string tuning names
		var tuningGroupElement = Helper.createSVGElement('g');
		tuning.forEach((note, index) => {
			var textElement = Helper.createSVGElement(
				'text',
				{
					key: index,
					fontSize: '0.3rem',
					fill: '#444',
					fontFamily: 'Verdana',
					textAnchor: 'middle',
					x: this.offsets[strings].x + index * 10,
					y: '53',
				},
				true
			);
			tuningGroupElement.appendChild(Helper.appendTextNode(textElement, note));
		});
		neckElement.appendChild(tuningGroupElement);

		return neckElement;
	}

	private getNeckHorizonalLine(pos: number, strings: number): string {
		return `M ${this.offsets[strings].x} ${12 * pos} H ${
			this.offsets[strings].length
		}`;
	}

	private getNeckVerticalLine(pos: number, strings: number): string {
		return `M ${this.offsets[strings].y + pos * 10} 0 V 48`;
	}

	private getNeckPath(strings: number, fretsOnChord: number): string {
		return Array.apply(null, Array(fretsOnChord + 1))
			.map((_: any, pos: number) => this.getNeckHorizonalLine(pos, strings))
			.join(' ')
			.concat(
				Array.apply(null, Array(strings))
					.map((_: any, pos: number) => this.getNeckVerticalLine(pos, strings))
					.join(' ')
			);
	}

	private getBarreOffset(
		strings: number,
		frets: number[],
		baseFret: number,
		capo: boolean
	): number {
		return strings === 6
			? frets[0] === 1 || capo
				? baseFret > 9
					? -12
					: -11
				: baseFret > 9
				? -10
				: -7
			: frets[0] === 1 || capo
			? baseFret > 9
				? -1
				: 0
			: baseFret > 9
			? 3
			: 4;
	}
}
