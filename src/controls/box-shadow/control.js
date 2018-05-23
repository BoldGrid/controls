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
		this.currentValues = this.getCurrentValues();
		this.shadowType = this.currentValues.inset ? 'inset' : '';
		this.shadowColor = this.getShadowColor();

		this.switchControl = new Switch( {
			name: 'box-shadow-outline',
			label: 'Outline / Inset'
		} );

		this.colorPicker = new ColorPicker();
	}

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
		let $control;

		super.render();

		this._setupOutlineSwitch();
		this._setupColorPicker();

		$control = this.$control.add( this.switchControl.$element );
		$control = $control.add( this.colorPicker.$element );

		return $control;
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
	 * Update the css used on a component.
	 *
	 * @since 1.0.0
	 */
	_updateCss() {
		let data = this.getValues(),
			name = this.controlOptions.control.name,
			cssString = [];

		cssString.push( this.shadowType );
		cssString.push( data['horizontal-position'] + this.selectedUnit );
		cssString.push( data['vertical-position'] + this.selectedUnit );
		cssString.push( data['blur-radius'] + this.selectedUnit );
		cssString.push( data['spread-radius'] + this.selectedUnit );
		cssString.push( this.shadowColor );

		cssString = cssString.join( ' ' );

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
			this.events.emit( 'change', this.getSettings() );
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
		this.switchControl.render();
		this.updateCheckedSetting();

		this.switchControl.$input.on( 'change', () => {
			this.updateShadowType();
			this._updateCss();
			this.events.emit( 'change', this.getSettings() );
		} );
	}
}

export { BoxShadow as default };
