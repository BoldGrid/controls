import { MultiSlider } from '../multi-slider';

export class BorderRadius extends MultiSlider {

	constructor( options ) {
		super( options );

		this.controlOptions = {
			'control': {
				'title': 'Border Radius',
				'name': 'border-radius',
				'units': {
					'default': 'px',
					'enabled': [
						'px'
					]
				},
				'sliders': [
					{ name: 'top-left', label: 'Top Left', cssProperty: 'border-top-left-radius' },
					{ name: 'top-right', label: 'Top Right', cssProperty: 'border-top-right-radius' },
					{ name: 'bottom-right', label: 'Bottom Right', cssProperty: 'border-bottom-right-radius' },
					{ name: 'bottom-left', label: 'Bottom Left', cssProperty: 'border-bottom-left-radius' }
				]
			},
			'slider': {
				'px': {
					'min': 0,
					'max': 50
				},
				'em': {
					'min': .1,
					'max': 5
				}
			}
		};
	}

}

export { BorderRadius as default };
