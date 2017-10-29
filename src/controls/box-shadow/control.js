import { Direction } from '../direction';
import { Switch } from '../switch';
import { Picker as ColorPicker } from '../color-picker';
import configs from './config.js';
import './style.scss';

export class BoxShadow extends Direction {

	constructor( options ) {
		super( options );

		this.slidersLinked = false;
		this.controlOptions = configs.controlOptions;
		this.sliderConfig = configs.sliderConfig;
		this.shadowType = '';
		this.shadowColor = '#cecece';

		this.switchControl = new Switch( {
			'name': 'box-shadow-outline',
			'label': 'Outline / Inset'
		} );

		this.colorPicker = new ColorPicker();
	}

	/**
	 * Get the configs for the current slider.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} slider Slider name.
	 * @return {object}        Slider configuration.
	 */
	getSliderConfig( sliderName ) {
		return this.sliderConfig[ sliderName ];
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
	 * Update the css used on a component.
	 *
	 * @since 1.0.0
	 */
	_updateCss() {
		let data = this.getValues(),
			name = this.controlOptions.control.name,
			cssString = [];

		cssString.push( this.shadowType );
		cssString.push( data[ 'horizontal-position' ] + this.selectedUnit );
		cssString.push( data[ 'vertical-position' ] + this.selectedUnit );
		cssString.push( data[ 'blur-radius' ] + this.selectedUnit );
		cssString.push( data[ 'spread-radius' ] + this.selectedUnit );
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
			change: ( e, ui ) => {
				this.shadowColor = ui.color.toString();
				this._updateCss();
			}
		} );

		this.colorPicker.init( false, options );
	}

	/**
	 * Setup events and rendering for outline switch.
	 *
	 * @since 1.0.0
	 */
	_setupOutlineSwitch() {
		this.switchControl.render();

		this.switchControl.$input.on( 'change', () => {
			this.shadowType = this.switchControl.isEnabled() ? 'inset' : '';
			this._updateCss();
		} );
	}

}

export { BoxShadow as default };
