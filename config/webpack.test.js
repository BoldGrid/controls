const path = require( 'path' );

const src = path.resolve( __dirname, '..', 'src' );

module.exports = {
	// mode: 'development',

	// Karma watches the test entry points
	// (you don't need to specify the entry option)
	// webpack watches dependencies
	// webpack configuration
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ]
				}
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},
			{
				test: /\.(scss|css|html|ejs)$/,
				use: [
					{
						loader: 'raw-loader'
					}
				]
			}
		]
	}

};
