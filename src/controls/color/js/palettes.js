/**
 * These color palettes are used when the user only provides 1 color
 * and would like to generate a palette
 * These definitions come from the color.js file and include expansion of colors to 5
 */
export class Palettes {

	monochromatic( color ) {
		let paletteColors = [];
		paletteColors.push( color );
		paletteColors.push( color.lightenByAmount( 0.3 ) );
		paletteColors.push( color.darkenByAmount( 0.1 ) );
		paletteColors.push( color.saturateByAmount( 0.5 ) );
		paletteColors.push( color.lightenByAmount( 0.2 ) );
		return paletteColors;
	}

	// Tims Palette.
	intesityAndHue( color ) {
		let paletteColors = [];
		paletteColors.push( color );
		paletteColors.push( color.shiftHue( 20 ).lightenByAmount( 0.15 ) );
		paletteColors.push( color.shiftHue( -20 ).darkenByAmount( 0.20 ) );
		paletteColors.push( color.shiftHue( -33 ).darkenByAmount( 0.25 ) );
		paletteColors.push( color.shiftHue( 10 ).lightenByAmount( 0.05 ) );

		return paletteColors;
	}

	complementaryScheme( color ) {
		let paletteColors = [];
		paletteColors.push( color );
		paletteColors.push( color.shiftHue( 180 ) );
		paletteColors.push( color.shiftHue( 180 ).lightenByAmount( 0.25 ) );
		paletteColors.push( color.darkenByAmount( 0.25 ) );
		paletteColors.push( color.lightenByAmount( 0.25 ) );

		return paletteColors;
	}

	splitComplementaryScheme( color ) {
		let paletteColors = [];
		paletteColors.push( color );
		paletteColors.push( color.shiftHue( 150 ) );
		paletteColors.push( color.shiftHue( 320 ) );
		paletteColors.push( color.shiftHue( 320 ).darkenByAmount( 0.25 ) );
		paletteColors.push( color.lightenByAmount( 0.25 ) );

		return paletteColors;
	}

	splitComplementaryCWScheme( color ) {
		let paletteColors = [];
		paletteColors.push( color );
		paletteColors.push( color.shiftHue( 60 ) );
		paletteColors.push( color.shiftHue( 210 ) );
		paletteColors.push( color.darkenByAmount( 0.1 ) );
		paletteColors.push( color.shiftHue( 60 ).darkenByAmount( 0.15 ) );

		return paletteColors;
	}

	triadicScheme( color ) {
		let paletteColors = [];

		paletteColors.push( color );
		paletteColors.push( color.shiftHue( 60 ) );
		paletteColors.push( color.shiftHue( 240 ) );
		paletteColors.push( color.shiftHue( 60 ).lightenByAmount( 0.2 ) );
		paletteColors.push( color.lightenByAmount( 0.15 ) );

		return paletteColors;
	}

	tetradicScheme( color ) {
		let paletteColors = [];

		paletteColors.push( color );
		paletteColors.push( color.shiftHue( 90 ) );
		paletteColors.push( color.shiftHue( 180 ) );
		paletteColors.push( color.shiftHue( 270 ) );
		paletteColors.push( color.saturateByAmount( -0.25 ) );

		return paletteColors;
	}
}
