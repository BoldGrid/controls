var $ = window.jQuery;

import template from './template.html';
import './style.scss';

export class Switch {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			name: _.random( 0, 10000 ),
			label: 'Off / On'
		} );

		this.template = _.template( template );
	}

	/**
	 * Create a switch and return the html.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Switch created.
	 */
	render() {
		this.$element = $( this.template( this.options ) );
		this.$input = this.$element.find( 'input' );

		return this.$element;
	}

	/**
	 * Determine whether or not the switch is "on".
	 *
	 * @since 1.0.0
	 * @return {Boolean} Is the switch on?
	 */
	isEnabled() {
		return this.$input.prop( 'checked' );
	}
}
