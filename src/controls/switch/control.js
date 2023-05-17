var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { MDCSwitch } from '@material/switch';

export class Switch {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			name: _.random( 0, 10000 ),
			label: 'Off / On',
			direction: 'forward',
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

		this.$button = this.$element.find( 'button.mdc-switch' );

		this.$input = this.$element.find( 'input' );

		this.switch = new MDCSwitch( this.$button.get(0) );

		return this.$element;
	}

	setChecked( val ) {
		if ( val === this.switch.selected ) {
			return;
		}

		this.$button.trigger( 'click' );
	}

	/**
	 * Determine whether or not the switch is "on".
	 *
	 * @since 1.0.0
	 * @return {boolean} Is the switch on?
	 */
	isEnabled() {
		return this.switch.selected;
	}
}
