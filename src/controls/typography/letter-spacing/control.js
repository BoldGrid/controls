var $ = window.jQuery;

import { MultiSlider } from '../../multi-slider';

export class Control extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Letter Spacing',
				name: 'letter-spacing',
				linkable: false,
				units: {
					default: 'em',
					enabled: [ 'px', 'em' ]
				},
				sliders: [
					{ name: 'letter-spacing', label: 'Letter Spacing', cssProperty: 'letterSpacing' }
				]
			},
			slider: {
				px: {
					min: -3,
					max: 30,
					step: 0.5
				},
				em: {
					step: 0.1,
					min: -0.3,
					max: 3
				}
			}
		};
	}
}
