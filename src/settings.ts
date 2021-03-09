export interface DotSettings {
	color: string;
	radius: number;
	border: {
		width: number;
		color: string;
	};
	font: {
		size: string;
		color: string;
	};
	stringInfo: {
		openStringRadius: number;
		mutedStringFontSize: string;
		color: string;
		margin: number;
	};
}

export interface NeckSettings {
	backgroundColor: string;
	line: {
		color: string;
		width: number;
	};
	baseFret: {
		fontColor: string;
		fontSize: string;
		margin: number;
		useRoman: boolean;
	};
	nut: {
		color: string;
		width: number;
	};
	stringName: {
		visible: boolean;
		fontColor: string;
		fontSize: string;
		margin: number;
	};
}

export interface SpacingSettings {
	stringSpace: number;
	fretSpace: number;
}

export class Settings {
	/**
	 * Font family
	 */
	fontFamily: string = 'Verdana';
	/**
	 * Spacing settings
	 */
	spacing: SpacingSettings = {
		/**
		 * Spacing between each string (vertical)
		 */
		stringSpace: 10,
		/**
		 * Spacing between each fret (horizontal)
		 */
		fretSpace: 14,
	};

	/**
	 * Dot settings
	 */
	dot: DotSettings = {
		/**
		 * Fill color
		 */
		color: '#FDD96F',
		/**
		 * Circle radius
		 */
		radius: 4,
		border: {
			/**
			 * Border width
			 */
			width: 0.25,
			/**
			 * Border color
			 */
			color: '#FDD96F',
		},

		font: {
			/**
			 * Finger font size
			 */
			size: '0.25rem',
			/**
			 * Finger font color
			 */
			color: '#000',
		},
		stringInfo: {
			/**
			 * Open string circle radius
			 */
			openStringRadius: 2,
			/**
			 * Muted string font size
			 */
			mutedStringFontSize: '0.4rem',
			/**
			 * String's info color
			 */
			color: '#444',
			/**
			 * String's info margin (neck's top)
			 */
			margin: 2,
		},
	};

	/**
	 * Neck settings
	 */
	neck: NeckSettings = {
		/**
		 * Background color
		 */
		backgroundColor: '#222B45',
		line: {
			/**
			 * Strings color
			 */
			color: '#315264',
			/**
			 * Neck'lines width
			 */
			width: 0.3,
		},
		baseFret: {
			/**
			 * Base fret font color
			 */
			fontColor: '#444',
			/**
			 * Base fret font size
			 */
			fontSize: '0.25rem',
			/**
			 * Base fret margin (neck's left)
			 */
			margin: 1,
			/**
			 * Should use roman notation
			 */
			useRoman: true,
		},
		nut: {
			/**
			 * Nut color
			 */
			color: '#444',
			/**
			 * Nut width
			 */
			width: 2,
		},
		stringName: {
			/**
			 * Should show the string names (neck's bottom)
			 */
			visible: true,
			/**
			 * String name color
			 */
			fontColor: '#444',
			/**
			 * String name font size
			 */
			fontSize: '0.25rem',
			/**
			 * String name margin
			 */
			margin: 2,
		},
	};
}
