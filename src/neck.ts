import { Helper } from "./helper";
import { Settings } from "./settings";

export class Neck {
  private _settings: Settings;

  constructor(settings: Settings) {
    this._settings = settings;
  }

  build(
    tuning: string[],
    stringsCount: number,
    fretsOnChord: number,
    baseFret: number
  ): SVGElement {
    var neckElement = Helper.createSVGElement("g");

    // grid
    var backgroundElement = Helper.createSVGElement(
      "rect",
      {
        fill: this._settings.neck.backgroundColor,
        x: 0,
        y: 0,
        width: this._settings.spacing.stringSpace * (stringsCount - 1),
        height: this._settings.spacing.fretSpace * 4
      },
    )
    neckElement.appendChild(backgroundElement);

    var pathElement = Helper.createSVGElement(
      "path",
      {
        stroke: this._settings.neck.stringColor,
        strokeWidth: this._settings.neck.stringWidth,
        strokeLinecap: "square",
        d: this.getNeckPath(stringsCount, fretsOnChord),
      },
      true
    );
    neckElement.appendChild(pathElement);

    // base fret
    let baseFretElement: SVGElement;
    if (baseFret === 1) {
      // nut rectangle
      baseFretElement = Helper.createSVGElement(
        "path",
        {
          stroke: this._settings.neck.nutColor,
          strokeWidth: this._settings.neck.nutWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: `M 0 ${-this._settings.neck.nutWidth/2} H ${5 * this._settings.spacing.stringSpace}`,
        },
        true
      );
    } else {
      // base-fret text
      var textElement = Helper.createSVGElement(
        "text",
        {
          dominantBaseline: "middle",
          textAnchor: "end",
          fontSize: this._settings.neck.baseFretFontSize,
          fill: this._settings.neck.baseFretFontColor,
          fontFamily: this._settings.neck.fontFamily,
          x: - (this._settings.neck.baseFretMargin + this._settings.dot.radius),
          y: this._settings.spacing.fretSpace / 2 + 0.2,
        },
        true
      );
      const text = this.getBaseFretText(baseFret);
      baseFretElement = Helper.appendTextNode(textElement, text);
    }
    neckElement.appendChild(baseFretElement);

    // string tuning names
    if (this._settings.neck.showStringNames) {
      var tuningGroupElement = Helper.createSVGElement("g");
      tuning.forEach((note, index) => {
        var textElement = Helper.createSVGElement(
          "text",
          {
            key: index,
            fontSize: this._settings.neck.stringNameFontSize,
            fill: this._settings.neck.stringNameColor,
            fontFamily: this._settings.neck.fontFamily,
            textAnchor: "middle",
            dominantBaseline: "hanging",
            x: index * this._settings.spacing.stringSpace,
            y:
              4 * this._settings.spacing.fretSpace +
              this._settings.neck.stringNameMargin,
          },
          true
        );
        tuningGroupElement.appendChild(
          Helper.appendTextNode(textElement, note)
        );
      });
      neckElement.appendChild(tuningGroupElement);
    }

    return neckElement;
  }

  private getBaseFretText(baseFret:number): string{
    if(this._settings.neck.useRomanBaseFret){
      const romanNumbers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
      return romanNumbers[baseFret - 1];
    }
      return baseFret + "fr";
  }

  private getNeckHorizonalLine(pos: number, strings: number): string {
    return `M 0 ${pos * this._settings.spacing.fretSpace} H ${
      5 * this._settings.spacing.stringSpace
    }`;
  }

  private getNeckVerticalLine(pos: number, strings: number): string {
    return `M ${pos * this._settings.spacing.stringSpace} 0 V ${
      4 * this._settings.spacing.fretSpace
    }`;
  }

  private getNeckPath(strings: number, fretsOnChord: number): string {
    return Array.apply(null, Array(fretsOnChord + 1))
      .map((_: any, pos: number) => this.getNeckHorizonalLine(pos, strings))
      .join(" ")
      .concat(
        Array.apply(null, Array(strings))
          .map((_: any, pos: number) => this.getNeckVerticalLine(pos, strings))
          .join(" ")
      );
  }
}
