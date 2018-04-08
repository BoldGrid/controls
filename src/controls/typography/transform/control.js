import { Select } from '../../select';

export class Control extends Select {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			title: 'Text Transform',
			name: 'text-transform',
			property: 'text-transform',
			options: [
				{
					value: '',
					label: 'Default'
				},
				{
					value: 'uppercase',
					label: 'Uppercase'
				},
				{
					value: 'lowercase',
					label: 'Lowercase'
				},
				{
					value: 'capitalize',
					label: 'Capitalize'
				},
				{
					value: 'none',
					label: 'Normal'
				}
			]
		};
	}
}
