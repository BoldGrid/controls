const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ESLintPlugin = require('eslint-webpack-plugin');

const srcDir = path.resolve( __dirname, '..', 'src' );
const distDir = path.resolve( __dirname, '..', 'dist' );

const handler = (bpercentage, message, ...args ) => {
	// e.g. Output each progress message directly to the console:
	console.info( percentage, message, ...args );
  };

new webpack.ProgressPlugin( handler );

new webpack.debug.ProfilingPlugin({
	outputPath: path.join( __dirname, 'profiling/profileEvents.json' ),
}),

module.exports = {
	mode: 'production',

	context: srcDir,

	devtool: false,

	entry: {
		application: './index.js',
		bundle: './controls/index.js'
	},

	output: {
		filename: '[name].min.js',
		path: distDir,
		publicPath: '/',
		sourceMapFilename: '[name].map',
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true
						}
					}
				]
			},
			{
				test: /\.js$/,
				use: [ 'babel-loader' ],
				include: [ srcDir ]
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},
			{
				test: /\.(sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					{
						loader: "sass-loader",
						options: {
							implementation: require.resolve("sass")
						},
					},
				],
			  },
			{
				test: /\.(jpg|jpeg|png|gif|ico)$/,
				loader: 'url-loader',
				options: {
					limit: 10000, // Use data url for assets <= 10KB
					name: './[name].[hash].[ext]'
				}
			}
		]
	},

	plugins: [
		new ProgressPlugin(true),

		new CopyWebpackPlugin({
			patterns: [
				{
					from: './../static',
					to: ''
				},
				{
					from: require.resolve( 'Iris/dist/iris.min.js' ),
					to: './static'
				},
				{
					from: require.resolve( 'sass.js/dist/sass.worker.js' ),
					to: './static'
				},
				{
					from: path.resolve( require.resolve( 'Buttons/scss/buttons.scss' ), '..' ),
					to: './scss/color-palette-scss/buttons'
				},
				{
					from: srcDir + '/controls/color/scss/utilities/color-classes.sass',
					to: './scss/color-palette-scss/classes/color-classes.scss'
				}
			]
		}),

		new MiniCssExtractPlugin( {
			filename: '[name].min.css',
		} ),

		new ESLintPlugin({
			extensions: ['js'],
			exclude: 'node_modules',
			emitWarning: false,
			emitError: false,
			failOnError: false,
		})
	]
};
