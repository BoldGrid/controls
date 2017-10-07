var $ = window.jQuery;

import '../scss/control.scss';
import SampleConfig from './sampleConfig.js';
import './control.js';
import { Config } from './config.js';
import { Button as ButtonColors } from './button.js';
import { SassCompiler } from '../../style/js/sass-compiler.js';

export class Renderer {

	constructor( configs ) {
		this.configs = _.defaults( configs || {}, {
			sassFiles: [],
			defaultSassFiles: [ 'color-palette-scss/classes/color-classes.scss' ]
		} );

		// Merge all sass files.
		this.configs.sassFiles = this.configs.sassFiles.concat( this.configs.defaultSassFiles );

		// Create a new compiler.
		this.sassCompiler = new SassCompiler( this.configs.sass || {} );

		this.buttonColors = new ButtonColors( {
			sassCompiler: this.sassCompiler
		} );

		this.buttonColors.init();

		this.sassCompiler.preload( this.configs.sassFiles );
	}

	setPaletteSettings( settings ) {
		this.palettes = this._createPaletteSetting( settings );
		this.formatConfig();
	}

	/**
	 * Update the configuration given to set derived values.
	 *
	 * @since 1.0.0
	 */
	formatConfig() {
		this.palettes.hasNeutralColor = this.palettes.palettes[0]['neutral-color'] ? 1 : 0;
		this.palettes.colorPaletteColumns = this.palettes['color-palette-size'] + this.palettes.hasNeutralColor;
		this.assignNeutral();
	}

	/**
	 * For each palette, move the neutral-color into the array of colors.
	 *
	 * @since 1.0.0
	 */
	assignNeutral() {
		for ( let palette of this.palettes.palettes ) {
			if ( palette['neutral-color'] ) {
				palette.colors.push( palette['neutral-color'] );
			}
		}
	}

	/**
	 * Import all specified files.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} An import for each given file.
	 */
	getImportString() {
		let string = '';

		for ( let file of this.configs.sassFiles ) {
			string += '@import "' + file + '";';
		}

		return string;
	}

	/**
	 * Render the control to a given target.
	 *
	 * @since 1.0.0
	 *
	 * @param  {jQuery} $target Location to put the control.
	 * @return {jQuery}         Control Element.
	 */
	render( $target, settings ) {
		let $control, html;

		this.setPaletteSettings( settings );

		html = this._createHtml();
		$control = $( html );

		$target.append( html );

		window.BOLDGRID.COLOR_PALETTE.Modify.init( $control, {
			renderer: this
		} );

		this.$control = $control;

		return $control;
	}

	/**
	 * Get the markup needed for the control.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} colorPalettes Color palettes configuration.
	 * @return {string}               Control Markup.
	 */
	_createHtml( colorPalettes ) {
		let file = require( '../template.html' );
		return _.template( file )( { config: this.palettes } );
	}

	/**
	 * Given requested settings, create configs that we can use.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} setting Configurations.
	 * @return {object}         A full set of configs for the control.
	 */
	_createPaletteSetting( setting ) {
		let colorConfig = new Config();

		if ( ! setting ) {
			setting = colorConfig.createSimpleConfig();
		}

		return $.extend( true, {}, setting );
	}
}

export { Renderer as default };
