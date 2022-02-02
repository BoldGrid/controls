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
					enabled: [ 'px' ]
				},
				sliders: [
					{ name: 'width', label: 'Width', cssProperty: 'width' },
					{ name: 'maxWidth', label: 'Max Width', cssProperty: 'max-width' }
				],
				defaults: [
					{
						media: [ 'base', 'desktop', 'large' ],
						unit: 'px',
						isLinked: false,
						values: {
							width: 1170,
							maxWidth: 1170
						}
					},
					{
						media: [ 'tablet' ],
						unit: 'px',
						isLinked: false,
						values: {
							width: 970,
							maxWidth: 970
						}
					},
					{
						media: [ 'phone' ],
						unit: 'px',
						isLinked: false,
						values: {
							width: 750,
							maxWidth: 750
						}
					}
				]
			},
			slider: {
				px: {
					min: 0,
					max: 3840,
					step: 5
				}
			}
		};
	}
}

export { ContainerWidth as default };
