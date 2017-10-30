var $ = window.jQuery;
import template from './template.html';
import './style.scss';

export class Slider {
	constructor( options ) {

		this.options = _.defaults( options || {}, {
			name: 'slider-name',
			label: 'Slider Title',
			uiSettings: {
				min: 0,
				max: 100
			}
		} );

		this.template = _.template( template );
	}

	/**
	 * Render a slider.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} The control.
	 */
	render() {
		this.$control = $( this.template( this.options ) );

		this.$input = this.$control.find( 'input' );
		this.$slider = this.$control.find( '.slider' );

		this._bindInput();
		this._bindSlider();

		return this.$control;
	}

	/**
	 * Bind the inputs change events.
	 *
	 * @since 1.0.0
	 */
	_bindInput() {
		this.$input.on( 'input', event => {
			let val = this.$input.val();

			val = Math.min( this.$input.val(), this.$slider.slider( 'option', 'max' ) );
			val = Math.max( val, this.$slider.slider( 'option', 'min' ) );

			this.$input.val( val );

			this.$slider.slider( 'value', val );
		} );
	}

	/**
	 * Update the input.
	 *
	 * @since 1.0.0
	 *
	 * @param  {$} $slider Slider element jquery.
	 */
	_updateInput( $slider ) {
		this.$input.val( this.$slider.slider( 'value' ) );
	}

	/**
	 * Get a slider configuration.
	 *
	 * @since 1.0.0
	 * @return {object} jquery ui slider config.
	 */
	getSliderConfig() {
		return this.options.uiSettings;
	}

	/**
	 * Bind the slider events.
	 *
	 * @since 1.0
	 */
	_bindSlider() {

		this.$slider.slider(
			_.defaults( this.getSliderConfig( this.$slider.data( 'name' ) ), {
				animate: 'fast',
				slide: () => this._onSliderChange(),
				change: () => this._onSliderChange()
			} )
		);

		this._updateInput( this.$slider );
	}

	/**
	 * When the slider changes.
	 *
	 * @since 1.0
	 *
	 * @param  {DOM Event} event When the slider changes.
	 */
	_onSliderChange() {
		this._updateInput( this.$slider );
		this.$control.trigger( 'slide-change', {
			name: this.options.name,
			value: this.$slider.slider( 'value' )
		} );
	}
}

export { Slider as default };
