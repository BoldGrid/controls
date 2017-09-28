const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const src = path.resolve( __dirname, '..', 'src' );

module.exports = {
	context: src,

	entry: [ './index.js' ],

	output: {
		filename: 'bundle.js',
		path: path.resolve( __dirname, '..', 'dist' ),
		publicPath: '/'
	},

	devServer: {
		contentBase: src,
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
				test: /\.(scss|css)$/,
				exclude: [
					src + '/controls/color/scss/utilities/color-classes.scss',
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
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
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
				from: require.resolve( 'Buttons/scss/buttons.scss' ) + '/../',
				to: './sass/button-scss'
			}
		] ),

		new webpack.HotModuleReplacementPlugin(),

		new webpack.NamedModulesPlugin(),

		new HtmlWebpackPlugin( {
			template: path.join( src, 'index.ejs' ),
			path: path.resolve( __dirname, '..', 'dist' ),
			filename: 'index.html'
		} )
	]
};
