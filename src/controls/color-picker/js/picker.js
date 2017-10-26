var $ = window.jQuery;

import BrehautColorJs from 'color-js/color';
import '../style.scss';

export class Picker {
	init( $target, options ) {
		this.options = _.defaults( options || {}, {
			clear: false,
			width: 255,
			mode: 'hsv',
			type: 'full',
			slider: 'horizontal',
			hide: true,
			defaultColor: false,
			palettes: true,
			secondaryPalette: []
		} );

		this.$element = $target || $( '<div>' );
		this.$input = this.createColorInput();
		this.setupIris();

		if ( options.hide ) {
			this.setupAutoCollapse();
		}

		return this;
	}

	/**
	 * Auto collpase the picker when clicking outside of it's context.
	 *
	 * @since 1.0.0
	 */
	setupAutoCollapse() {
		$( 'body' ).on( 'click', () => {
			this.hide();
			this.$element.addClass();
		} );

		this.$element.on( 'click', e => e.stopPropagation() );
	}

	/**
	 * Hide the picker.
	 *
	 * @since 1.0.0
	 */
	hide() {
		if ( $.contains( document, this.$input[0] ) ) {
			this.$element.hide();
			this.$element.attr( 'data-state', 'hidden' );
			this.$input.iris( 'hide' );
		}
	}

	/**
	 * Show the picker.
	 *
	 * @since 1.0.0
	 */
	show() {
		this.$element.show();
		this.$element.attr( 'data-state', 'visible' );
		this.$input.iris( 'show' );
	}

	/**
	 * Bind events for the picker.
	 *
	 * @since 1.0.0
	 */
	setupIris() {
		this.$input.iris( this.options );
		this.createPickerPalettes();
		this.bindCustomPalettes();
	}

	/**
	 * Create an input to use for the color control.
	 *
	 * @since 1.0.0
	 *
	 * @return {input} Input.
	 */
	createColorInput() {
		let $input = $( '<input type="text" data-alpha="true" class="pluto-color-control color-control-input"/>' );
		$input.val( this.$element.attr( 'data-value' ) ).change();
		this.$element.html( $input );
		$input.wrapAll( '<div class="custom-input bg-color-picker-control"></div>' );

		return $input;
	}

	/**
	 * Create a set of squares to display the users current colors on the side of the color picker
	 *
	 * @since 1.1.1
	 */
	createPickerPalettes() {
		let $paletteWrapper = $( '<div class="secondary-colors"></div>' );

		for ( let i = 0; i < this.options.secondaryPalette.length; i++ ) {
			$paletteWrapper.append( '<a class="iris-palette" tabindex="0"></a>' );
		}

		$paletteWrapper.prependTo( this.$element.find( '.iris-picker-inner' ) );

		// Repaint Picker.
		this.$input.iris( 'option', 'width', this.options.width );
	}

	/**
	 * When the user click on a custom color, change the color of the picker.
	 *
	 * @since 1.1.1
	 */
	bindCustomPalettes() {
		this.$element.find( '.secondary-colors .iris-palette' ).on( 'click', e => {
			this.setColor( $( e.target ).css( 'background-color' ) );
		} );
	}

	/**
	 * Set the current color.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} cssColor Color requested.
	 */
	setColor( cssColor ) {
		let colorObject = BrehautColorJs( cssColor );
		this.$input.iris( 'color', colorObject.toString() );
	}
}
