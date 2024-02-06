var $ = window.jQuery;

import { MultiSlider } from '../multi-slider';
import template from './template.html';
import './style.scss';

export class Border extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Border Width',
				name: 'border-width',
				units: {
					default: 'px',
					enabled: [ 'px', 'em' ]
				}
			},
			slider: {
				px: {
					step: 0.1,
					min: 0,
					max: 15
				},
				em: {
					min: 0,
					max: 5,
					step: 0.1
				}
			}
		};

		this.borderDirections = [ 'left', 'top', 'right', 'bottom' ];
	}

	/**
	 * Create a control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control.
	 */
	render() {
		let $control;

		super.render();

		this.$typeControl = $( template );

		this.bindEvents();

		$control = this.$typeControl.append( this.$control );

		return $control;
	}

	/**
	 * Bind all events.
	 *
	 * @since 1.0.0
	 */
	bindEvents() {
		this._bindTypeChange();
		this.refreshValues();
		this._setType();
	}

	/**
	 * Set the input type to the type of the target.
	 *
	 * @since 1.0.0
	 */
	_setType() {
		let setting = this._getBorderStyle();

		setting = 'none' !== setting ? setting : '';
		return this.$typeControl
			.find( '.border-type-control input' )
			.filter( '[value="' + setting + '"]' )
			.prop( 'checked', true );
	}

	/**
	 * Get the currently set border style.
	 *
	 * This was added for cross browser support. FF does not return anything for border-style.
	 *
	 * @since 0.8.7
	 *
	 * @return {string} Currently applied style.
	 */
	_getBorderStyle() {
		let style = '';
		let width = {};
		let targetBorderStyle = this.$target.css( 'border-style' );
		for ( let direction of this.borderDirections ) {
			let directionalStyle = this.$target.css( 'border-' + direction + '-style' );
			if ( 'none' !== directionalStyle && directionalStyle ) {
				style = directionalStyle;
				break;
			}
		}

		// If the border style already matches return it.
		if ( targetBorderStyle === style || ( '' === style && 'none' === targetBorderStyle ) ) {
			return style;
		}

		/**
		 * This is used to handle issues where one of the
		 * border directions is set, but none others are.
		 * In this case, the border style needs to be set for
		 * all directions, as well as the current width.
		 */
		$.each( this.sliders, ( direction ) => {
			var $input    = this.sliders[ direction ].$input,
				value     = $input.val();

			width[ direction ] = value + this.$units.filter( ':checked' ).val();
		} );

		this.applyCssRules( {
			'border-style': style + ' ' + style + ' ' + style + ' ' + style,
			'border-top-width': width.top,
			'border-right-width': width.right,
			'border-bottom-width': width.bottom,
			'border-left-width': width.left
		} );

		return style;
	}

	_bindWidthChange() {
		$.each( this.sliders, ( direction ) => {
			this.sliders[ direction].$control.on( 'slide-change', ( e, data ) => {
				this.applyCssRules( {
					'border-style': this.$typeControl.find( 'input:checked' ).val()
				} );
			} );
		} );
	}


	/**
	 * Refresh the values of the input to the values of the target.
	 *
	 * @since 1.0.0
	 */
	refreshValues() {
		let $radio;
		super.refreshValues();
		$radio = this._setType();
		this._toggleWidthControl( $radio.val() );
	}

	/**
	 * Toggle the visibility of the width controls.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} val Current value of the control.
	 */
	_toggleWidthControl( val ) {
		if ( val ) {
			this.$control.show();
		} else {
			this.$control.hide();
		}
	}

	/**
	 * When the border type changes, update the css.
	 *
	 * @since 1.0.0
	 */
	_bindTypeChange() {
		this.$typeControl.find( 'input' ).on( 'change', e => {
			let $this    = $( e.target ),
				val      = $this.val(),
				hasWidth = false;

			$.each( this.sliders, ( direction ) => {
				let $input = this.sliders[ direction ].$input;
				if ( $input.val() > 0 ) {
					hasWidth = true;
					return false;
				}
			} );

			this.applyCssRules( {
				'border-style': val
			} );

			if ( ! hasWidth ) {
				this.applyCssRules( {
					'border-width': 0
				} );
			}

			this._toggleWidthControl( val );
			this.$control.trigger( 'type-change', val );
		} );
	}
}

export { Border as default };
