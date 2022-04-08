var $ = window.jQuery;

import { MultiSlider } from '../multi-slider';
import template from './template.html';
import './style.scss';

export class Outline extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Outline Width',
				name: 'outline-width',
				linkable: false,
				units: {
					default: 'px',
					enabled: [ 'px', 'em' ]
				},
				sliders: [
					{
						name: 'outline-width',
						label: 'width',
						cssProperty: 'outline-width',
						uiSettings: {
							min: 0,
							max: 30,
							step: 0.1,
							value: 3
						}
					},
					{
						name: 'outline-offset',
						label: 'offset',
						cssProperty: 'outline-offset',
						uiSettings: {
							min: -30,
							max: 30,
							step: 0.1,
							value: -15
						}
					}
				]
			},
			sliderConfig: {
				'outline-width': {
					min: 0,
					max: 15,
					value: 3
				},
				'outline-offset': {
					min: -30,
					max: 30,
					value: -15
				}
			},
			slider: {
				px: {
					step: 0.1,
					min: -30,
					max: 30
				},
				em: {
					min: -10,
					max: 10,
					step: 0.1
				}
			}
		};
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
		let setting = this._getOutlineStyle();

		console.log( {
			method: '_setType',
			setting: setting
		} );

		if ( 'undefined' === typeof setting ) {
			setting = 'none';
		}

		setting = 'none' !== setting ? setting : '';
		return this.$typeControl
			.find( '.outline-type-control input' )
			.filter( '[value="' + setting + '"]' )
			.prop( 'checked', true );
	}

	/**
	 * Get the currently set outline style.
	 *
	 * This was added for cross browser support. FF does not return anything for outline-style.
	 *
	 * @since 0.8.7
	 *
	 * @return {string} Currently applied style.
	 */
	_getOutlineStyle() {
		let style = this.$target.attr( 'data-outline-style' );

		return style;
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
	 * Setup outline color change event.
	 *
	 * @since 1.6.0
	 */
	_setColor() {
		var value = BG.Panel.$element.find( 'input[name=generic-outline-color]' ).val(),
			type = this.$input.attr( 'data-type' );

		BG.CONTROLS.Color.resetOutlineClasses( this.$target );

		if ( ! value ) {
			BG.Controls.addStyle( this.$target, 'outline-color', '#2c3338' );
		} else if ( 'class' === type ) {
			this.$target.addClass( BG.CONTROLS.Color.getColorClass( 'outline-color', value ) );
		} else {
			BG.Controls.addStyle( this.$target, 'outline-color', value );
		}

		BG.Panel.$element.trigger(
			BG.Panel.currentControl.name + '-outline-color-change'
		);
	}

	/**
	 * When the outline type changes, update the css.
	 *
	 * @since 1.0.0
	 */
	_bindTypeChange() {
		this.$typeControl.find( 'input' ).on( 'change', e => {
			let $this = $( e.target ),
				val = $this.val();

			this.applyCssRules( {
				'outline-style': val
			} );

			console.log( {
				method: '_bindTypeChange',
				target: this.$target
			} );

			this.$target.attr( 'data-outline-style', val );

			this._setColor();

			this._toggleWidthControl( val );
			this.$control.trigger( 'type-change', val );
		} );
	}
}

export { Outline as default };
