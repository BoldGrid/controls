import { Generate } from '../../src/controls/color/js/generate.js';

describe( 'palette calculations', function() {
	it( 'gets contrast color', function() {
		let generate = new Generate();
		expect( generate.getContrast( '#000' ) ).toEqual( generate.contrast.dark );
	} );
} );
