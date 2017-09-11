var $ = window.jQuery;

import BrehautColorJs from 'color-js/color';

export class Picker {
	init( $target, options ) {
		this.options = _.defaults( options, {
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

		this.$colorPickerWrapper = $target;
		this.$input = this.createColorInput();
		this.setupIris();
		this.setupAutoCollapse();
	}

	setupAutoCollapse() {
		$( 'body' ).on( 'click', () => {
			this.hide();
			this.$colorPickerWrapper.addClass();
		} );

		this.$colorPickerWrapper.on( 'click', e => {
			e.stopPropagation();
		} );
	}

	hide() {
		if ( $.contains( document, this.$input[0] ) ) {
			this.$colorPickerWrapper.hide();
			this.$colorPickerWrapper.attr( 'data-state', 'hidden' );
			this.$input.iris( 'hide' );
		}
	}

	show() {
		this.$colorPickerWrapper.show();
		this.$colorPickerWrapper.attr( 'data-state', 'visible' );
		this.$input.iris( 'show' );
	}

	setupIris() {
		this.$input.iris( this.options );
		this.createPickerPalettes();
		this.bindCustomPalettes();
	}

	createColorInput() {
		let $input = $( '<input type="text" data-alpha="true" class="pluto-color-control color-control-input"/>' );
		$input.val( this.$colorPickerWrapper.attr( 'data-value' ) ).change();
		this.$colorPickerWrapper.html( $input );
		$input.wrapAll( '<div class="custom-input"></div>' );

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

		$paletteWrapper.prependTo( this.$colorPickerWrapper.find( '.iris-picker-inner' ) );

		// Repaint Picker.
		this.$input.iris( 'option', 'width', this.options.width );
	}

	/**
	 * When the user click on a custom color, change the color of the picker.
	 *
	 * @since 1.1.1
	 */
	bindCustomPalettes() {
		this.$colorPickerWrapper.find( '.secondary-colors .iris-palette' ).on( 'click', e => {
			this.setColor( $( e.target ).css( 'background-color' ) );
		} );
	}

	setColor( cssColor ) {
		let colorObject = BrehautColorJs( cssColor );
		this.$input.iris( 'color', colorObject.toString() );
	}
}
