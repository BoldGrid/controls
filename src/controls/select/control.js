import $ from 'jquery';
import template from './template.html';
import './style.scss';

export class Control {
	constructor( options ) {
		this.options = options;

		this.selectStyleConfig = {
			minimumResultsForSearch: 10
		};

		this.controlOptions = {
			title: 'Sample Title',
			name: 'sample-name',
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
				}
			]
		};
	}

	/**
	 * Render the select options.
	 *
	 * @since 1.0.0
	 *
	 * @return {$} Control.
	 */
	render() {
		const $control = $( _.template( template )( {
			controlOptions: this.controlOptions
		} ) );

		this.selectStyleConfig.dropdownParent = $control;
		this.$select = $control.find( 'select' ).select2( this.selectStyleConfig );

		this._onChange();

		return $control;
	}

	/**
	 * Bind the change event.
	 *
	 * @since 1.0.0
	 */
	_onChange() {
		this.$select.on( 'change', () => {
			this.options.target.css( this.controlOptions.property, this.$select.val() );
		} );
	}
}
