var BOLDGRID = BOLDGRID || {};
BOLDGRID.Sass = BOLDGRID.Sass || {};

export class SassCompiler {

	constructor( options ) {

		// Singleton.
		if ( this.instance ) {
			return this.instance;
		}

		this.init( options );
	}

	init( options ) {
		this.instance = this;

		this.options = _.defaults( {
			'enableLogging': false,
			'workerURL': BOLDGRIDSass.WorkerUrl
		}, options );

		this.sassLibrary = require( 'sass.js/dist/sass.js' );
		this.processing = false;
		this.compileCount = 0;
		this.log = {};

		this.$window = $( window );
		this.compileDone = $.Event( 'boldgrid_sass_compile_done' );
		this.sassLibrary.setWorkerUrl( this.options.workerURL );
		this.compiler = new this.sassLibrary( this.options.workerURL );
		BOLDGRID.Sass = this;
	}

	/**
	 * Setup a compile function.
	 */
	compile( scss, options ) {
		options = options || {};

		this.processing = true;

		this.compileCount++;

		this.resetCompiler();

		if ( this.options.enableLogging ) {
			this.log.startTime = new Date().getTime();
		}

		this.compiler.compile( scss, ( result ) => {
			let data = {
				result: result,
				scss: scss,
				source: options.source
			};

			this.processing = false;

			if ( 0 !== result.status ) {
				console.error( result.formatted );
			}

			this.$window.trigger( this.compileDone, data );

			this.outputLogs( result, scss );
		} );
	}

	outputLogs( result, scss ) {
		if ( this.options.enableLogging ) {
			let difference;

			this.log.endTime = new Date().getTime();
			difference = this.log.endTime - this.log.startTime;

			console.log( difference, ' milliseconds' );
			console.log( result );
			console.log( scss );
		}
	}

	/*
	 * After about 50 compiles error thrown on compiles.
	 *
	 * @since 1.0.0
	 */
	resetCompiler() {
		if ( 50 < this.compileCount ) {
			this.compileCount = 0;
			this.sassLibrary.setWorkerUrl( this.options.workerURL );
			if ( this.compiler ) {
				this.compiler.destroy();
				this.compiler = null;
			}

			this.compiler = new this.sassLibrary( this.options.workerURL );
		}
	}
}
