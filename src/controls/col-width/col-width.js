import { MultiSlider } from '@boldgrid/controls/src/controls/multi-slider';

export class ColWidth
 extends MultiSlider {
	constructor( options ) {
		super( options );
		this.controlOptions = {
			control: {
				title: 'Column Widths',
				name: 'column-widths',
				units: {
					default: 'col',
					enabled: [ 'col' ]
				},
				sliders: this.getControlSliders()
			},
			slider: {
				col: {
					min: 1,
					max: 12,
					step: 1
				}
			},
			defaults: this.getDefaults( options ),
			devicesEnabled: [ 'base', 'large', 'desktop', 'tablet', 'phone' ],
		};

		this.options.control.sliders = this.controlOptions.control.sliders;
		this.options.defaults = this.controlOptions.defaults;
	}

	/**
	 * Get Control Sliders.
	 *
	 * @since 0.16.0
	 *
	 * @return {array} An Array of slider configs.
	 */
	getControlSliders() {
		let sliders = [];

		if ( _.isFunction( wp.customize ) ) {

			$( wp.customize.control( 'bgtfw_header_layout' ).container ).find( '.repeater' ).each( function() {
				key = this.dataset.key;
				sliders.push(
					{
						'name': this.dataset.uid,
						'label': 'Row 1 ' + key.substr( 0, 1 ).toUpperCase() + key.substr( 1 ),
						'cssProperty': 'width'
					}
				);
			} );
		} else {
			sliders = [
				{ name: 'default_branding', label: 'Row 1 Branding', cssProperty: 'width' },
				{ name: 'default_menu', label: 'Row 1 Menu', cssProperty: 'width' },
			];
		}

		return sliders;
	}

	/**
	 * Get Default Slider uids and values.
	 *
	 * @since 0.16.0
	 *
	 * @param {object} options Options config.
	 *
	 * @return {object} Options defaults.
	 */
	getDefaults( options ) {
		let defaults    = options.defaults,
			sliderNames = [];

		this.getControlSliders().forEach( function( slider ) {
			sliderNames.push( slider.name );
		} );

		options.defaults.forEach( function( type, index ) {
			let values = type.values;
			let placeHolders = Object.keys( values ).filter( key => /default_.*/.test(key) );
			if ( 0 < placeHolders.length ) {
				defaults[ index ].values = {};
				sliderNames.forEach( function( sliderName, placeHolderIndex ) {
					defaults[ index ].values[ sliderName ] = values[ placeHolders[ placeHolderIndex ] ];
				} );
			}
		} );

		return defaults;
	}
}

export { ColWidth as default };
