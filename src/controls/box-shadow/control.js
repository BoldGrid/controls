import { MultiSlider } from '../multi-slider';
import { Switch } from '../switch';
import { Picker as ColorPicker } from '../color-picker';
import { Parser } from './parser';
import configs from './config.js';
import './style.scss';

export class BoxShadow extends MultiSlider {
	constructor( options ) {
		super( options );

		this.parser = new Parser();

		this.slidersLinked = false;
		this.controlOptions = configs.controlOptions;
		this.sliderConfig = configs.sliderConfig;

		this.switchControl = new Switch( {
			name: 'box-shadow-outline',
			label: 'Outline / Inset'
		} );

		this.colorPicker = new ColorPicker();
	}

	/**
	 * Get the initial values to use for the control.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Values.
	 */
	getInitialValues() {
		let values = this.getCurrentValues(),
			baseDefault = this._getBaseDefault();

		if ( baseDefault ) {
			values = baseDefault.values || {};
			values.inset = baseDefault.type;
			values.color = baseDefault.color;
		} else if ( ! values ) {
			values = values || {};
			values.inset = this.configDefaults.media.base.type;
			values.color = this.configDefaults.media.base.color;
		}

		return values;
	}

	/**
	 * Allow reset of box shadow.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} settings Initial settings.
	 */
	applySettings( settings ) {
		super.applySettings( settings );

		this.currentValues = this.currentValues || {};
		this.currentValues.inset = settings.type ? 'inset' : '';
		this.updateCheckedSetting();
		this.switchControl.$input.change();

		if ( this.colorPicker.$input ) {
			this.colorPicker.setColor( settings.color );
		}
	}

	/**
	 * Get the current shadow color.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Color value.
	 */
	getShadowColor() {
		return this.currentValues.color || '#cecece';
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
		settings.color = this.shadowColor;
		settings.type = this.shadowType;
		return settings;
	}

	/**
	 * Override the get css rule method to use the box shadow property.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} CSS value.
	 */
	getCssRule() {
		return 'box-shadow: ' + this.$target.css( 'box-shadow' );
	}

	/**
	 * Get the configs for the current slider.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} slider Slider name.
	 * @return {object}        Slider configuration.
	 */
	getSliderConfig( slider ) {
		this.currentValues = this.getCurrentValues();
		if ( this.currentValues ) {
			this.sliderConfig[slider.name].value = this.currentValues[slider.name];
		}

		return this.sliderConfig[slider.name];
	}

	/**
	 * Get the current css values for the an element.
	 *
	 * @since 1.0.0
	 *
	 * @return {Object} Properties.
	 */
	getCurrentValues() {
		return this.parser.parse( this.$target.css( 'box-shadow' ) );
	}

	/**
	 * Create a control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control.
	 */
	render() {
		this.switchControl.render();
		this._setupOutlineSwitch();
		this._setupColorPicker();
		super.render();

		this.$control.find( '.delete-saved' )
			.before( this.switchControl.$element )
			.before( this.colorPicker.$element );

		return this.$control;
	}

	/**
	 * Refresh the values of the input to the values of the target.
	 *
	 * @since 1.0.0
	 */
	refreshValues() {
		let colorChange;

		super.refreshValues();
		this.updateCheckedSetting();
		this.updateShadowType();

		// Temp disable of color callback.
		colorChange = this.colorPicker.$input.iris( 'option', 'change' );
		this.colorPicker.$input.iris( 'option', 'change', () => {} );
		this.colorPicker.$input.iris( 'color', this.getShadowColor() );
		this.colorPicker.$input.iris( 'option', 'change', colorChange );
	}

	/**
	 * Tie into the config saving process, and save shadow specific settings.
	 *
	 * @since 1.0.0
	 */
	_saveConfigurationInitial() {
		super._saveConfigurationInitial();

		this.currentValues = this.getInitialValues();
		this.shadowType = this.currentValues.inset ? 'inset' : '';
		this.shadowColor = this.getShadowColor();
	}

	/**
	 * Update the css used on a component.
	 *
	 * @since 1.0.0
	 */
	_updateCss() {
		let data = this.getValues(),
			name = this.controlOptions.control.name,
			cssString = '';

		if ( data['horizontal-position'] || data['vertical-position'] || data['blur-radius'] || data['spread-radius'] ) {
			cssString = [];
			cssString.push( this.shadowType );
			cssString.push( data['horizontal-position'] + this.selectedUnit );
			cssString.push( data['vertical-position'] + this.selectedUnit );
			cssString.push( data['blur-radius'] + this.selectedUnit );
			cssString.push( data['spread-radius'] + this.selectedUnit );
			cssString.push( this.shadowColor );
			cssString = cssString.join( ' ' );
		}

		this.applyCssRules( {
			'box-shadow': cssString
		} );
	}

	/**
	 * Setup display of the color picker.
	 *
	 * @since 1.0.0
	 */
	_setupColorPicker() {
		let options = _.defaults( this.options.colorPicker || {}, {
			defaultColor: this.shadowColor,
			hide: false,
			change: () => {}
		} );

		this.colorPicker.init( false, options );

		// Add change event after initialize to prevent, programtic change events frm changing colors.
		this.colorPicker.$input.iris( 'option', 'change', ( e, ui ) => {
			this.shadowColor = ui.color.toString();
			this._updateCss();
			this._triggerChangeEvent();
		} );
	}

	/**
	 * Update the input for shadow type.
	 *
	 * @since 1.0.0
	 */
	updateCheckedSetting() {
		this.switchControl.$input.prop( 'checked', this.currentValues.inset );
	}

	/**
	 * Update the property for shadow type.
	 *
	 * @since 1.0.0
	 */
	updateShadowType() {
		this.shadowType = this.switchControl.isEnabled() ? 'inset' : '';
	}

	/**
	 * Setup events and rendering for outline switch.
	 *
	 * @since 1.0.0
	 */
	_setupOutlineSwitch() {
		this.switchControl.$input.on( 'change', () => {
			this.updateShadowType();
			this._updateCss();
			this._triggerChangeEvent();
		} );
	}
}

export { BoxShadow as default };
