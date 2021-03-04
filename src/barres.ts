import { Helper } from './helper';
import { ChordDiagram } from './models/chordDiagram';

export class Barre {
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

		var barreElement = Helper.createSVGElement('g');

		// Capo
		if (index === 0 && chord.capo) {
			var capoGroupElement = Helper.createSVGElement('g');

			var capoSubGroup1Element = Helper.createSVGElement('g', {
				transform: `translate(${this.getStringPosition(strings, strings)}, ${
					this.positions.fret[barreFrets[0].value]
				})`,
			});

			var pathElement = Helper.createSVGElement(
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
			capoSubGroup1Element.appendChild(pathElement);

			capoGroupElement.appendChild(capoSubGroup1Element);

			barreElement.appendChild(capoGroupElement);
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
