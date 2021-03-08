export interface Instrument {
	strings: number;
	fretsOnChord: number;
	name: string;
	keys?: string[];
	tunings: Tuning;
}

export interface Tuning {
	standard: string[];
}
