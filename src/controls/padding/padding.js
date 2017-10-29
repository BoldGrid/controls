import { MultiSlider } from '../multi-slider';

export class Padding extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Padding',
				name: 'padding',
				units: {
					default: 'em',
					enabled: [ 'px', 'em', '%' ]
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
					max: 100,
					step: 1
				},
				'%': {
					min: 0,
					max: 20,
					step: 0.1
				},
				em: {
					min: 0,
					max: 5,
					step: 0.1
				}
			}
		};
	}
}

export { Padding as default };
