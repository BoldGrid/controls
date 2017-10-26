const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const MinifyPlugin = require( 'babel-minify-webpack-plugin' );

const srcDir = path.resolve( __dirname, '..', 'src' );
const distDir = path.resolve( __dirname, '..', 'dist' );

module.exports = {
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
				include: [
					srcDir
				]
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					emitWarning: true
				}
			},
			{
				test: /\.(scss|css)$/,
				use: ExtractTextPlugin.extract( {
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						},
						{
							loader: 'sass-loader',
							options: {
								includePaths: [ 'node_modules' ]
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: ( loader ) => [
									require( 'autoprefixer' )()
								]
							}
						}
					]
				} )
			},
			{
				test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
				loader: 'url-loader',
				query: {
					limit: 10000, // Use data url for assets <= 10KB
					name: './[name].[hash].[ext]'
				}
			}
		]
	},

	plugins: [
		new CopyWebpackPlugin( [
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
		] ),

		new MinifyPlugin(),

		new webpack.NamedModulesPlugin(),

		new HtmlWebpackPlugin( {
			template: path.join( srcDir, 'index.ejs' ),
			path: distDir,
			filename: 'index.html',
			hash: true,
			minify: {
				removeComments: true,
				minifyJS: true,
				minifyCSS: true,
				collapseWhitespace: true
			}
		} ),

		new ExtractTextPlugin( '[name].min.css' )
	]
};
