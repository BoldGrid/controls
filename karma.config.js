// Karma configuration
const path = require( 'path' );
const src = path.resolve( __dirname, '..', 'src' );

module.exports = function( config ) {
	config.set( {
		frameworks: [ 'jasmine', 'es6-shim' ],
		reporters: [ 'spec', 'coverage' ],
		browsers: [ 'PhantomJS' ],
		colors: true,

		// ... normal karma configuration
		files: [
			'node_modules/babel-polyfill/dist/polyfill.js',
			require.resolve( 'jquery' ),
			'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
			'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
			'node_modules/Iris/dist/iris.min.js',

			// All files ending in "_test"
			// { pattern: 'test/*_test.js', watched: false }

			{ pattern: 'test/**/*_test.js', watched: false }

			// Each file acts as entry point for the webpack configuration
		],

		preprocessors: {

			// Add webpack as preprocessor
			'test/*_test.js': [ 'webpack', 'coverage' ],
			'test/**/*_test.js': [ 'webpack', 'coverage' ]
		},

		// optionally, configure the reporter
		coverageReporter: {
			type: 'html',
			dir: 'coverage/',
			reporters: [

				// reporters not supporting the `file` property
				{ type: 'html', subdir: 'report-html' },
				{ type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
				{ type: 'lcov', subdir: 'report-lcov' }
			]
		},

		webpack: require( './config/webpack.test.js' ),

		webpackMiddleware: {

			// Webpack-dev-middleware configuration
			// i. e.
			stats: 'errors-only'
		}
	} );
};
