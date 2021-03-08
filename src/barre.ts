import { Helper } from "./helper";
import { Settings } from "./settings";

export class Barre {
  private _settings: Settings;

  constructor(settings:Settings) {
    this._settings = settings;
  }

  build(
    index: number,
    stringStart: number,
    stringEnd: number
  ): SVGElement {
    const width = (stringEnd - stringStart) * 10;

    var barreElement = Helper.createSVGElement("g");
    const rectX = stringStart * this._settings.spacing.stringSpace;
    const rectY =  index * this._settings.spacing.fretSpace - (this._settings.spacing.fretSpace/2) - this._settings.dot.radius;
    // barre rectangle
    var rectangleElement = Helper.createSVGElement(
      "rect",
      {
        strokeWidth: this._settings.dot.border.width,
        stroke: this._settings.dot.border.color,
        fill: this._settings.dot.color,
        x: rectX,
        y: rectY,
        width: width,
        height: 2*this._settings.dot.radius
      },
      true
    );
    barreElement.appendChild(rectangleElement);

    return barreElement;
  }
}
