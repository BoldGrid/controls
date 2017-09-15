import { Material } from '../../src/controls/color/js/material.js';

import { StyleUpdater, ColorPalette } from '../../src/controls';

describe( 'palette control', function() {
	it( 'returns element', function() {

		// Instantiate the css loader.
		this.styleUpdater = new StyleUpdater( document );
		this.styleUpdater.setup();

		let $tab = $( '.colors-tab' ),
			colorPalette = new ColorPalette(),
			$control = colorPalette.render( $tab.find( '.control' ) );

		expect( $control.length ).toEqual( 1 );
	} );
} );
