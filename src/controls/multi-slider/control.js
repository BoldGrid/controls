var $ = window.jQuery;
import './style.scss';
import { Slider } from '../slider';
import { Conversion } from './conversion';
import template from './template.html';
import config from './config.js';
import deepmerge from 'deepmerge';
import refreshSvg from './img/refresh.svg';
import linkSvg from './img/link.svg';
import { EventEmitter } from 'eventemitter3';
import { Control as DeviceSelection } from './device-selection/control';

export class MultiSlider {
	constructor( options ) {
		this.options = options || {};

		this.$control = null;
		this.slidersLinked = false;
		this.$target = this.options.target;
		this.template = _.template( template );
		this.settings = {};
		this.events = new EventEmitter();

		if ( ! this.$target ) {
			this.$target = $( '<div>' ).hide();
			$( 'body' ).append( this.$target );
		}
	}

	/**
	 * Set the current target.
	 *
	 * @since 1.0.0
	 *
	 * @param {jQuery} $target Target to update.
	 */
	setTarget( $target ) {
		this.$target = $( $target );
		this.refreshValues();
	}

	/**
	 * Get the current settings.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Settings for a control.
	 */
	getSettings() {
		return {
			unit: this.getUnit(),
			slidersLinked: this.slidersLinked,
			values: this.getValues(),
			css: this.createCss()
		};
	}

	/**
	 * Create css string if a selecor is passed.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} [description]
	 */
	createCss() {
		let css = false;
		if ( this.controlOptions.control.selectors && this.controlOptions.control.selectors.length ) {
			css = '';
			css += this.controlOptions.control.selectors.join( ',' ) + '{';
			css += this.getCssRule();
			css += '}';

			// If a device selection is enabled, add media queries.
			if ( this.deviceSelection ) {
				css = this.deviceSelection.addMediaQuery( css );
			}
		}

		return css;
	}

	/**
	 * Get the current device selection. Handles devices feature disabled.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Current Device.
	 */
	getSelectedDevice() {
		return this.deviceSelection ? this.deviceSelection.getSelectedValue() : 'all';
	}

	/**
	 * Get the CSS definitions.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} css riles.
	 */
	getCssRule() {
		let cssRule = '';

		for ( let slider of this.controlOptions.control.sliders ) {
			let sliderValue = this.sliders[ slider.name ].$slider.slider( 'option', 'value' );

			cssRule += slider.cssProperty + ':' + sliderValue + this.getUnit() + ';';
		}

		return cssRule;
	}

	/**
	 * Merge the default configurations with any requested by a child class.
	 *
	 * @since 1.0.0
	 */
	mergeDefaultConfigs() {
		this.controlOptions = deepmerge( config.defaults, this.controlOptions, {
			arrayMerge: ( destination, source ) => source
		} );

		this.options.target = null;
		this.controlOptions = deepmerge( this.controlOptions, this.options, {
			arrayMerge: ( destination, source ) => source
		} );

	}

	/**
	 * Return a jQuery control.
	 *
	 * @since 1.0
	 *
	 * @return {jQuery} Control.
	 */
	render() {
		this.mergeDefaultConfigs();

		this.controlOptions.svg = {};
		this.controlOptions.svg.link = linkSvg;
		this.controlOptions.svg.refresh = refreshSvg;

		this.$control = $( this.template( this.controlOptions ) );
		this.$sliderGroup = this.$control.find( '.slider-group' );
		this.$units = this.$control.find( '.unit' );
		this.$revert = this.$control.find( '.refresh' );

		// Add the device controls.
		if ( this.controlOptions.responsive ) {
			this.deviceSelection = new DeviceSelection( {
				sizes: this.controlOptions.responsive
			} );

			this._setupDeviceChange();
		}

		this._bindUnits();
		this.setUnits( this._getDefaultUnits() );

		// Create sliders and attach them to the template.
		this._createSliders();
		this.$links = this.$control.find( '.link' );

		if ( this.options.defaults ) {
			this.applySettings( this.options.defaults );
		}

		this._storeDefaultValues();
		this._setDefaultLinkedState();
		this._bindLinked();
		this._bindRevert();
		this.$control.rendered = true;

		return this.$control;
	}

	/**
	 * Update the settings with latest.
	 *
	 * @since 1.0.0
	 */
	_updateSettings() {
		this.settings[ this.getSelectedDevice() ] = this.getSettings();
	}

