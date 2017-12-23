import { Animation } from '../../../controls';

describe( 'Animation Control', function() {
	let $target = $( '<div data-wow-duration="1.5s" data-wow-delay="0s">' ),
		animationControl = new Animation( { target: $target } ),
		$control = animationControl.render();

	it( 'creates html', function() {
		expect( !! $control.html().length ).toEqual( true );
	} );

	it( 'adds animation classes', function() {
		$control.find( 'select' ).val( 'fadeOut' ).change();
		expect( $target.hasClass( 'wow' ) ).toEqual( true );
	} );

	it( 'presets sliders', function() {
		expect( animationControl.delayControl.$input.val() ).toEqual( '0' );
		expect( animationControl.durationControl.$input.val() ).toEqual( '1.5' );
	} );

} );
