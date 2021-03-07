import { Helper } from "./helper";
import { NeckSettings, SpacingSettings } from "./settings";

export class Neck {
  private _settings: NeckSettings;
  private _spacingSettings: SpacingSettings;

  constructor(settings: NeckSettings, spacingSettings: SpacingSettings) {
    this._settings = settings;
    this._spacingSettings = spacingSettings;
  }

  build(
    tuning: string[],
    stringsCount: number,
    frets: number[],
    fretsOnChord: number,
    baseFret: number
  ): SVGElement {
    var neckElement = Helper.createSVGElement("g");

    // grid
    var backgroundElement = Helper.createSVGElement(
      "rect",
      {
        fill: this._settings.backgroundColor,
        x: 0,
        y: 0,
        width: this._spacingSettings.stringSpace * (stringsCount - 1),
        height: this._spacingSettings.fretSpace * 4
      },
    )
    neckElement.appendChild(backgroundElement);

    var pathElement = Helper.createSVGElement(
      "path",
      {
        stroke: this._settings.stringColor,
        strokeWidth: this._settings.stringWidth,
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
          stroke: this._settings.nutColor,
          strokeWidth: this._spacingSettings.nutWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: `M 0 ${-this._spacingSettings.nutWidth/2} H ${5 * this._spacingSettings.stringSpace}`,
        },
        true
      );
    } else {
      // base-fret text
      var textElement = Helper.createSVGElement(
        "text",
        {
          fontSize: this._settings.baseFretFontSize,
          fill: this._settings.baseFretFontColor,
          fontFamily: this._settings.fontFamily,
          x: this.getBarreOffset(stringsCount, frets, baseFret),
          y: this._spacingSettings.fretSpace / 2,
        },
        true
      );
      baseFretElement = Helper.appendTextNode(textElement, baseFret + "fr");
    }
    neckElement.appendChild(baseFretElement);

    // string tuning names
    if (this._settings.showStringNames) {
      var tuningGroupElement = Helper.createSVGElement("g");
      tuning.forEach((note, index) => {
        var textElement = Helper.createSVGElement(
          "text",
          {
            key: index,
            fontSize: this._settings.stringNameFontSize,
            fill: this._settings.stringNameColor,
            fontFamily: this._settings.fontFamily,
            textAnchor: "middle",
            x: index * this._spacingSettings.stringSpace,
            y:
              4 * this._spacingSettings.fretSpace +
              this._settings.stringNameMargin,
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

  private getNeckHorizonalLine(pos: number, strings: number): string {
    return `M 0 ${pos * this._spacingSettings.fretSpace} H ${
      5 * this._spacingSettings.stringSpace
    }`;
  }

  private getNeckVerticalLine(pos: number, strings: number): string {
    return `M ${pos * this._spacingSettings.stringSpace} 0 V ${
      4 * this._spacingSettings.fretSpace
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

  private getBarreOffset(
    strings: number,
    frets: number[],
    baseFret: number
  ): number {
    return strings === 6
      ? frets[0] === 1
        ? baseFret > 9
          ? -12
          : -11
        : baseFret > 9
        ? -10
        : -7
      : frets[0] === 1
      ? baseFret > 9
        ? -1
        : 0
      : baseFret > 9
      ? 3
      : 4;
  }
}
