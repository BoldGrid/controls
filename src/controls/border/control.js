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
	 * Get CSS rules. Override to append style.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} CSS rules.
	 */
	getCssRule() {
		let css = super.getCssRule(),
			style = this._getBorderStyle();

		if ( style ) {
			css += 'border-style: ' + this._getBorderStyle() + ';';
		} else {
			css = 'border: 0;';
		}

		return css;
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
	 * Get the current settings.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Settings for a control.
	 */
	getSettings() {
		let settings = super.getSettings();
		settings.type = this._getBorderStyle();
		return settings;
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
		for ( let direction of this.borderDirections ) {
			let directionalStyle = this.$target.css( 'border-' + direction + '-style' );
			if ( 'none' !== directionalStyle && directionalStyle ) {
				style = directionalStyle;
				break;
			}
		}

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
	 * When the border type changes, update the css.
	 *
	 * @since 1.0.0
	 */
	_bindTypeChange() {
		this.$typeControl.find( 'input' ).on( 'change', e => {
			let $this = $( e.target ),
				val = $this.val();

			this.applyCssRules( {
				'border-style': val
			} );

			this._toggleWidthControl( val );
			this.$control.trigger( 'type-change', val );
			this.events.emit( 'change', this.getSettings() );
		} );
	}
}

export { Border as default };
