import { MultiSlider } from '@boldgrid/controls/src/controls/multi-slider';

export class ColWidth
 extends MultiSlider {
	constructor( options ) {
		super( options );
		console.log( options );
		this.controlOptions = {
			control: {
				title: 'Column Widths',
				name: 'column-widths',
				units: {
					default: 'col',
					enabled: [ 'col', '%' ]
				},
				sliders: [
					{ name: 'top', label: 'Top', cssProperty: 'margin-top' },
					{ name: 'right', label: 'Right', cssProperty: 'margin-right' },
					{ name: 'bottom', label: 'Bottom', cssProperty: 'margin-bottom' },
					{ name: 'left', label: 'Left', cssProperty: 'margin-left' }
				]
			},
			slider: {
				col: {
					min: 1,
					max: 12,
					step: 1
				},
				'%': {
					min: 1,
					max: 100,
					step: 8.33
				}
			}
		};
	}
}

export { ColWidth as default };
