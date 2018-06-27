var $ = window.jQuery;

import { MultiSlider } from '../multi-slider';
import template from './template.html';
import './style.scss';

export class Border extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Border',
				name: 'border-width',
				borderStyle: {
					default: ''
				},
				units: {
					enabled: [ 'px', 'em' ]
				}
			},
			setting: {
				css: '',
				settings: [
					{
						media: [ 'base', 'phone', 'tablet', 'desktop', 'large' ],
						unit: 'px',
						isLinked: false,
						type: '',
						values: {
							top: 0,
							right: 0,
							bottom: 0,
							left: 0
						}
					}
				]
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

		this.$typeControl = $( template );
		super.render();
		this.bindEvents();
		this._sortControls();

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
	getCssRule( settings ) {
		let css = super.getCssRule( settings ),
			type = settings.type || this._getBorderStyle();

		if ( type ) {
			css += 'border-style: ' + type + ';';
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

		// this.refreshValues();
		this._setType( this._getBorderStyle() );
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
	 * Arange the controls.
	 *
	 * @since 1.0.0
	 */
	_sortControls() {
		this.$sliderGroup = this.$control.find( '.slider-group' );
		this.$sliderGroup
			.before( this.$typeControl.find( '.border-type-control' ) )
			.prepend( '<h4 class="control-name">Width</h4>' );
	}

	/**
	 * Save the default values for reverts.
	 *
	 * @since 1.0
	 */
	_storeDefaultValues() {
		super._storeDefaultValues();
		this.defaultValues.type = this._getDefaultBorderStyle();
	}

	/**
	 * Given an object of settings, change the inputs.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} settings Settings for control.
	 */
	applySettings( settings ) {
		super.applySettings( settings );
		this._setType( settings.type ).change();
		this._toggleWidthControl( settings.type );
		this.applyCssRules( { 'border-style': settings.type } );
	}

	/**
	 * Get the default borer style to use.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Default border style.
	 */
	_getDefaultBorderStyle() {
		let defaultBorderStyle = this._getBorderStyle();

		if ( this.options.defaults && this.options.defaults.type ) {
			defaultBorderStyle = this.options.defaults.type;
		}

		return defaultBorderStyle;
	}

	/**
	 * Set the input type to the type of the target.
	 *
	 * @since 1.0.0
	 */
	_setType( setting ) {
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
		$radio = this._setType( this._getBorderStyle() );
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
			this.$sliderGroup.show();
		} else {
			this.$sliderGroup.hide();
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
			this._triggerChangeEvent();
		} );
	}
}

export { Border as default };
