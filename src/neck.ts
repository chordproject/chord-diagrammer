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
	) {
		var neckElement = Helper.createSVGElement('g');

		var pathElement = Helper.createSVGElement('path', {
			stroke: '#444',
			strokeWidth: '0.25',
			strokeLinecap: 'square',
			d: this.getNeckPath(strings, fretsOnChord),
		});
		neckElement.appendChild(pathElement);

		return neckElement;
	}

	private getNeckHorizonalLine(pos: number, strings: number) {
		return `M ${this.offsets[strings].x} ${12 * pos} H ${
			this.offsets[strings].length
		}`;
	}

	private getNeckVerticalLine(pos: number, strings: number) {
		return `M ${this.offsets[strings].y + pos * 10} 0 V 48`;
	}

	private getNeckPath(strings: number, fretsOnChord: number) {
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
	) {
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
