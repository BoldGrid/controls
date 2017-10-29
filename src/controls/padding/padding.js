import { MultiSlider } from '../multi-slider';

export class Padding extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Padding',
				name: 'padding',
				units: {
					default: 'px',
					enabled: [ 'px' ]
				},
				sliders: [
					{ name: 'top', label: 'Top', cssProperty: 'padding-top' },
					{ name: 'right', label: 'Right', cssProperty: 'padding-right' },
					{ name: 'bottom', label: 'Bottom', cssProperty: 'padding-bottom' },
					{ name: 'left', label: 'Left', cssProperty: 'padding-left' }
				]
			},
			slider: {
				px: {
					min: 0,
					max: 100
				},
				'%': {
					min: 0,
					max: 100
				},
				em: {
					min: 0.1,
					max: 5
				}
			}
		};
	}
}

export { Padding as default };
