var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { MDCSelect } from '@material/select';
import { MDCSelectIcon } from '@material/select/icon';

export class Control {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			name: _.random( 0, 10000 ),
			label: 'My Select',
			icon: '',
			selected: null,

			/*
			 * Format - Example: {'value': 'image.png'}
			 * This will add an icon for individual options.
			 */
			iconOption: null
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
		this.$input = this.$element.find( 'select, input' );
		this.$icon = this.$element.find( '.mdc-select__icon' );

		this.select = new MDCSelect( this.$element.find( '.mdc-select' )[0] );
		this.icon = this.options.icon ? new MDCSelectIcon( this.$icon[0] ) : null;

		if ( this.options.iconOption )  {
			this.setupIconToggle();
		}

		return this.$element;
	}

	/**
	 * Setup binding change event to toggle icons.
	 *
	 * @since 1.0.0
	 */
	setupIconToggle() {
		this.toggleIcons();
		this.select.listen( 'MDCSelect:change', () => this.toggleIcons() );
	}

	/**
	 * Toggle the visibility of the icons.
	 *
	 * @since 1.0.0
	 */
	toggleIcons() {
		let value = this.getValue();
		if ( this.options.iconOption[ value ] ) {
			this.$icon.attr( 'src', this.options.iconOption[ value ] ).show();
		} else {
			this.$icon.hide();
		}
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
