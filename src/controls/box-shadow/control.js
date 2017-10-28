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
	getSliderConfig( slider ) {
		return this.sliderConfig[ slider ];
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
	update() {
		let data = this.getValues(),
			name = this.controlOptions.control.name,
			cssString = [];

		cssString.push( this.shadowType );
		cssString.push( data[ name + '-horizontal-position' ] + this.selectedUnit );
		cssString.push( data[ name + '-vertical-position' ] + this.selectedUnit );
		cssString.push( data[ name + '-blur-radius' ] + this.selectedUnit );
		cssString.push( data[ name + '-spread-radius' ] + this.selectedUnit );
		cssString.push( this.shadowColor );

		cssString = cssString.join( ' ' );

		this.$target.css( 'box-shadow', cssString );
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
				this.update();
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
			this.update();
		} );
	}

	/**
	 * Update css as the control fires updates.
	 *
	 * @since 1.0.0
	 */
	_bindSliderChange() {
		this.$control.on( 'slide-change', () => this.update() );
	}

}

export { BoxShadow as default };
