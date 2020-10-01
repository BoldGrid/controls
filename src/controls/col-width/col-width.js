import { MultiSlider } from '@boldgrid/controls/src/controls/multi-slider';
import { Slider } from '../slider';
import linkSvg from '../multi-slider/img/link.svg';

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
				sliders: this.getControlSliders(),
				description: options.description
			},
			slider: {
				col: {
					min: 1,
					max: 12,
					step: 1
				}
			},
			defaults: this.getDefaults( options ),
			devicesEnabled: [ 'large', 'desktop', 'tablet', 'phone' ],
			defaultSelected: 'large'
		};

		this.options.control.sliders = this.controlOptions.control.sliders;
		this.options.defaults = this.controlOptions.defaults;
	}

	/**
	 * Create sliders and attach them to the template.
	 *
	 * @since 1.0.0
	 */
	_createSliders() {
		this.sliders = {};
		for ( let slider of this.controlOptions.control.sliders ) {
			let sliderControl;
			let thisRow = slider.label.split( ' ' )[1];
			let lastRow = this.$sliderGroup.find( 'label' ).last().text() ? this.$sliderGroup.find( 'label' ).last().text().split( ' ' )[1] : thisRow;

			if ( thisRow > lastRow ) {
				this.$sliderGroup.append( '<hr />' );
			}
			slider.uiSettings = this.getSliderConfig( slider );

			sliderControl = new Slider( $.extend( true, {}, slider ) );

			sliderControl.render();

			this.$sliderGroup.append( sliderControl.$control );
			sliderControl.$input.after(
				'<a class="link" href="#" title="Link all sliders">' + linkSvg + '</a>'
			);

			this.sliders[slider.name] = sliderControl;

			this._bindSliderChange( sliderControl );
		}
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
				let label,
					row;
				key = this.dataset.key;
				row = parseInt( $( this ).parent().attr( 'id' ).split('-')[2] ) + 1;
				if ( 'sidebar' === key ) {
					label = 'Row ' + row + ' Widget Area';
				} else {
					label = 'Row ' + row + ' ' + key.substr( 0, 1 ).toUpperCase() + key.substr( 1 );
				}
				sliders.push(
					{
						'name': this.dataset.uid,
						'label': label,
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
					defaults[ index ].values[ sliderName ] = values[ placeHolders[ placeHolderIndex ] ] ? values[ placeHolders[ placeHolderIndex ] ] : 12;
				} );
			}
		} );

		return defaults;
	}
}

export { ColWidth as default };
