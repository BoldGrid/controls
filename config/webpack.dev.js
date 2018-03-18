const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );

const srcDir = path.resolve( __dirname, '..', 'src' );

module.exports = {
	mode: 'development',

	context: srcDir,

	entry: [ './index.js' ],

	output: {
		filename: 'bundle.js',
		path: path.resolve( __dirname, '..', 'dist' ),
		publicPath: '/'
	},

	devServer: {
		contentBase: srcDir,
		publicPath: '/',
		historyApiFallback: true,
		port: 3000,
		overlay: {
			errors: true,
			warnings: true
		}
	},

	module: {
		rules: [
			{
				test: /\.ejs$/,
				loader: 'ejs-loader'
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
				exclude: /node_modules/,
				use: [ 'babel-loader' ]
			},
			{
				test: /\.js$/,
				enforce: 'pre',

				loader: 'eslint-loader',
				options: {
					emitWarning: true
				}
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},
			{
				test: /\.(scss|css)$/,
				exclude: [
					srcDir + '/controls/color/scss/utilities/color-classes.scss',
					require.resolve( 'Buttons/scss/buttons.scss' )
				],
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							includePaths: [ 'node_modules' ]
						}
					}
				]
			},
			{
				test: /\.(jpg|jpeg|png|gif|ico)$/,
				loader: 'url-loader',
				query: {
					limit: 10000, // Use data url for assets <= 10KB
					name: 'static/images/[name].[hash].[ext]'
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

		new webpack.HotModuleReplacementPlugin(),

		new webpack.NamedModulesPlugin(),

	//	new StyleLintPlugin( {
	//		files: [ '**/*.s?(c)ss' ]
	//	} ),

		new HtmlWebpackPlugin( {
			template: path.join( srcDir, 'index.ejs' ),
			path: path.resolve( __dirname, '..', 'dist' ),
			filename: 'index.html'
		} )
	]
};
