let json = require( './google-fonts.json', 'utf8' );

let updated = {};
for ( let [ name, font ] of Object.entries( json.items ) ) {

	for ( let index of font.variants.keys() ) {
		if ( 'regular' === font.variants[ index ] ) {
			font.variants[ index ] = '400';
		}
		if ( 'italic' === font.variants[ index ] ) {
			font.variants[ index ] = '400italic';
		}
	}

	let variants = {};
	for ( let weight of font.variants ) {
		if ( -1 !== weight.indexOf( 'italic' ) ) {
			variants.italic = variants.italic || [];
			variants.italic.push( weight.replace( 'italic', '' ) );
		} else {
			variants.normal = variants.normal || [];
			variants.normal.push( weight );
		}
	}

	updated[ font.family ] = font;
	updated[ font.family ].variants = variants;
	delete updated[ font.family ].family;
}

console.log( JSON.stringify( updated ) );
