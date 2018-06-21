import {
	Padding,
	Margin,
	Border,
	BoxShadow,
	BorderRadius
} from '../../controls';

import { Preview } from '../preview';

export class Demo {

	constructor( saveUI ) {
		this.$head = $( 'head' );
		this.save = saveUI;

		this.controls = [
			{ name: 'margin', className: Margin },
			{ name: 'padding', className: Padding },
			{ name: 'border', className: Border },
			{ name: 'boxShadow', className: BoxShadow },
			{ name: 'borderRadius', className: BorderRadius }
		];

		this.preview = new Preview();
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
		let storage = this.save.getItem( controlName ),
			$defaultTarget = $( '.directional-controls .combined' ),
			config = { target: $defaultTarget };

		config = {
			defaults: storage,

			/*
			Temporary Example for overriding Defaults.
			setting: {
				css: '',
				settings: [
					{
						media: [ 'desktop' ],
						unit: 'em',
						isLinked: true,
						values: {
							top: 10,
							right: 10,
							bottom: 10,
							left: 10
						}
					}
				]
			},
			*/

			control: {
				selectors: [ '.bg-tabs-content.directional-controls .combined.test-case' ]
			}
		};

		if ( storage ) {
			this.preview.appendStyles( controlName, storage.css );
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

		for ( let control of this.controls ) {
			const name = control.name;

			this.save.setup( name, ( name ) => this[ name ].settings );

			this[ name ] = new control.className( this.getSavedConfigs( name ) );

			this[ name ].events.on( 'change', ( e ) => {
				this.preview.appendStyles( name, e.css );
			} );

			$tab.find( '.' + name +  '-control .control' ).html( this[ name ].render() );
		}
	}

}
