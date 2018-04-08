import { MultiSlider } from '../../multi-slider';
import { Picker as ColorPicker } from '../../color-picker';
import { Parser } from '../../box-shadow/parser';
import configs from './config.js';

export class Control extends MultiSlider {
	constructor( options ) {
		super( options );

		this.parser = new Parser();

		this.slidersLinked = false;
		this.controlOptions = configs.controlOptions;
		this.sliderConfig = configs.sliderConfig;
		this.currentValues = this.getCurrentValues();
		this.shadowColor = this.getShadowColor();

		this.colorPicker = new ColorPicker();
	}

	getShadowColor() {
		return this.currentValues.color || '#cecece';
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
		return this.parser.parse( this.$target.css( 'text-shadow' ) );
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

		this._setupColorPicker();

		$control = this.$control.add( this.colorPicker.$element );

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

		cssString.push( data['horizontal-position'] + this.selectedUnit );
		cssString.push( data['vertical-position'] + this.selectedUnit );
		cssString.push( data['blur-radius'] + this.selectedUnit );
		cssString.push( this.shadowColor );

		cssString = cssString.join( ' ' );

		this.applyCssRules( {
			'text-shadow': cssString
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
		} );
	}
}

export { BoxShadow as default };
