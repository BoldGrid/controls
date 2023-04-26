const path = require( 'path' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ESLintPlugin = require('eslint-webpack-plugin');

const srcDir = path.resolve( __dirname, '..', 'src' );
const distDir = path.resolve( __dirname, '..', 'dist' );
const nodeModulesDir = path.resolve( require.resolve( '@material/switch/mdc-switch.scss' ), '..', '..', '..' );

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
		sourceMapFilename: '[name].map'
	},

	module: {
		rules: [
			{
				test: /\.ejs$/,
				loader: 'ejs-compiled-loader'
			},
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
				  "sass-loader",
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
