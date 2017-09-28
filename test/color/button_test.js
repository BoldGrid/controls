import { Button } from '../../src/controls/color/js/button.js';

describe( 'button styles', function() {
	it( 'creates sass', function() {
		let button = new Button(),
			expected = '$ubtn-colors: (\'primary\' yellow #1a1a1a)(\'secondary\' red #1a1a1a);',
			colors = [
				{ 'name': 'primary', val: 'yellow' },
				{ 'name': 'secondary', val: 'red' }
			];

		expect( expected ).toEqual( button.formatColorSass( colors ) );
	} );
	it( 'creates sass without args', function() {
		let button = new Button();
		expect( '' ).toEqual( button.formatColorSass() );
	} );
} );
