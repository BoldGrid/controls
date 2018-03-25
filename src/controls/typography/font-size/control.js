var $ = window.jQuery;

import { MultiSlider } from '../../multi-slider';

export class Control extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Font Size',
				name: 'font-size',
				linkable: false,
				units: {
					default: 'px',
					enabled: [ 'px', 'em' ]
				},
				sliders: [
					{ name: 'font-size', label: 'Font Size', cssProperty: 'font-size' }
				]
			},
			slider: {
				px: {
					min: 0,
					max: 100,
					step: 1
				},
				em: {
					step: 0.1,
					min: 0,
					max: 10
				}
			}
		};
	}
}
