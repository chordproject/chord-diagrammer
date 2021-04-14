export interface DotSettings {
    /**
     * Circle radius
     */
    radius: number;
    /**
     * Dot border width
     */
    borderWidth: number;

    /**
     * Open string circle radius
     */
    openStringRadius: number;

    /**
     * String info margin
     */
    stringInfoMargin: number;
}

export interface NeckSettings {
    lineWidth: number;
    baseFretMargin: number;
    /*
     * Should use roman notation
     */
    useRoman: boolean;
    nutWidth: number;
    stringNameVisible: boolean;
    stringNameMargin: number;
}

export class Settings {
    stringSpace: number = 10;
    fretSpace: number = 14;

    /**
     * Dot settings
     */
    dot: DotSettings = {
        /**
         * Circle radius
         */
        radius: 4,
        /**
         * Dot border width
         */
        borderWidth: 0.25,

        /**
         * Open string circle radius
         */
        openStringRadius: 2,

        /**
         * String info margin
         */
        stringInfoMargin: 2,
    };

    /**
     * Neck settings
     */
    neck: NeckSettings = {
        lineWidth: 0.3,
        baseFretMargin: 1,
        /*
         * Should use roman notation
         */
        useRoman: true,
        nutWidth: 2,
        stringNameVisible: true,
        stringNameMargin: 2,
    };
}
