import $ from 'jquery';
import template from './template.html';
import './style.scss';
import '../util';

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

		this.$select = $control.find( 'select' ).select2( this.selectStyleConfig );

		this._preset();
		this._onChange();

		return $control;
	}

	/**
	 * Get the current CSS value of the item.
	 *
	 * Handles the differnce between no inline styles and calculated values.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Current Value.
	 */
	getCssValue() {
		let styleAttr = this.options.target.attr( 'style' ) || '',
			propExists = !! ( styleAttr.match( this.controlOptions.property ) || [] ).length;

		return propExists ? this.options.target.css( this.controlOptions.property ) : '';
	}

	/**
	 * When the control loads. Set the value of the select item.
	 *
	 * @since 1.0.0
	 */
	_preset() {
		const currentValue = this.getCssValue(),
			supportedProp = this.controlOptions.options.find( ( setting ) => {
				return ! currentValue || ( setting.value && currentValue.match( setting.value ) );
			} );

		if ( supportedProp ) {
			this.$select.val( supportedProp.value ).change();
		}
	}

	/**
	 * Bind the change event.
	 *
	 * @since 1.0.0
	 */
	_onChange() {
		this.$select.on( 'change', () => {
			window.BOLDGRID.CONTROLS.addStyle( this.options.target, this.controlOptions.property, this.$select.val() );
		} );
	}
}
