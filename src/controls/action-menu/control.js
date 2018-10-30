var $ = window.jQuery;

import template from './template.html';
import { MatMenu } from '../mat-menu';
import { EventEmitter } from 'eventemitter3';
import './style.scss';

export class Control extends MatMenu {

	constructor( { ...options } ) {
		super();

		this.options = _.defaults( options || {}, {
			name: 'menu',
			label: 'Menu',
			action: 'Edit'
		} );

		this.event = new EventEmitter();
	}

	/**
	 * Create a checkbox and return the html.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control created.
	 */
	render() {
		super.render();
		this.$control = $( _.template( template )( this.options ) );
		this.$control.find( 'mat-menu' ).replaceWith( this.$menu );

		this.bind();

		return this.$control;
	}

	/**
	 * Setup event handlers.
	 *
	 * @since 1.0.0
	 */
	bind() {
		this.$control.find( '.action ' ).on( 'click', ( e ) => {
			e.preventDefault();
			this.show();
		} );

		this.$control.find( '[data-action]' ).on( 'click', ( e ) => {
			let name = $( e.currentTarget ).attr( 'data-action' );
			this.event.emit( 'action-' + name );
		} );
	}
}
