const $ = jQuery;

export class Preview {

	constructor( options ) {
		this.options = options || {};
		this.options.context = this.options.context ? $( this.options.context ) : $( 'html' );
		this.$head = this.options.context.find( 'head' );
	}

	/**
	 * Append styles to the head.
	 *
	 * @since 1.0.0
	 */
	appendStyles( id, css ) {
		let $style = this.$head.find( '#' + id );

		if ( ! $style.length ) {
			$style = $( '<style>' );
			$style.attr( 'id', id );
			this.$head.append( $style );
		}

		$style.html( css );
	}
}
