import { MultiSlider } from '../multi-slider';
import { Conversion } from '../multi-slider/conversion';

export class BorderRadius extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Border Radius',
				name: 'border-radius',
				units: {
					default: 'px',
					enabled: [ 'px', 'em', '%' ]
				},
				sliders: [
					{ name: 'top-left', label: 'Top Left', cssProperty: 'border-top-left-radius' },
					{ name: 'top-right', label: 'Top Right', cssProperty: 'border-top-right-radius' },
					{ name: 'bottom-right', label: 'Bottom Right', cssProperty: 'border-bottom-right-radius' },
					{ name: 'bottom-left', label: 'Bottom Left', cssProperty: 'border-bottom-left-radius' }
				]
			},
			slider: {
				px: {
					min: 0,
					max: 50,
					step: 1
				},
				em: {
					step: 0.1,
					min: 0,
					max: 5
				},
				'%': {
					min: 0,
					max: 50,
					step: 1
				}
			}
		};
	}

	/**
	 * Convert the JS pixel value to perctenage or ems.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} rawValue JS computed value.
	 * @return {integer}          New Value.
	 */
	convertToSelectedUnit( computedValue ) {
		let converted, pixelValue;

		if ( -1 !== computedValue.indexOf( '%' ) ) {
			computedValue = parseInt( computedValue );
			computedValue = new Conversion().percentageToPixel( computedValue, this.$target );
		}

		if ( '%' === this.selectedUnit ) {
			pixelValue = parseInt( computedValue );
			converted = new Conversion().pxToPercentage( pixelValue, this.$target );
		} else {
			converted = super.convertToSelectedUnit( computedValue );
		}

		return converted;
	}
}

export { BorderRadius as default };
