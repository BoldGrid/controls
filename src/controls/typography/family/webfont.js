import $ from 'jquery';
import googleFonts from './google-fonts.json';

export class WebFont {

	constructor( options ) {
		this.options = options;

		this.googleFonts = {};

		// The new google-fonts.json is in a different format than previous versions.
		for ( let font in googleFonts.items ) {
			this.googleFonts[ googleFonts.items[ font ].family ] = googleFonts.items[ font ];
		}
	}

	/**
	 * Get array of font families.
	 *
	 * @since 1.0.0
	 *
	 * @return array Families that need to be reuqested.
	 */
	createLinkList() {
		let families = {};

		this.options.$scope.find( '[data-font-family]' ).each( ( index, el ) => {
			let $this = $( el ),
				family = $this.attr( 'data-font-family' ),
				variant = $this.attr( 'data-font-style' ) || 'normal',
				weight = $this.attr( 'data-font-weight' );

			if ( family && this.googleFonts[ family ] ) {
				let weights = this.googleFonts[ family ].variants[ variant ] || this.googleFonts[ family ].variants.normal;
				families[family] = families[family] || {};

				if ( weight && weights && -1 !== weights.indexOf( weight ) ) {
					families[family].weights = families[family].weights || [];

					if ( 'italic' === variant && this.googleFonts[ family ].variants[ variant ] ) {
						weight = weight + 'i';
					}

					families[family].weights.push( weight );
				}

			}
		} );
		console.log( families );
		return families;
	}

	/**
	 * Update font link that has been added to the head.
	 *
	 * @since 1.0.0
	 */
	updateFontLink() {
		let families,
			familyParam,
			params,
			baseUrl = 'https://fonts.googleapis.com/css?',
			$head = this.options.$scope.find( 'head' ),
			$link = $head.find( '#boldgrid-google-fonts' );

		if ( ! $link.length ) {
			$link = $( '<link id="boldgrid-google-fonts" rel="stylesheet">' );
			$head.append( $link );
		}

		families = this.createLinkList();

		// Create url encoded array.
		familyParam = [];
		for ( let familyName in families ) {
			let param = familyName;
			if ( families[ familyName ].weights ) {
				param = param + ':' + _.uniq( families[ familyName ].weights ).join( ',' );
			}

			familyParam.push( param );
		}

		familyParam = familyParam.join( '|' );

		// Create params string.
		if ( familyParam ) {
			params = jQuery.param( { family: familyParam } );
			$link.attr( 'href', baseUrl + params );
		}
	}
}
