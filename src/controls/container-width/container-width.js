import { MultiSlider } from '../multi-slider';

export class ContainerWidth extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Container Width',
				name: 'container-width',
				units: {
					default: 'px',
					enabled: [ 'px', '%' ]
				},
				sliders: [
					{ name: 'width', label: 'Width', cssProperty: 'width' },
					{ name: 'maxWidth', label: 'Max Width', cssProperty: 'max-width' }
				]
			},
			slider: {
				px: {
					min: 0,
					max: 3840,
					step: 1
				},
				'%': {
					min: 0,
					max: 100,
					step: 1
				}
			},
			devicesEnabled: [ 'base', 'large', 'desktop', 'tablet' ],
			defaults: [
				{
					media: [ 'base', 'large', 'desktop', 'tablet' ],
					unit: '%',
					isLinked: true,
					values: {
						maxWidth: 100,
					}
				},
			]
		};
	}
}

export { ContainerWidth as default };
