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
		this.params = {};
		this.tempSavedSettings = {};
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
		let settings = {
			unit: this.getUnit(),
			slidersLinked: this.slidersLinked,
			values: this.getValues()
		};

		settings.css = this.createCss( settings );

		return settings;
	}

	/**
	 * Create css string if a selecor is passed.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} [description]
	 */
	createCss( settings ) {
		let css = false;

		if ( this.controlOptions.control.selectors && this.controlOptions.control.selectors.length ) {
			css = '';
			css += this.controlOptions.control.selectors.join( ',' ) + '{';
			css += this.getCssRule( settings );
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
	getCssRule( settings ) {
		let cssRule = '';

		for ( let slider in settings.values ) {
			if ( this.sliders[ slider ] ) {
				cssRule += this.sliders[ slider ].options.cssProperty + ':' + settings.values[slider] + settings.unit + ';';
			}
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

		this.baseConfig = $.extend( true, {}, this.controlOptions );

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
		this._saveMergedDefaults();
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

		// If defaults passed in set them as the initial values.
		this.settings = this._getParamDefaultSettings() || this.settings;

		this._setSettingCSS( this.settings );
console.log( this.settings  );

		// Setup the revert process.
		this._storeDefaultValues();
		this._bindRevert();

		this.$control.rendered = true;

		return this.$control;
	}

	/**
	 * If a developer overwrote the defaults on instantiation, pull the settings
	 * from the configs so they can be applies to the settings object.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Settings.
	 */
	_getParamDefaultSettings() {
		let settings = false;

		if ( _.isEmpty( this.settings ) && this.options.setting && this.options.setting.settings ) {

			settings = { css: '', media: {} };
			let mediaOverrides = [];
			for ( let setting of this.options.setting.settings ) {
				for ( let media of setting.media ) {
					settings.media[ media ] = this.configDefaults.media[ media ];
				}
			}
		}

		return settings;
	}

	/**
	 * Update CSS for all initial settings to match control configurations.
	 *
	 * @since 1.0.0
	 *
	 * @param {object} settings Settings configuration.
	 */
	_setSettingCSS( settings ) {
		_.each( settings.media || [], ( setting, device ) => {
			setting.css = this.createCss( setting );

			if ( this.deviceSelection ) {
				setting.css = this.deviceSelection.addMediaQuery( setting.css, device );
			}
		} );

		if ( settings.media ) {
			settings.css = this._consolidateMediaCss( settings );
		}
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
		this.changeEventDisabled = true;
		this.applySettings( settings );
		this.changeEventDisabled = false;
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
			this._setupLinkedChange();
		}
	}

	/**
	 * When a user change the relationship to the base styles, change their settings.
	 *
	 * @since 1.0.0
	 */
	_setupLinkedChange() {
		this.deviceSelection.events.on( 'linkedToggle', ( isLinked ) => {
			const selectedDevice = this.deviceSelection.getSelectedValue();

			if ( isLinked ) {
				this.tempSavedSettings[ selectedDevice ] = this.settings.media[ selectedDevice ];

				// Determine the correct base styles to use.
				let baseSettings = this.configDefaults.media.base;
				if ( this.settings.media && this.settings.media.base ) {
					baseSettings = this.settings.media.base;
				}

				// Update inputs.
				this.applySettings( baseSettings );

				// Trigger an event where the device is unset.
				delete this.settings.media[ selectedDevice ];
				this.settings.css = this._consolidateMediaCss( this.settings );
				this._updateRelationshipStatus( this.settings );
				this.events.emit( 'change', this.settings );
			} else {
				let unlinkSettings = this.configDefaults.media.base;
				if ( this.settings.media && this.settings.media.base ) {
					unlinkSettings = this.settings.media.base;
				}

				if ( this.tempSavedSettings[ selectedDevice ] ) {
					unlinkSettings = this.tempSavedSettings[ selectedDevice ];
				}

				this.applySettings( unlinkSettings );
			}
		} );
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
		this.settings.css = this._consolidateMediaCss( this.settings );

		this._updateRelationshipStatus( this.settings );
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

			// Delete saved Settings.
			this.settings = {};
			this.applySettings( this.configDefaults.media.base );

			// Trigger Delete Event.
			this.events.emit( 'deleteSettings' );
		} );
	}

	/**
	 * Update the linked status to the base styles.
	 *
	 * Note: this will only work correctly after settings are updated.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} settings Settings.
	 */
	_updateRelationshipStatus( settings ) {
		if ( this.deviceSelection ) {
			const selectedDevice = this.deviceSelection.getSelectedValue();
			this.deviceSelection.updateRelationship( ! settings.media[ selectedDevice ] );
		}
	}

	/**
	 * Merge the css values of each device into 1 value.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Media CSS
	 */
	_consolidateMediaCss( settings ) {
		let css = '';

		for ( const mediaType of this.mediaOrder ) {
			if ( settings.media[ mediaType ] ) {
				css += settings.media[ mediaType ].css;
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
			let settings = this.configDefaults.media.base,
				isLinkedToBase = true;

			// If the user has customized a device, prepoulate.
			if ( this.settings.media && this.settings.media[ selectedDevice ] ) {
				settings = this.settings.media[ selectedDevice ];
				isLinkedToBase = false;

			// If the selected device settings were different from the base styles when control initialized,
			// Then use the custom styles.
			// This was disabled because it was catching instances where a user saved the base setting and not the mobile setting.
			//} else if ( JSON.stringify( this.configInitial.media[ selectedDevice ] ) !== JSON.stringify( this.configInitial.media.base ) ) {
			//	settings = this.configInitial.media[ selectedDevice ];
			//	isLinkedToBase = false;

			// If the user has customized base.
			} else if ( this.settings.media && this.settings.media.base ) {
				settings = this.settings.media.base;
				isLinkedToBase = true;
			}

			this.silentApplySettings( settings );
			this.deviceSelection.updateRelationship( isLinkedToBase );

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
	_saveMergedDefaults() {
		this.configDefaults = this._convertDefault(
			[ ...this.baseConfig.setting.settings, ...this.controlOptions.setting.settings ]
		);
	}

	/**
	 * Convert settings passed in as defaults to settings passed in to settings used by the controls.
	 *
	 * This are different so to minimize the amount number of settings a developer must define.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} defaults Defaults array
	 * @return {object}          Updated Settings.
	 */
	_convertDefault( defaults ) {
		let settings = {};
		settings.css = '';
		settings.media = {};

		for ( let setting of defaults ) {
			for ( let media of setting.media ) {
				let mediaConfig = { ...setting };

				mediaConfig.css = '';
				mediaConfig.slidersLinked = setting.isLinked;
				mediaConfig.unit = mediaConfig.unit;

				delete mediaConfig.media;
				delete mediaConfig.isLinked;

				// Merge the in the previous value, this ensures that all values are defined.
				settings.media[ media ] = deepmerge( settings.media[ media ] || {}, mediaConfig, {
					arrayMerge: ( destination, source ) => source
				} );
			}
		}

		return settings;
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
			this.settings = $.extend( true, {}, this.options.defaults || {} );

			// Update the slider, with the derived base config (Also Triggers Change).
			this.applySettings( this.configInitial.media.base );

			/*
			 * @todo Remove this hack
			 * This is a hack to make sure any throttling of this event doesnt ignore the
			 * previous change event. Without this timeout, reverting to an empty
			 * value css update ignores the css change if throttled.
			 */
			setTimeout( () => {
				this.events.emit( 'change', this.settings );
			}, 75 );
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
		this.changeEventDisabled = true;

		this._resetOptions();

		setTimeout( () => {
			this.changeEventDisabled = false;
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
			if ( ! this.changeEventDisabled ) {
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
		if ( this.$control.rendered && ! this.changeEventDisabled ) {
			this._updateSettings();
			this.events.emit( 'change', this.settings );
		}
	}
}

export { MultiSlider as default };
