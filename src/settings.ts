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
	baseFretMargin: number;
	nutColor: string;
	nutWidth: number;
	showStringNames: boolean;
	stringNameColor: string;
	stringNameFontSize: string;
	stringNameMargin: number;
	fontFamily: string;
	useRomanBaseFret: boolean;
}

export interface SpacingSettings {
	stringSpace: number;
	fretSpace: number;
}

export class Settings {
	spacing: SpacingSettings = {
		stringSpace: 10,
		fretSpace: 14,
	};

	dot: DotSettings = {
		color: '#FDD96F',
		radius: 4,
		strokeWidth: 0,
		strokeColor: '#444',
		fontSize: '0.25rem',
		fontColor: '#000',
		openStringRadius: 2,
		mutedStringFontSize: '0.4rem',
		stringInfoColor: '#444',
		stringInfoMargin: 2,
		fontFamily: 'Verdana',
	};

	neck: NeckSettings = {
		backgroundColor: '#222B45',
		stringColor: '#315264',
		stringWidth: 0.3,
		baseFretFontColor: '#444',
		baseFretFontSize: '0.25rem',
		baseFretMargin: 1,
		nutColor: '#444',
		nutWidth: 2,
		showStringNames: true,
		stringNameColor: '#444',
		stringNameFontSize: '0.25rem',
		stringNameMargin: 2,
		fontFamily: 'Verdana',
		useRomanBaseFret: true,
	};
}
