var $ = window.jQuery;
import './style.scss';
import { Slider } from '../slider';
import { Conversion } from './conversion';
import template from './template.html';
import config from './config.js';
import deepmerge from 'deepmerge';
import refreshSvg from 'svg-inline-loader?classPrefix!./img/refresh.svg';
import linkSvg from 'svg-inline-loader?classPrefix!./img/link.svg';

export class MultiSlider {
	constructor( options ) {
		this.options = options || {};

		this.slidersLinked = false;
		this.$target = this.options.target;
		this.template = _.template( template );

		if ( ! this.$target ) {
			throw Error( 'Your must define a target element' );
		}
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

		this._bindUnits();
		this.setUnits( this.controlOptions.control.units.default );

		// Create sliders and attach them to the template.
		this._createSliders();
		this.$links = this.$control.find( '.link' );

		this._storeDefaultValues();
		this._setDefaultLinkedState();
		this._bindLinked();
		this._bindRevert();

		return this.$control;
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

			this.sliders[key].$slider.slider( 'option', 'value', value );
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
	 * Get the values.
	 *
	 * @since 1.0
	 *
	 * @return {Object} Current values for each direction.
	 */
	getValues() {
		let values = {};

		for ( let name in this.sliders ) {
			values[name] = this.sliders[name].$slider.slider( 'value' );
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
			sliderControl.$input.after( '<a class="link" href="#" title="Link all sliders">' + linkSvg + '</a>' );

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
			unit: this.controlOptions.control.units.default,
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
		if ( this.controlOptions.control.linkable ) {
			let values = _.unique( _.values( this.getValues() ) );
			this.slidersLinked = ( 1 === values.length );
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
			}
		} );
	}
}

export { MultiSlider as default };
