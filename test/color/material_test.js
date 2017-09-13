import { Material } from '../../src/controls/color/js/material.js';

describe( 'material colors', function() {
	it( 'returns 5 colors', function() {
		let material = new Material();
		expect( material.getPalette( 'red' ).length ).toEqual( 5 );
	} );

	it( 'find all colors', function() {
		let material = new Material();
		expect( 10 < material.availableColors.length ).toEqual( true );
	} );
} );
