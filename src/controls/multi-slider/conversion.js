export class Conversion {

	/**
	 * Convert Pixels to Ems.
	 *
	 * @since 1.2.7
	 * @return string ems;
	 */
	pxToEm( px, fontSize ) {
		var ems = 0;

		fontSize = fontSize ? parseInt( fontSize ) : 0;
		px = px ? parseInt( px ) : 0;

		if ( fontSize && px ) {
			ems = ( px / fontSize ).toFixed( 1 );
		}

		return ems;
	}

	pxToPercentage( px, $element ) {
		let contextWidth = $element.width();
		return px / contextWidth * 100;
	}

	percentageToPixel( percentage, $element ) {
		let contextWidth = $element.width();
		return contextWidth * ( percentage / 100 );
	}
}
