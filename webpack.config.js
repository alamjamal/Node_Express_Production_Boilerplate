const path = require("path");
const nodeExternals = require("webpack-node-externals"); // Import webpack-node-externals
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = {
	mode: "production",
	entry: "./server.js",
	output: {
		path: path.join(__dirname, "build"),
		publicPath: "/",
		filename: "www/server.js",
		clean: true,
	},
	target: "node",
	node: false, // Disable built-in Node.js polyfills
	externals: [
		nodeExternals(), // Exclude external modules
	],
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			terserOptions: {
				compress: {
					// drop_console: true,
					drop_debugger: true,
				},
			},
			exclude: /\/utils/,
		})],
	},

	module: {
		rules: [
			// {
			// 	test: /\.node$/,
			// 	loader: "node-loader",
			// },
			{
				test: /\.js$/,
				loader: "babel-loader",
			},
			// Add Babel loaders and presets if needed
		],
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{
				from: "utils", // Source directory (contains env and key files)
				to: "www/utils", // Target directory inside the build output
			},
			{
				from: "package.json", // Source file (package.json)
				to: "package.json", // Target file inside the build output
			},
			{
				from: "package-lock.json", // Source file (package-lock.json)
				to: "package-lock.json", // Target file inside the build output
			},

			],
		}),
	]
};
