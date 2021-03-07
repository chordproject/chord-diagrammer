export interface DotSettings {
  color: string;
  radius: number;
  strokeWidth: number;
  strokeColor: string;
  fontSize: string;
  fontColor: string;
  openStringRadius: number;
  mutedStringFontSize: string;
  stringInfoColor: string;
  stringInfoMargin: number;
  fontFamily: string;
}

export interface NeckSettings {
  backgroundColor: string;
  stringColor: string;
  stringWidth: number;
  baseFretFontColor: string;
  baseFretFontSize: string;
  nutColor: string;
  showStringNames: boolean;
  stringNameColor: string;
  stringNameFontSize: string;
  stringNameMargin: number;
  fontFamily: string;
}

export interface SpacingSettings {
  stringSpace: number;
  fretSpace: number;
  nutWidth: number;
}

export class Settings {
  spacing: SpacingSettings = {
    stringSpace: 10,
    fretSpace: 14,
    nutWidth: 2,
  };
  dot: DotSettings = {
    color: "#FDD96F",
    radius: 4,
    strokeWidth: 0,
    strokeColor: "#444",
    fontSize: "0.25rem",
    fontColor: "#000",
    openStringRadius: 2,
    mutedStringFontSize: "0.5rem",
    stringInfoColor: "#444",
    stringInfoMargin: 2,
    fontFamily: "Verdana",
  };
  neck: NeckSettings = {
    backgroundColor: "#222B45",
    stringColor: "#315264",
    stringWidth: 0.3,
    baseFretFontColor: "#444",
    baseFretFontSize: "0.25rem",
    nutColor: "#444",
    showStringNames: true,
    stringNameColor: "#444",
    stringNameFontSize: "0.20rem",
    stringNameMargin: 5,
    fontFamily: "Verdana",
  };
}
