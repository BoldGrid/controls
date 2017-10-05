import { Config as ColorConfig } from '../../src/controls/color/js/config.js';

describe( 'default configurations', function() {
	it( 'overrides colors', function() {
		let output,
			colorConfig = new ColorConfig(),
			inputValues = {
				colors: [ 'red', 'white', 'blue' ],
				'neutral-color': 'yellow'
			};

		output = colorConfig.createSimpleConfig( inputValues );

		expect( output.palettes[0].colors ).toEqual( inputValues.colors );
	} );

	it( 'creates savable state', function() {
		let results,
			colorConfig = new ColorConfig(),
			controlState = {
				'active-palette': 'palette-primary',
				'active-palette-id': 'giberish',
				palettes: {
					'palette-primary': {
						colors: [ 'rgb(33, 150, 243)', 'rgb(13, 71, 161)', 'rgb(25, 118, 210)', 'rgb(66, 165, 245)', 'rgb(144,202,249)' ],
						format: 'palette-primary',
						'neutral-color': 'white'
					}
				},
				'saved_palettes': [
					{
						colors: [ 'rgb(252, 168, 157)', 'rgb(250, 199, 180)', 'rgb(153, 139, 130)', 'rgb(255,225,201)', 'rgb(175,199,185)' ],
						format: 'palette-primary',
						'neutral-color': '#FFE3CC'
					}
				]
			};

		results = colorConfig.createSavableState( controlState );

		expect( results.palettes.length ).toEqual( 5 );
		expect( results['saved_palettes'].length ).toEqual( 1 );
	} );
} );
