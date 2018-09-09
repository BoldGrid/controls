var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { MDCSwitch } from '@material/switch';

export class Switch {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			name: _.random( 0, 10000 ),
			label: 'Off / On',
			direction: 'forward'
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

		this.switch = new MDCSwitch( this.$element.find( '.mdc-switch' )[0] );

		return this.$element;
	}

	setChecked( val ) {
		this.$input.prop( 'checked', val ).change();
		return this.switch.getDefaultFoundation().setChecked( val );
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
