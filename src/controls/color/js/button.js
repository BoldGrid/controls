var $ = window.jQuery;

import { SassCompiler } from '../../style/js/sass-compiler';

export class Button {

	init() {
		this.sassCompiler = new SassCompiler( {
			workerURL: './static/sass.worker.js'
		} );

		this.preload();
	}

	preload() {
		let	base = '../sass/',
			directory = '';

		// the files to load (relative to both base and directory)
		let files = [
			'button-scss/buttons.scss',
			'button-scss/_options.scss',
			'button-scss/types/_3d.scss',
			'button-scss/types/_border.scss',
			'button-scss/types/_borderless.scss',
			'button-scss/types/_dropdown.scss',
			'button-scss/types/_glow.scss',
			'button-scss/types/_groups.scss',
			'button-scss/types/_longshadow.scss',
			'button-scss/types/_raised.scss',
			'button-scss/types/_shapes.scss',
			'button-scss/types/_sizes.scss',
			'button-scss/types/_wrapper.scss',
			'button-scss/_layout.scss',
			'button-scss/_base.scss',
			'button-scss/_mixins.scss'
		];

		// preload a set of files
		this.sassCompiler.compiler.preloadFiles( base, directory, files, function callback() {
			console.log( base, directory, files );
		} );
	}

	compile() {
		this.sassCompiler.compileFile( '/button-scss/buttons.scss', result => {
			console.log( result );
		} );
	}

}

export { Renderer as default };
