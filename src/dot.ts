import { Helper } from './helper';
import { Settings } from './settings';

export class Dot {
	private _settings: Settings;

	constructor(settings: Settings) {
		this._settings = settings;
	}

	build(
		index: number,
		fret: number,
		finger: number,
		hasNut: boolean
	): SVGElement {
		const circleX = index * this._settings.spacing.stringSpace;
		const circleY =
			fret * this._settings.spacing.fretSpace -
			this._settings.spacing.fretSpace / 2;
		if (fret === -1) {
			var textElement = Helper.createSVGElement(
				'text',
				{
					fontSize: this._settings.dot.mutedStringFontSize,
					fill: this._settings.dot.stringInfoColor,
					fontFamily: this._settings.dot.fontFamily,
					textAnchor: 'middle',
					x: circleX,
					y: hasNut
						? -this._settings.neck.nutWidth -
						  this._settings.dot.stringInfoMargin
						: -this._settings.dot.stringInfoMargin,
				},
				true
			);

			return Helper.appendTextNode(textElement, 'x');
		} else {
			var dotElement = Helper.createSVGElement('g');
			var circleElement = Helper.createSVGElement(
				'circle',
				{
					strokeWidth: this._settings.dot.strokeWidth,
					stroke: this._settings.dot.strokeColor,
					fill: fret === 0 ? 'transparent' : this._settings.dot.color,
					cx: circleX,
					cy:
						fret === 0
							? -this._settings.dot.openStringRadius -
							  this._settings.dot.stringInfoMargin
							: circleY,
					r:
						fret === 0
							? this._settings.dot.openStringRadius
							: this._settings.dot.radius,
				},
				true
			);
			dotElement.appendChild(circleElement);

			if (finger > 0) {
				var text2Element = Helper.createSVGElement(
					'text',
					{
						fontSize: this._settings.dot.fontSize,
						fontFamily: this._settings.dot.fontFamily,
						textAnchor: 'middle',
						dominantBaseline: 'middle',
						fill: this._settings.dot.fontColor,
						x: circleX,
						y: circleY + 0.2,
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
}
