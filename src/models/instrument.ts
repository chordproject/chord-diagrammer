export class Instrument {
	strings: number;
	fretsOnChord: number;
	name: string;
	keys?: string[];
	tunings: Tuning;
}

export class Tuning {
	standard: string[];
}
