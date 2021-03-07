import { Helper } from "./helper";
import { DotSettings, SpacingSettings } from "./settings";

export class Barre {
  private _settings: DotSettings;
  private _spacingSettings: SpacingSettings;

  constructor(settings:DotSettings, spacingSettings:SpacingSettings) {
    this._settings = settings;
    this._spacingSettings = spacingSettings;
  }

  build(
    index: number,
    stringStart: number,
    stringEnd: number
  ): SVGElement {
    const width = (stringEnd - stringStart) * 10;

    var barreElement = Helper.createSVGElement("g");
    const rectX = index * this._spacingSettings.stringSpace;
    const rectY = stringStart * this._spacingSettings.fretSpace - (this._spacingSettings.fretSpace/2) - this._settings.radius;
    // barre rectangle
    var rectangleElement = Helper.createSVGElement(
      "rect",
      {
        strokeWidth: this._settings.strokeWidth,
        stroke: this._settings.strokeColor,
        fill: this._settings.color,
        x: rectX,
        y: rectY,
        width: width,
        height: 2*this._settings.radius
      },
      true
    );
    barreElement.appendChild(rectangleElement);

    return barreElement;
  }
}
