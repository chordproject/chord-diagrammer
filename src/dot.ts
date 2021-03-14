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
		const circleX = index * this._settings.stringSpace;
		const circleY =
			fret * this._settings.fretSpace -
			this._settings.fretSpace / 2;
		if (fret === -1) {
			var textElement = Helper.createSVGElement(
				'text',
				{
					class: "dot-stringinfo dot-mutedstring",
					textAnchor: 'middle',
					dominantBaseline: 'auto',
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
			let cy = circleY;
			let radius = this._settings.dot.radius;
			let className = "dot-circle"
			if (fret === 0) {
				(cy = hasNut
					? -this._settings.neck.nutWidth -
					  this._settings.dot.stringInfoMargin -
					  this._settings.dot.openStringRadius
					: -this._settings.dot.stringInfoMargin -
					  this._settings.dot.openStringRadius),
					(radius = this._settings.dot.openStringRadius);
				className = "dot-stringinfo dot-openstring"
			}
			var dotElement = Helper.createSVGElement('g');
			var circleElement = Helper.createSVGElement(
				'circle',
				{
					class: className,
					strokeWidth: this._settings.dot.borderWidth,
					cx: circleX,
					cy: cy,
					r: radius,
				},
				true
			);
			dotElement.appendChild(circleElement);

			if (finger > 0) {
				var text2Element = Helper.createSVGElement(
					'text',
					{
						class: "dot-finger",
						textAnchor: 'middle',
						dominantBaseline: 'middle',
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
