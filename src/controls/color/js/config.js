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
			'red', 'amber', 'blue', 'teal', 'indigo', 'grey'
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

		for ( let color of this.samplePalettesColors ) {
			config.palettes.push( this._createDefault( color ) );
		}

		return config;
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
