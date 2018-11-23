var $ = window.jQuery;

import { MDCMenu } from '@material/menu';
import template from './template.html';
import './style.scss';

export class Control {
	constructor( options ) {
		this.options = options || {};
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
		this.$menu = $( this.template( this.options ) );
		this.menu = new MDCMenu( this.$menu[0] );

		return this.$menu;
	}

	/**
	 * Show the menu.
	 *
	 * @since 1.0.0
	 */
	show() {
		this.menu.open = true;

		// Focus the selected element. This should be removed if a material solution is found.
		setTimeout( () => {
			this.$menu.find( '.mdc-menu-item--selected' ).focus();
		}, 250 );
	}

	/**
	 * Hide the menu.
	 *
	 * @since 1.0.0
	 */
	hide() {
		this.menu.open = false;
	}
}
