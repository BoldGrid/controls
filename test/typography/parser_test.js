import { Parser } from '../../src/controls/typography/text-shadow/parser';

describe( 'TExt Shadow Parser', function() {
		let parser = new Parser();

		it( 'Invalid Options', function() {
			expect( parser.parse( 'Red' ) ).toEqual( false );
		} );

		it( 'Understands direction only', function() {
			expect( parser.parse( '1px 1px' ) ).toEqual(
				{
					'horizontal-position': 1,
					'vertical-position': 1,
					'blur-radius': 0,
					'color': '#000000'
				} );
		} );

		it( 'Reads all properties', function() {
			let $testElement = $( '<div>' );
			$testElement.css( { 'text-shadow': '3px 6px 2px rgba(25,25,25,.4)' } );

			expect( parser.parse( $testElement.css( 'text-shadow' ) ) ).toEqual(
				{
					'horizontal-position': 3,
					'vertical-position': 6,
					'blur-radius': 2,
					'color': 'rgba(25, 25, 25, 0.4)'
				} );
		} );

		it( 'Cannot parse chained args', function() {
			expect( parser.parse( '3px 6px 2px yellow, 3px 6px 2px yellow' ) ).toEqual( false );
		} );
} );
