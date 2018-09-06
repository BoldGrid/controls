var $ = window.jQuery;

import { MultiSlider } from '../../multi-slider';

export class Control extends MultiSlider {
	constructor( { ...options } ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Line Height',
				name: 'line-height',
				linkable: false,
				units: {
					default: 'em',
					enabled: [ 'px', 'em' ]
				},
				sliders: [
					{ name: 'line-height', label: 'Line-height', cssProperty: 'line-height' }
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
					min: .5,
					max: 5
				}
			}
		};
	}
}
