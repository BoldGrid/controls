export class Parser {
	constructor() {
		this.regex = /(-?\d+px)|(rgb\(.+\))/g;
		this.propertyOrder = [
			'horizontal-position',
			'vertical-position',
			'blur-radius',
			'spread-radius'
		];

		this.default = {
			inset: false,
			'horizontal-position': 0,
			'vertical-position': 0,
			'blur-radius': 0,
			'spread-radius': 0,
			color: false
		};
	}

	/**
	 * Loop through a result and set properties accordingly.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} string CSS rule.
	 * @return {object}        Property values.
	 */
	parse( string ) {
		let setting = this.default,
			matches = string.match( this.regex ),
			propertyIndex = 0;

		setting.inset = -1 !== string.indexOf( 'inset' );
		if ( ! matches || 2 >= matches.length ) {
			return false;
		}

		for ( let match of matches ) {
			if ( -1 !== match.indexOf( 'rgb' ) ) {
				setting.color = match;
			} else if ( 'inset' === match ) {
				setting.inset = true;
			} else if ( -1 !== match.indexOf( 'px' ) ) {
				setting[this.propertyOrder[propertyIndex]] = parseInt( match );
				propertyIndex++;
			}
		}

		return setting;
	}
}

export { Parser as default };
