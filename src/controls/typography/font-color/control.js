import './style.scss';
import template from './template.html';
import { Picker as ColorPicker } from '../../color-picker';
import BrehautColorJs from 'color-js/color';

export class Control {

	/**
	 * Init the class.
	 *
	 * @param {Object} options Options for instantiation.
	 */
	constructor( options ) {
		this.options = options || {};
		this.colorPicker = new ColorPicker;
	}

	/**
	 * Render the control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control Element.
	 */
	render() {
		this._setupColorPicker();

		this.$control = $( _.template( template )() );
		this.$control.find( 'font-color' ).replaceWith( this.colorPicker.$element );

		this.$currentValue = this.$control.find( '.value' );
		this.$editLink = this.$control.find( '.edit-link' );
		this.$colorPreview = this.$control.find( '.color-preview' );
		this.$colorVal = this.$control.find( '[name="font-color"]' );
		this.$picker = this.colorPicker.$element.find( '.bg-color-picker-control.boldgrid-control' );

		this._preset();

		this._setupColorChange();
		this._setupEditClick();
		this._setupInputChange();

		return this.$control;
	}

	/**
	 * Update the UI with color values.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} color Current Color.
	 */
	updateUI( color ) {
		let friendlyName = color.match( /rgb\(/ ) ? BrehautColorJs( color ).toCSSHex() : color;

		this.$currentValue.text( friendlyName );
		this.$colorPreview.css( 'background-color', color );
	}

	/**
	 * When opening control, preset control values.
	 *
	 * @since 1.0.0
	 */
	_preset() {
		const color = this.options.target.css( 'color' );
		this.updateUI( color );
	}

	/**
	 * Bind clicking on the edit link.
	 *
	 * @since 1.0.0
	 */
	_setupEditClick() {
		this.$editLink.on( 'click', ( e ) => {
			e.preventDefault();
			this.$picker.toggle();
		} );
	}

	/**
	 * When the input changes update the UI.
	 *
	 * This is a litle convoluted. The system could jsut update the UI when the color picker
	 * updates the color. Reasoning is that the BoldGrid Post and Page builder overrides
	 * the color picking process. It relies on an input in the control to comminucate the
	 * current selection.
	 *
	 * @since 1.0.0
	 */
	_setupInputChange() {
		this.$colorVal.on( 'change', ( ) => this.updateUI( this.$colorVal.val() ) );
	}

	/**
	 * Bind the handler for color changes.
	 *
	 * @since 1.0.0
	 */
	_setupColorChange() {
		this.colorPicker.$input.iris( 'option', 'change', ( e, ui ) => {
			const color = ui.color.toString();
			this.options.target.css( 'color', color );
			this.$colorVal.val( color ).change();
		} );
	}

	/**
	 * Setup display of the color picker.
	 *
	 * @since 1.0.0
	 */
	_setupColorPicker() {
		this.colorPicker.init( false, _.defaults( {
			defaultColor: '#000000',
			hide: false,
			change: () => {}
		} ) );
	}
}
