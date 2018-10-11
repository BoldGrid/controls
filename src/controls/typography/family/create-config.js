let filename = __dirname + '/google-fonts.json',
	https = require( 'https' ),
	fs = require( 'fs' );
	url = 'https://www.googleapis.com/webfonts/v1/webfonts?fields=items(category%2Cfamily%2Cvariants)&key=',
	apiKey = 'API KEY HERE';

function getFonts( url, apiKey ) {
	return new Promise( ( resolve, reject ) => {
		https.get( url + apiKey, ( resp ) => {
			let data = '';

			resp.on( 'data', ( chunk ) => data += chunk );

			// The whole response has been received. Print out the result.
			resp.on( 'end', () => {
				resolve( JSON.parse( data ) );
			} );

		} ).on( 'error', ( err ) => {
			reject( JSON.parse( 'Error: ' + err.message ) );
		} );
	} );
}

function format( json ) {
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

	return updated;
}


getFonts( url, apiKey ).then( ( list ) =>  {
	fs.writeFile( filename, JSON.stringify( format( list ) ), () => {
		console.log( 'Operation complete.' );
	} );
} );
