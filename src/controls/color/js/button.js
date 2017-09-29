import { SassCompiler } from '../../style/js/sass-compiler';
import { Generate } from './generate.js';

export class Button {

	constructor( options ) {
		options = options || {};

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
		this.sassCompiler.preload( [
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
		] );
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
	 * Compile the colors lib.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object}   options Configurations for the compile operation.
	 * @param  {Function} cb      Callback for the complete process.
	 */
	compile( options, cb ) {
		let variablesString = this.formatColorSass( options.colors ),
			namespaceString = '$ubtn-namespace: \'' + this.namespace + '\';',
			compileString =  namespaceString + variablesString + '@import "button-scss/buttons.scss";';

		this.sassCompiler.compiler.compile( compileString, ( result ) => {
			cb( result );
		} );
	}

}

export { Button as default };
