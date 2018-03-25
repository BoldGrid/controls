import $ from 'jquery';

export class WebFont {

	constructor( options ) {
		this.options = options;
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
				weight = $this.attr( 'data-font-weight' );

			if ( family ) {
				families[family] = families[family] || {};

				if ( weight ) {
					families[family].weights = families[family].weights || [];
					families[family].weights.push( weight );
				}
			}
		} );

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
				param = param + ':' + families[ familyName ].weights.join( ',' );
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
