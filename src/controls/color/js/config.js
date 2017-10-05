var $ = window.jQuery;

import { Material } from './material.js';

export class Config {
	constructor() {
		this.material = new Material();

		/**
		 * If no color is provided for the simple config, use this color.
		 *
		 * @type {String}
		 */
		this.defaultColor = 'deepOrange';

		/**
		 * Palette colors used for default list.
		 *
		 * @type {Array}
		 */
		this.samplePalettesColors = [
			'red', 'blue', 'teal', 'grey'
		];
	}

	/**
	 * Create savable configuration for color palettes.
	 *
	 * @since 1.0.0
	 *
	 * @param  {array} colors Colors to use as primary.
	 * @return {Object}       Configuration for palette system.
	 */
	createSimpleConfig( colors ) {
		let config = {};

		colors = colors || {};

		config.palettes = [];
		colors['is_active'] = true;
		config.palettes.push( this.createPalette( colors ) );

		config['color-palette-size'] = config.palettes[0].colors.length;
		config['palette_formats'] = [ 'palette-primary' ];

		config.palettes = config.palettes.concat( this.getPresetPalettes() );

		return config;
	}

	/**
	 * Get all sample palettes.
	 *
	 * @since 1.0.0
	 *
	 * @return {array} Palettes.
	 */
	getPresetPalettes() {
		let presets = [];

		for ( let color of this.samplePalettesColors ) {
			presets.push( this._createDefault( color ) );
		}

		return presets;
	}

	/**
	 * Create a palette configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Object} colors List of colors + Nuetral.
	 * @return {Object}        Configuration of all colors.
	 */
	createPalette( colors ) {
		let paletteConfig = _.defaults( colors, {
			'default': true,
			'copy_on_mod': true,
			'is_active': false,
			'format': 'palette-primary',
			'neutral-color': 'white',
			'colors': this.material.getPalette( this.defaultColor )
		} );

		paletteConfig['palette_id'] = btoa( paletteConfig.colors );

		return paletteConfig;
	}

	/**
	 * Given a state object from the control script. Create an object that can be saved then later reimported.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} controlState Control state.
	 * @return {object}              Palette Settings to be imported.
	 */
	createSavableState( controlState ) {
		let config = this.createSimpleConfig(),
			presets = this.getPresetPalettes(),
			palette = controlState.palettes['palette-primary'];

		// Set the active palette.
		// @todo: correctly identify if the active palette is one of the default palettes.
		palette['is_active'] = true;
		palette.default = false;
		config.palettes[0] = this.createPalette( palette );

		// Update saved palettes.
		config['saved_palettes'] = [];
		if ( controlState['saved_palettes'] ) {
			for ( let palette of controlState['saved_palettes'] ) {

				if ( palette.colors['neutral-color'] ) {
					palette.colors.push( palette.colors['neutral-color'] );
				}

				palette.default = false;
				palette['copy_on_mod'] = false;
				config['saved_palettes'].push( this.createPalette( palette ) );
			}
		}

		return config;
	}

	/**
	 * Create an inactive palette config.
	 *
	 * This is based on material color palettes, will only support the material colors.
	 * Used when a theme doesn't have default colors.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} color Color to generate.
	 * @return {Object}       Configuration of a palette.
	 */
	_createDefault( color ) {
		return this.createPalette( {
			'is_active': false,
			'colors': this.material.getPalette( color ),
			'neutral-color': 'white'
		} );
	}
}

export { Config as default };
