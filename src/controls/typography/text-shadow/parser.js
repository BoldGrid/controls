export class Parser {
	constructor() {
		this.regex = /(-?\d+px)|(rgba?\(.+\))/g;

		this.propertyOrder = [
			'horizontal-position',
			'vertical-position',
			'blur-radius',
			'color'
		];

		this.default = {
			'horizontal-position': 0,
			'vertical-position': 0,
			'blur-radius': 0,
			color: '#000000'
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
		string = string || '';
		string = string + ' ';

		let setting = _.clone( this.default ),
			matches = string.match( this.regex ) || [],
			propertyIndex = 0;

		if ( 2 > matches.length || 3 < ( string.match( /px/g ) || [] ).length ) {
			return false;
		}

		for ( let match of matches ) {
			let value = match.trim(),
				number = parseInt( value, 10 );

			if ( isNaN( number ) || -1 !== value.indexOf( 'rgb' ) ) {
				setting.color = value;
			} else {
				setting[this.propertyOrder[propertyIndex]] = number;
				propertyIndex++;
			}
		}

		return setting;
	}
}

export { Parser as default };
