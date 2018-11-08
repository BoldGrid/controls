var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { MDCSelect } from '@material/select';

export class Control {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			name: _.random( 0, 10000 ),
			label: 'My Select',
			selected: null
		} );

		this.template = _.template( template );
	}

	/**
	 * Create a checkbox and return the html.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control created.
	 */
	render() {
		this.$element = $( this.template( this.options ) );
		this.$input = this.$element.find( 'select' );

		new MDCSelect( this.$element.find( '.mdc-select' )[0] );

		return this.$element;
	}

	/**
	 * Get control current avlue.
	 *
	 * @since 1.0.0
	 *
	 * @return {mixed} Value.
	 */
	getValue() {
		return this.$input.val();
	}

	/**
	 * Set the control value.
	 *
	 * @since 1.0.0
	 *
	 * @param {mixed} val Value for the input.
	 */
	setValue( val ) {
		this.$input.val( val );
	}
}
