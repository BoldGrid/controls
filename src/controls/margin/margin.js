import { MultiSlider } from '../multi-slider';

export class Margin extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Margin',
				name: 'margin',
				units: {
					default: 'px',
					enabled: [ 'px', 'em', '%' ]
				},
				sliders: [
					{ name: 'top', label: 'Top', cssProperty: 'margin-top' },
					{ name: 'right', label: 'Right', cssProperty: 'margin-right' },
					{ name: 'bottom', label: 'Bottom', cssProperty: 'margin-bottom' },
					{ name: 'left', label: 'Left', cssProperty: 'margin-left' }
				]
			},
			slider: {
				px: {
					min: -250,
					max: 250,
					step: 1
				},
				'%': {
					min: -100,
					max: 100,
					step: 0.1
				},
				em: {
					min: -100,
					max: 100,
					step: 1
				}
			}
		};
	}
}

export { Margin as default };