	/**
	 * When the user changes devices, remeber their settings.
	 *
	 * @since 1.0.0
	 */
	_setupDeviceChange() {
		let $deviceSelection = this.deviceSelection.render();
		this.$control.find( 'device-selection' ).replaceWith( $deviceSelection );

		this.deviceSelection.$inputs.on( 'change', () => {
			const selectedDevice = this.deviceSelection.getSelectedValue();
			let settings = this.defaultValues;

			// If the user has customized a device, prepoulate.
			if ( this.settings[ selectedDevice ] ) {
				settings = this.settings[ selectedDevice ];

			// If the user has customized all, but not this device, prepoluate all.
			} else if ( this.settings.all ) {
				settings = this.settings.all;
			}

			this.silentApplySettings( settings );

			// Trigger slider device change event.
			this.events.emit( 'deviceChange', selectedDevice );
		} );
	}

	/**
	 * Apply settings without triggering change events.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} settings Settings.
	 */
	silentApplySettings( settings ) {
		this.slideChangeDisabled = true;
		this.applySettings( settings );
		this.slideChangeDisabled = false;
	}

	/**
	 * Apply the settings to the control.
	 *
	 * @since 1.0
	 *
	 * @param  {object} settings Settings.
	 */
	applySettings( settings ) {
		this.setUnits( settings.unit );

		for ( let key in settings.values ) {
			let value = settings.values[key];

			if ( this.sliders[key] )  {
				this.sliders[key].$slider.slider( 'option', 'value', value );
			}
		}
	}

	/**
	 * Update the target.
	 *
	 * @since 1.0
	 *
	 * @param  {jQuery} $target New Target.
	 */
	updateTarget( $target ) {
		this.$target = $target;
	}

	/**
	 * Set the unit to use.
	 *
	 * @since 1.0
	 *
	 * @param {string} unit Units.
	 */
	setUnits( unit ) {
		this.$units
			.filter( '[value="' + unit + '"]' )
			.prop( 'checked', true )
			.change();
	}

	/**
	 * Get the currently selected units.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Selected units.
	 */
	getUnit() {
		return this.$units.filter( ':checked' ).val();
	}

	/**
	 * Get the values.
	 *
	 * @since 1.0
	 *
	 * @return {Object} Current values for each direction.
	 */
	getValues() {
		let values = {};

		for ( let name in this.sliders ) {
			values[name] = this.sliders[name].$slider.slider( 'value' ) || 0;
		}

		return values;
	}

	/**
	 * Get a sliders configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return {Object} Slider config.
	 */
	getSliderConfig( slider ) {
		let settings = this.controlOptions.slider[this.selectedUnit],
			value = this.convertToSelectedUnit( this.$target.css( slider.cssProperty ) );

		settings.value = value;
		return settings;
	}

	/**
	 * Convert the JS pixel value to perctenage or ems.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} rawValue JS computed value.
	 * @return {integer}          New Value.
	 */
	convertToSelectedUnit( computedValue ) {
		let pixelValue = parseInt( computedValue ),
			converted = pixelValue;

		if ( '%' === this.selectedUnit ) {
			converted = new Conversion().pxToPercentage( pixelValue, this.$target.parent() );
		} else if ( 'em' === this.selectedUnit ) {
			converted = new Conversion().pxToEm( pixelValue, this.$target.css( 'font-size' ) );
		}

		return converted;
	}

	/**
	 * Get the default unit set, takes into consideration defaults object.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Unit.
	 */
	_getDefaultUnits() {
		let defaultUnit = this.controlOptions.control.units.default;
		if ( this.options.defaults && this.options.defaults.unit ) {
			defaultUnit = this.options.defaults.unit;
		}

		return defaultUnit;
	}

	/**
	 * Create sliders and attach them to the template.
	 *
	 * @since 1.0.0
	 */
	_createSliders() {
		this.sliders = {};

		for ( let slider of this.controlOptions.control.sliders ) {
			let sliderControl;

			slider.uiSettings = this.getSliderConfig( slider );
			if ( this.options.defaults && this.options.defaults.values && this.options.defaults.values[slider.name] ) {
				slider.uiSettings.value = this.options.defaults.values[slider.name];
			}

			sliderControl = new Slider( $.extend( true, {}, slider ) );

			sliderControl.render();

			this.$sliderGroup.append( sliderControl.$control );
			sliderControl.$input.after(
				'<a class="link" href="#" title="Link all sliders">' + linkSvg + '</a>'
			);

			this.sliders[slider.name] = sliderControl;

			this._bindSliderChange( sliderControl );
		}
	}

