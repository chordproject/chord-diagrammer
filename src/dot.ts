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
        "text",
        {
          fontSize: this._settings.dot.stringInfo.mutedStringFontSize,
          fill: this._settings.dot.stringInfo.color,
          fontFamily: this._settings.fontFamily,
          textAnchor: "middle",
          dominantBaseline: "auto",
          x: circleX,
          y: hasNut
            ? -this._settings.neck.nut.width - this._settings.dot.stringInfo.margin
            : -this._settings.dot.stringInfo.margin,
        },
        true
      );

      return Helper.appendTextNode(textElement, "x");
    } else {
      let cy = circleY;
      let radius = this._settings.dot.radius;
      let color = this._settings.dot.color;
      let borderColor = this._settings.dot.border.color;
      if(fret === 0){
        cy = hasNut
        ? -this._settings.neck.nut.width - this._settings.dot.stringInfo.margin - this._settings.dot.stringInfo.openStringRadius
        : -this._settings.dot.stringInfo.margin - this._settings.dot.stringInfo.openStringRadius,
        radius = this._settings.dot.stringInfo.openStringRadius;
        color = "transparent";
        borderColor = this._settings.dot.stringInfo.color;
      }
      var dotElement = Helper.createSVGElement("g");
      var circleElement = Helper.createSVGElement(
        "circle",
        {
          strokeWidth: this._settings.dot.border.width,
          stroke: borderColor,
          fill: color,
          cx: circleX,
          cy: cy,
          r: radius
        },
        true
      );
      dotElement.appendChild(circleElement);

      if (finger > 0) {
        var text2Element = Helper.createSVGElement(
          "text",
          {
            fontSize: this._settings.dot.font.size,
            fontFamily: this._settings.fontFamily,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fill: this._settings.dot.font.color,
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
