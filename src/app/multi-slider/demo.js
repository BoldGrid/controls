import { Storage } from '../storage';
import './style.scss';
import {
	Padding,
	Margin,
	Border,
	BoxShadow,
	BorderRadius
} from '../../controls';

export class Demo {

	constructor() {
		this.storage = new Storage();
		this.$head = $( 'head' );

		this.controls = [
			{ name: 'margin', className: Margin },
			{ name: 'padding', className: Padding },

			// { name: 'border', className: Border },
			{ name: 'boxShadow', className: BoxShadow },
			{ name: 'borderRadius', className: BorderRadius }
		];
	}

	/**
	 * Get the value of a saved configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} controlName Control Type.
	 * @return {object}             Config to pass into control.
	 */
	getSavedConfigs( controlName ) {
		let storage = this.storage.getItem( controlName ),
			$defaultTarget = $( '.directional-controls .combined' ),
			config = { target: $defaultTarget };

		config = {
			defaults: storage,
			control: {
				selectors: [ '.bg-tabs-content.directional-controls .combined.test-case' ]
			}
		};

		if ( storage ) {
			this.appendStyles( controlName, storage.css );
		}

		return config;
	}

	/**
	 * Render all the controls.
	 *
	 * @since 1.0.0
	 */
	render() {
		let $tab = $( '.directional-controls' ),
			$combined = $tab.find( '.combined' );

		this._setupStorage();

		for ( let control of this.controls ) {
			const name = control.name;

			this[ name ] = new control.className( this.getSavedConfigs( name ) );

			this[ name ].events.on( 'change', ( e ) => {
				this.appendStyles( name, e.css );
			} );

			$tab.find( '.' + name +  '-control .control' ).html( this[ name ].render() );
		}
	}

	/**
	 * Append the generated styles to the head element.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} id  ID to save as.
	 * @param  {string} css CSS values.
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

	/**
	 * Setup local storage events.
	 *
	 * @since 1.0.0
	 */
	_setupStorage() {
		$( '.save-settings' ).on( 'click', () => {
			for ( let control of this.controls ) {
				this.storage.setItem( control.name, this[ control.name ].settings );
			}
			location.reload();
		} );

		$( '.clear-storage' ).on( 'click', () => {
			for ( let control of this.controls ) {
				this.storage.removeItem( control.name );
			}
			location.reload();
		} );
	}
}