	/**
	 * Save the default values for reverts.
	 *
	 * @since 1.0
	 */
	_storeDefaultValues() {
		this.defaultValues = {
			unit: this._getDefaultUnits(),
			values: this.getValues()
		};
	}

	/**
	 * Bind reverting changes to original.
	 *
	 * @since 1.0
	 */
	_bindRevert() {
		this.$revert.on( 'click', event => {
			event.preventDefault();
			this.applySettings( this.defaultValues );
		} );
	}

	/**
	 * Bind changing of units.
	 *
	 * @since 1.0
	 */
	_bindUnits() {
		this.$control.find( '.unit' ).on( 'change', e => {
			let $target = $( e.target );

			this.selectedUnit = $target.val();
			if ( this.sliders ) {
				this._unitsChanged();
			}
		} );
	}

	/**
	 * Update slider values WITH triggering css updates.
	 *
	 * @since 1.0.0
	 */
	_unitsChanged() {
		this.linkedDisabled = true;

		this._resetOptions();

		setTimeout( () => {
			this.linkedDisabled = false;
		} );
	}

	/**
	 * Update slider values WITHOUT triggering css updates.
	 *
	 * @since 1.0.0
	 */
	refreshValues() {
		this.slideChangeDisabled = true;

		this._resetOptions();

		setTimeout( () => {
			this.slideChangeDisabled = false;
		} );
	}

	/**
	 * Pass in all option values.
	 *
	 * @since 1.6
	 */
	_resetOptions() {
		for ( let slider of this.controlOptions.control.sliders ) {
			let options = this.getSliderConfig( slider );
			this.sliders[slider.name].$slider.slider( 'option', options );
		}
	}

	/**
	 * Set the default slider state.
	 *
	 * @since 1.0.0
	 */
	_setDefaultLinkedState() {
		if ( this.controlOptions.control.linkable.enabled ) {
			if ( this.options.defaults && 'undefined' !== typeof this.options.defaults.slidersLinked ) {
				this.slidersLinked = !! this.options.defaults.slidersLinked;
			} else if ( this.controlOptions.control.linkable.isLinked ) {
				let values = _.unique( _.values( this.getValues() ) );
				this.slidersLinked = 1 === values.length;
			}
		}
	}

	/**
	 * Bind the user linking the controls.
	 *
	 * @since 1.0.0
	 */
	_bindLinked() {
		if ( this.slidersLinked ) {
			this.$links.addClass( 'linked' );
		}

		this.$links.on( 'click', event => {
			let $target = $( event.target ).closest( 'a' );
			event.preventDefault();
			$target.toggleClass( 'linked' );
			this.slidersLinked = $target.hasClass( 'linked' );
			this.$control.trigger( 'linked', { isLinked: this.slidersLinked } );
			this._triggerChangeEvent();
		} );
	}

	/**
	 * Updated linked sliders.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Slider} updatedSlider Slider that was updated by user.
	 */
	_updateLinked( updatedSlider ) {
		if ( this.slidersLinked && ! this.linkedDisabled ) {
			this.linkedDisabled = true;

			_.each( this.sliders, slider => {
				if ( updatedSlider !== slider ) {
					slider.$slider.slider( 'value', updatedSlider.$slider.slider( 'value' ) );
				}
			} );
		}

		setTimeout( () => {
			this.linkedDisabled = false;
		} );
	}

	/**
	 * Update the css that a single slider controls
	 *
	 * @since 1.0.0
	 *
	 * @param  {Slider} slider Slider class.
	 */
	_updateCss( slider ) {
		let property = {};
		property[slider.options.cssProperty] = slider.$slider.slider( 'value' ) + this.selectedUnit;
		this.applyCssRules( property );
	}

	applyCssRules( property ) {
		this.$target.css( property );
	}

	/**
	 * Update css as the control fires updates.
	 *
	 * @since 1.0.0
	 */
	_bindSliderChange( slider ) {
		slider.$control.on( 'slide-change', ( e, data ) => {
			if ( ! this.slideChangeDisabled ) {
				this._updateLinked( slider );
				this._updateCss( slider );
				this._triggerChangeEvent();
			}
		} );
	}

	/**
	 * Trigger the change event only after setup is done.
	 *
	 * @since 1.0.0
	 */
	_triggerChangeEvent() {
		if ( this.$control.rendered ) {
			this._updateSettings();
			this.events.emit( 'change', this.settings );
		}
	}
}

export { MultiSlider as default };
