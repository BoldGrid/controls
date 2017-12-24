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

	it( 'presets type', () => {
		let $target = $( '<div class="wow fadeIn">' ),
		animationControl = new Animation( { target: $target } ),
		$control = animationControl.render();

		expect( animationControl.$typeControl.val() ).toEqual( 'fadeIn' );
	} );

	it( 'works without presets', function() {
		let $target = $( '<div>' ),
			animationControl = new Animation( { target: $target } ),
			$control = animationControl.render();

		expect( animationControl.$typeControl.val() ).toEqual( '' );
		expect( animationControl.delayControl.$input.val() ).toEqual( '1' );
		expect( animationControl.durationControl.$input.val() ).toEqual( '1' );
	} );

} );
