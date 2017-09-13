import { Config as ColorConfig } from '../../src/controls/color/js/config.js';

describe( 'default configurations', function() {

	it( 'overrides colors', function() {
		let output,
			colorConfig = new ColorConfig(),
			inputValues = {
				'colors': [ 'red', 'white', 'blue' ],
				'neutral-color': 'yellow'
			};

		output = colorConfig.createSimpleConfig( inputValues );

		expect( output.palettes[0].colors ).toEqual( inputValues.colors );
	} );

} );
