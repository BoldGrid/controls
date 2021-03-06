import { Border } from '../../../controls';

describe( 'Border Control', function() {
	let $target = $( '<div>' ),
		border = new Border( { target: $target } ),
		$control = border.render();

	it( 'creates html', function() {
		expect( !! $control.html().length ).toEqual( true );
	} );

	it( 'refreshes values', function() {
		$target.css( 'border', '' );
		border.refreshValues();
		expect( border.getValues() ).toEqual( { top: 0, right: 0, bottom: 0, left: 0 } );
		$target.css( 'border', '1px solid green' );
		border.refreshValues();
		expect( border.getValues() ).toEqual( { top: 1, right: 1, bottom: 1, left: 1 } );
	} );

	it( 'shows border width', function() {
		$target.css( 'border', '2px dashed green' );
		border.refreshValues();
		expect( border.$typeControl.find( '.slider-group' ).css( 'display' ) ).toEqual( 'block' );
	} );

	it( 'returns border-style', function() {
		$target.css( 'border', '' );
		$target.css( 'border-bottom', '2px dashed green' );
		border.refreshValues();
		expect( border._getBorderStyle() ).toEqual( 'dashed' );
		expect( border.$typeControl.find( '.slider-group' ).css( 'display' ) ).toEqual( 'block' );
	} );

	it( 'hides border width', function() {
		$target.css( 'border', '2px dashed green' );
		border.refreshValues();
		$target.css( 'border', '' );
		border.refreshValues();
		expect( border.$typeControl.find( '.slider-group' ).css( 'display' ) ).toEqual( 'none' );
	} );
} );
