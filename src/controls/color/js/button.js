import { SassCompiler } from '../../style/js/sass-compiler';
import { Generate } from './generate.js';

export class Button {

	constructor( options ) {
		options = options || {};

		this.files = [
			'color-palette-scss/buttons/buttons.scss',
			'color-palette-scss/buttons/_options.scss',
			'color-palette-scss/buttons/types/_3d.scss',
			'color-palette-scss/buttons/types/_border.scss',
			'color-palette-scss/buttons/types/_borderless.scss',
			'color-palette-scss/buttons/types/_dropdown.scss',
			'color-palette-scss/buttons/types/_glow.scss',
			'color-palette-scss/buttons/types/_groups.scss',
			'color-palette-scss/buttons/types/_longshadow.scss',
			'color-palette-scss/buttons/types/_raised.scss',
			'color-palette-scss/buttons/types/_shapes.scss',
			'color-palette-scss/buttons/types/_sizes.scss',
			'color-palette-scss/buttons/types/_wrapper.scss',
			'color-palette-scss/buttons/_layout.scss',
			'color-palette-scss/buttons/_base.scss',
			'color-palette-scss/buttons/_mixins.scss'
		];

		this.namespace = '.btn';

		/**
		 * Default colors to add to the compiled list of button colors.
		 * @type {Array}
		 */
		this._defaultColors = [
			{ 'name': 'color-dark', val: '#252525' },
			{ 'name': 'color-light', val: '#eff0f1' }
		];

		if ( ! options.sassCompiler ) {
			this.sassCompiler = new SassCompiler();
		} else {
			this.sassCompiler = options.sassCompiler;
		}
	}

	init() {
		return this.preload();
	}

	preload() {
		return this.sassCompiler.preload( this.files );
	}

	/**
	 * Given a color palette state, create a list of colors to be passed into the sass.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} state Color palette control state of modifications.
	 * @return {array}        Array of colors config objects.
	 */
	convertColorState( state ) {
		let config = [],
			neutral = state.palettes['palette-primary']['neutral-color'];

		for ( let [ index, color ] of state.palettes['palette-primary'].colors.entries() ) {
			config.push( {
				name: 'color-' + ( index + 1 ),
				val: color
			} );
		}

		for ( let color of this._defaultColors ) {
			config.push( color );
		}

		if ( neutral ) {
			config.push( {
				name: 'color-neutral',
				val: neutral
			} );
		}

		return config;
	}

	/**
	 * Given a list of colors, create a SASS variable to pass on to library.
	 *
	 * @since 1.0.0
	 *
	 * @param  {array} colors Colors config array.
	 * @return {string}       Formartted sass definition.
	 */
	formatColorSass( colors ) {
		let contrast,
			paletteGenerate = new Generate(),
			variablesString = '';

		colors = colors || [];

		for ( let color of colors ) {
			contrast = paletteGenerate.getContrast( color.val );
			variablesString += '(\'' + color.name + '\' ' + color.val + ' ' + contrast + ')';
		}

		if ( variablesString ) {
			variablesString = '$ubtn-colors: ' + variablesString + ';';
		}

		return variablesString;
	}

	/**
	 * Return the scss string needed to compile the button library.
	 *
	 * @since. 1.0.0
	 *
	 * @param  {object} colorsState State of the color compiler.
	 * @return {string}             SCSS.
	 */
	getCompileString( colorsState ) {
		let variablesString = this.formatColorSass( this.convertColorState( colorsState ) ),
			namespaceString = '$ubtn-namespace: \'' + this.namespace + '\';',
			compileString = namespaceString + variablesString + '@import "color-palette-scss/buttons/buttons.scss";';

		return compileString;
	}

	/**
	 * Compile the colors lib.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object}   options Configurations for the compile operation.
	 * @param  {Function} cb      Callback for the complete process.
	 */
	compile( options, cb ) {
		this.sassCompiler.compiler.compile( compileString, ( result ) => {
			cb( result );
		} );
	}

}

export { Button as default };
