import { Select } from '../../select';

export class Control extends Select {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			title: 'Text Decoration',
			name: 'text-decoration',
			property: 'text-decoration',
			options: [
				{
					value: '',
					label: 'Default'
				},
				{
					value: 'underline',
					label: 'Underline'
				},
				{
					value: 'overline',
					label: 'Overline'
				},
				{
					value: 'line-through',
					label: 'Line Through'
				},
				{
					value: 'none',
					label: 'None'
				}
			]
		};
	}
}
