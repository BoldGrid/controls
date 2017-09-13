import MaterialColors from 'google-material-color-palette-json';

export class Material {

	constructor() {
		this.paletteLayoutShades = [ '500', '900', '700', '400', '200' ];
		this.availableColors = _.without( _.keys( MaterialColors ), 'black', 'white' );
	}

	/**
	 * Create a palette.
	 *
	 * @since 1.6
	 *
	 * @param  {string} color Color to create palett based off of.
	 * @return {array}        Palette..
	 */
	getPalette( color ) {
		let palette = [];

		for ( let shade of this.paletteLayoutShades ) {
			palette.push( MaterialColors[color]['shade_' + shade] );
		}

		return palette;
	}
}

export { Material as default };
