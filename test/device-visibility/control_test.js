import { DeviceVisibility } from '../../../controls';

describe( 'Responsive Utility', function() {
	let $target = $( '<div class="hidden-sm">' ),
		control = new DeviceVisibility( { target: $target } ),
		$control = control.render();

	it( 'Creates HTML', function() {
		expect( !! $control.html().length ).toEqual( true );
	} );

	it( 'Sets Default', function() {
		expect( $control.find( '.checkboxes input[name="tablet-visibility"]:checked' ).length ).toEqual( 1 );
	} );
	it( 'Prevents all hidden', function() {
		$control.find( '.checkboxes input' ).prop( 'checked', true ).change();
		expect( $control.find( '.checkboxes input:checked' ).length ).toEqual( 3 );
	} );
} );
