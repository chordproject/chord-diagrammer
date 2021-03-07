import { Helper } from "./helper";
import { DotSettings, SpacingSettings } from "./settings";

export class Dot {
  private _settings: DotSettings;
  private _spacingSettings: SpacingSettings;

	constructor(settings:DotSettings, spacingSettings:SpacingSettings) {
		this._settings = settings;
    this._spacingSettings = spacingSettings;
	}

  build(
    index: number,
    fret: number,
    finger: number,
    hasNut:boolean,
  ): SVGElement {
    const circleX = index * this._spacingSettings.stringSpace;
    const circleY = fret * this._spacingSettings.fretSpace - (this._spacingSettings.fretSpace/2);
    if (fret === -1) {
      var textElement = Helper.createSVGElement(
        "text",
        {
          fontSize: this._settings.mutedStringFontSize,
          fill: this._settings.stringInfoColor,
          fontFamily: this._settings.fontFamily,
          textAnchor: "middle",
          x: circleX,
          y: hasNut? -this._spacingSettings.nutWidth -this._settings.stringInfoMargin: -this._settings.stringInfoMargin,
        },
        true
      );

      return Helper.appendTextNode(textElement, "x");
    } else {
      var dotElement = Helper.createSVGElement("g");
      var circleElement = Helper.createSVGElement(
        "circle",
        {
          strokeWidth: this._settings.strokeWidth,
          stroke: this._settings.strokeColor,
          fill: fret === 0 ? "transparent" : this._settings.color,
          cx: circleX,
          cy: fret === 0 ? -this._settings.openStringRadius -this._settings.stringInfoMargin : circleY,
          r: fret === 0 ? this._settings.openStringRadius : this._settings.radius,
        },
        true
      );
      dotElement.appendChild(circleElement);

      if (finger > 0) {
        var text2Element = Helper.createSVGElement(
          "text",
          {
            fontSize: this._settings.fontSize,
            fontFamily: this._settings.fontFamily,
            textAnchor: "middle",
            "dominant-baseline":"middle",
            fill: this._settings.fontColor,
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
