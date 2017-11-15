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
		this.defaultColor = 'blue';

		/**
		 * Palette colors used for default list.
		 *
		 * @type {Array}
		 */
		this.samplePalettesColors = [ 'blue', 'teal', 'red', 'pink', 'grey', 'brown' ];
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
		let config = {},
			formattedPalette,
			presetPalettes = this.getPresetPalettes();

		config.palettes = [];

		if ( ! colors ) {
			config.palettes = presetPalettes;
		} else {
			formattedPalette = this.createPalette( colors );
			config.palettes.push( formattedPalette );
			config.palettes = config.palettes.concat( presetPalettes );
		}

		config.palettes[0].isActive = true;
		config['color-palette-size'] = config.palettes[0].colors.length;
		config['palette_formats'] = [ 'palette-primary' ];

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
			default: true,
			copyOnMod: true,
			isActive: false,
			format: 'palette-primary',
			colors: this.material.getPalette( this.defaultColor )
		} );

		paletteConfig['palette_id'] = btoa( paletteConfig.colors );

		return paletteConfig;
	}

	/**
	 * Merge in the default color palettes to the saved state.
	 *
	 * @since 1.6
	 *
	 * @param  {object} settings Requested configs.
	 * @return {object}          Configs.
	 */
	mergeDefaults( settings ) {
		settings.palettes = settings.palettes.concat( this.getPresetPalettes() );
		return settings;
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
			palette = controlState.palettes['palette-primary'];

		config.palettes = [];

		// Set the active palette.
		// @todo: correctly identify if the active palette is one of the default palettes.
		palette.isActive = true;
		palette.default = false;
		config.palettes[0] = this.createPalette( palette );

		// Update saved palettes.
		config['saved_palettes'] = [];
		controlState['saved_palettes'] = controlState['saved_palettes'] || [];
		for ( let curPalette of controlState['saved_palettes'] ) {
			let formattedPalette = this.createPalette( curPalette );

			if ( formattedPalette.palette_id === config.palettes[0].palette_id ) {
				continue;
			}

			/*
			If ( formattedPalette['neutral-color'] ) {
				formattedPalette.colors.push( formattedPalette['neutral-color'] );
			}
			*/

			formattedPalette.default = false;
			formattedPalette.copyOnMod = false;
			config['saved_palettes'].push( formattedPalette );
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
			isActive: false,
			colors: this.material.getPalette( color ),
			'neutral-color': 'white'
		} );
	}
}

export { Config as default };
