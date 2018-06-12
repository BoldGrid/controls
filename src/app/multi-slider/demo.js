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
	}

	_setupSave() {
		let controls = [ 'padding', 'border', 'boxShadow', 'borderRadius', 'margin' ];

		$( '.save-settings' ).on( 'click', () => {
			for ( let control of controls ) {
				this.storage.setItem( control, this[ control ].settings );
			}
			location.reload();
		} );

		$( '.clear-storage' ).on( 'click', () => {
			for ( let control of controls ) {
				this.storage.removeItem( control );
			}
			location.reload();
		} );
	}

	getSavedConfigs( type ) {
		let storage = this.storage.getItem( type ),
			$defaultTarget = $( '.directional-controls .combined' ),
			config = { target: $defaultTarget };

		if ( storage || 1 ) {
			config = {
				defaults: storage,
				control: {
					selectors: [ '.combined.test-case' ]
				}
			};
		}

		return config;
	}

	render() {
		let $tab = $( '.directional-controls' ),
			$combined = $tab.find( '.combined' );

		this.padding = new Padding( this.getSavedConfigs( 'padding' ) ),
		this.border = new Border( this.getSavedConfigs( 'border' ) ),
		this.boxShadow = new BoxShadow( this.getSavedConfigs( 'boxShadow' ) ),
		this.borderRadius = new BorderRadius( this.getSavedConfigs( 'borderRadius' ) ),
		this.margin = new Margin( this.getSavedConfigs( 'margin' ) );

		this._setupSave();

		this.padding.events.on( 'change', ( e ) => {
			console.log( e );
		} );

		$tab.find( '.padding-control .control' ).html( this.padding.render() );
		$tab.find( '.margin-control .control' ).html( this.margin.render() );
		$tab.find( '.border-control .control' ).html( this.border.render() );
		$tab.find( '.border-radius .control' ).html( this.borderRadius.render() );
		$tab.find( '.box-shadow .control' ).html( this.boxShadow.render() );
	}
}
