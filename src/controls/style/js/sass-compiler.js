var $ = window.jQuery,
	BOLDGRID = BOLDGRID || {};

BOLDGRID.Sass = BOLDGRID.Sass || {};

import Sassjs from 'sass.js/dist/sass.js';

export class SassCompiler {
	constructor( options ) {

		// Singleton.
		if ( BOLDGRID.Sass && BOLDGRID.Sass.instance ) {
			return BOLDGRID.Sass.instance;
		}

		this.init( options );
	}

	init( options ) {
		this.instance = this;

		this.options = _.defaults( options || {}, {
			enableLogging: false,
			basePath: '../scss/',
			workerURL: './static/sass.worker.js'
		} );

		this.processing = false;
		this.compileCount = 0;
		this.log = {};

		this.$window = $( window );
		this.compileDone = $.Event( 'boldgrid_sass_compile_done' );
		Sassjs.setWorkerUrl( this.options.workerURL );
		this.compiler = new Sassjs( this.options.workerURL );

		this.compiler.options( {
			comments: false,
			indent: '',
			linefeed: '',
			style: Sassjs.style.compressed
		} );

		BOLDGRID.Sass = this;
	}

	/**
	 * Setup a compile function.
	 */
	compile( scss, options ) {
		let $deferred = $.Deferred();

		options = options || {};

		this.processing = true;

		this.compileCount++;

		// This.resetCompiler();

		if ( this.options.enableLogging ) {
			this.log.startTime = new Date().getTime();
		}

		this.compiler.compile( scss, result => {
			let data = {
				result: result,
				scss: scss,
				source: options.source,
				options: options
			};

			this.processing = false;

			if ( 0 !== result.status ) {
				console.error( result.formatted );
			}

			if ( 'setup' !== data.source ) {
				this.$window.trigger( this.compileDone, data );
			}

			this.outputLogs( result, scss );

			$deferred.resolve( data );
		} );

		return $deferred;
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
			Sassjs.setWorkerUrl( this.options.workerURL );
			if ( this.compiler ) {
				this.compiler.destroy();
				this.compiler = null;
			}

			this.compiler = new Sassjs( this.options.workerURL );
		}
	}

	/**
	 * Load files into sass compiler.
	 *
	 * @since 1.0.0
	 */
	preload( files ) {
		let $deferred = $.Deferred();

		// Preload a set of files.
		this.compiler.preloadFiles( this.options.basePath, '', files, data => {
			$deferred.resolve( data );
		} );

		return $deferred;
	}
}
