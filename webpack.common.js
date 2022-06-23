const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        app: ["./src/index.ts", './src/style.css'],
    },
    plugins: [new CleanWebpackPlugin()],
    output: {
        filename: "chordproject-diagrammer.bundle.js",
        path: path.resolve(__dirname, "dist"),
        library: "ChordProjectDiagrammer",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
};
