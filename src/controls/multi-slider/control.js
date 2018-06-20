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
		this.mediaOrder = [ 'base', 'phone', 'tablet', 'desktop', 'large' ];
		this.settings = {};
		this.events = new EventEmitter();

		if ( ! this.$target ) {
			this.$target = $( '<div>' ).hide();
			$( 'body' ).append( this.$target );
			this.$target.detach();
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
		return this.deviceSelection ? this.deviceSelection.getSelectedValue() : 'base';
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
		this._saveConfigurationDefaults();
		this._saveConfigurationInitial();

		this._setSvgSettings();
		this._createDOMElements();
		this._setupDevices();
		this._setupDelete();

		// If defaults were provided store them as the current values.
		if ( this.options.defaults ) {
			this.settings = $.extend( true, {}, this.options.defaults );
		}

		this._bindUnits();

		// Create sliders and attach them to the template.
		this._createSliders();
		this._setupLinks();

		// Apply initial settings for the control, past saved settings or config defaults.
		this.applySettings( this.configInitial.media.base );

		// Setup the revert process.
		this._storeDefaultValues();
		this._bindRevert();

		this.$control.rendered = true;

		return this.$control;
	}

	/**
	 * The intitial configuration loaded when the user renders the control.
	 *
	 * We use this when the user clicks on the revert button. We've merged any
	 * saved settings with the controls defaults.
	 *
	 * @since 1.0.0
	 */
	_saveConfigurationInitial() {
		let savedValues = {},
			configInitial = { css: '', media: {} };

		if ( this.options.defaults && this.options.defaults.media ) {
			savedValues = this.options.defaults.media;
		}
		for ( let [ mediaType, value ] of Object.entries( this.configDefaults.media ) ) {
			configInitial.media[ mediaType ] = savedValues[ mediaType ] || value;
		}

		this.configInitial = configInitial;
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
		this._updateLinkedStatus( true === settings.slidersLinked );

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
		this.selectedUnit = unit;
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
	 * An overridable method used to apply styles to a target.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} property Styles for object
	 */
	applyCssRules( property ) {
		this.$target.css( property );
	}

	/**
	 * Set the default link and setup events.
	 *
	 * @since 1.0.0
	 */
	_setupLinks() {
		this.$links = this.$control.find( '.link' );

		this._bindLinked();
	}

	/**
	 * Setup device support.
	 *
	 * @since 1.0.0
	 */
	_setupDevices() {
		if ( this.controlOptions.responsive ) {
			this.deviceSelection = new DeviceSelection( {
				sizes: this.controlOptions.responsive
			} );

			this._setupDeviceChange();
		}
	}

	/**
	 * Create required DOM elements.
	 *
	 * @since 1.0.0
	 */
	_createDOMElements() {
		this.$control = $( this.template( this.controlOptions ) );
		this.$sliderGroup = this.$control.find( '.slider-group' );
		this.$units = this.$control.find( '.unit' );
		this.$revert = this.$control.find( '.undo' );
		this.$deleteSaved = this.$control.find( '.delete-saved .remove' );
	}

	/**
	 * Add svg elements to configs.
	 */
	_setSvgSettings() {
		this.controlOptions.svg = {};
		this.controlOptions.svg.link = linkSvg;
		this.controlOptions.svg.refresh = refreshSvg;
	}

	/**
	 * Update the settings with latest.
	 *
	 * @since 1.0.0
	 */
	_updateSettings() {
		this.settings.media = this.settings.media || {};
		this.settings.media[ this.getSelectedDevice() ] = this.getSettings();
		this.settings.css = this._consolidateMediaCss();
	}

	/**
	 * Setup the delete saved setting button.
	 *
	 * @since 1.0.0
	 */
	_setupDelete() {
		this.$deleteSaved.on( 'click', ( e ) => {
			e.preventDefault();

			// Apply the configured defaults (not loaded changes).
			this.resetDeviceSelection();
			this.applySettings( this.configDefaults.media.base );

			// Delete saved Settings.
			this.settings = {};

			// Trigger Delete Event.
			this.events.emit( 'deleteSettings' );
		} );
	}

	/**
	 * Merge the css values of each device into 1 value.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Media CSS
	 */
	_consolidateMediaCss() {
		let css = '';

		for ( const mediaType of this.mediaOrder ) {
			if ( this.settings.media[ mediaType ] ) {
				css += this.settings.media[ mediaType ].css;
			}
		}

		return css;
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
			let settings = this.configDefaults.media.base;

			// If the user has customized a device, prepoulate.
			if ( this.settings.media && this.settings.media[ selectedDevice ] ) {
				settings = this.settings.media[ selectedDevice ];
			} else if ( this.settings.media && this.settings.media.base ) {
				settings = this.settings.media.base;
			}

			this.silentApplySettings( settings );

			// Trigger slider device change event.
			this.events.emit( 'deviceChange', selectedDevice );
		} );
	}

	/**
	 * Get the default unit set, takes into consideration defaults object.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Unit.
	 */
	_getDefaultUnits() {
		let defaultUnit = this.configDefaults.media.base.unit,
			baseDefault = this._getBaseDefault();

		if ( baseDefault && baseDefault.unit ) {
			defaultUnit = baseDefault.unit;
		}

		return defaultUnit;
	}

	/**
	 * Use the default settings to populate a customization object that can be used
	 * for restoring to factory settings.
	 *
	 * @since 1.0.0
	 */
	_saveConfigurationDefaults() {
		let configurationDefaults = this.controlOptions.setting;

		let config = {};
		config.css = '';
		config.media = {};
		for ( let setting of configurationDefaults.settings ) {
			for ( let media of setting.media ) {
				let mediaConfig = { ...setting };

				mediaConfig.css = '';
				mediaConfig.slidersLinked = setting.isLinked;

				delete mediaConfig.media;
				delete mediaConfig.slidersLinked;

				config.media[ media ] = mediaConfig;
			}
		}

		// Todo if not all devices, defined populate them with 0

		this.configDefaults = config;
	}

	/**
	 * Get the default settings passed for the base media type.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Base Styles
	 */
	_getBaseDefault() {
		let baseDefault = false;

		if ( this.options.defaults && this.options.defaults.media ) {
			baseDefault = this.options.defaults.media.base;
		}

		return baseDefault;
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
			slidersLinked: this.slidersLinked,
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
			this.resetDeviceSelection();
			this.applySettings( this.configInitial.media.base );
			this.settings = $.extend( true, {}, this.options.defaults || {} );
			this.events.emit( 'change', this.settings );
		} );
	}

	/**
	 * Change device selection back to base.
	 *
	 * @since 1.0.0
	 */
	resetDeviceSelection() {
		if ( this.deviceSelection ) {
			this.deviceSelection.activate( 'base' );
		}
	}

	/**
	 * Bind changing of units.
	 *
	 * Update the slider to respect bounds for the unit.
	 *
	 * @since 1.0
	 */
	_bindUnits() {

		// Unit defaults must be set before sliders are created.
		this.setUnits( this._getDefaultUnits() );

		this.$control.find( '.unit' ).on( 'change', e => {
			this.selectedUnit = e.target.value;
			this._unitsChanged();
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
	 * Update the linked status.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Boolean} isLinked Whether or not it should be linked.
	 */
	_updateLinkedStatus( isLinked ) {
		this.$links.toggleClass( 'linked', isLinked );
		this.slidersLinked = isLinked;
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
			event.preventDefault();
			this.slidersLinked = ! this.slidersLinked;
			this.$links.toggleClass( 'linked', this.slidersLinked );
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
