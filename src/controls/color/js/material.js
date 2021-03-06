import MaterialColors from 'google-material-color-palette-json';

export class Material {
	constructor() {
		this.paletteLayoutShades = [ '500', '900', '100', '#eeeeee', '#131313' ];
		this.availableColors = _.without( _.keys( MaterialColors ), 'black', 'white' );
	}

	/**
	 * Get a random palette.
	 *
	 * @since 1.0.0
	 *
	 * @return {array} list of Colors.
	 */
	getRandomPalette() {
		let color = _.sample( this.availableColors );
		return this.getPalette( color );
	}

	/**
	 * Create a palette.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} color Color to create palett based off of.
	 * @return {array}        Palette..
	 */
	getPalette( color ) {
		let palette = [];

		for ( let shade of this.paletteLayoutShades ) {
			if ( -1 !== shade.indexOf( '#' ) ) {
				palette.push( shade );
			} else if ( -1 !== [ 'black', 'white', '#eeeeee' ].indexOf( shade ) ) {
				palette.push( MaterialColors[shade] );
			} else {
				palette.push( MaterialColors[color]['shade_' + shade] );
			}
		}

		return palette;
	}

	/**
	 * Generate all color palettes.
	 *
	 * @since 1.0.0
	 *
	 * @return {array} All possible palettes.
	 */
	getAllPalettes() {
		let palettes = [];

		for ( let color of this.availableColors ) {
			palettes.push( this.getPalette( color ) );
		}

		return palettes;
	}
}

export { Material as default };
