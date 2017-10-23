var $ = window.jQuery;
import './direction.scss';
import template from './template.html';

import linkSvg from './img/link.svg';

export class Direction {

	constructor( options ) {
		options = options || {};
		this.$target = options.target;
		this.template = _.template( template );

		if ( ! this.$target ) {
			throw Error( 'Your must define a target element' );
		}
	}

	mergeDefaultConfigs() {
		this.controlOptions = _.defaults( this.controlOptions, {
			'control': {
				'title': 'Universal',
				'default': 'percentage',
				'units': {
					'enabled': [
						'px',
						'percentage',
						'em'
					]
				}
			},
			'slider': {
				'min': -200,
				'max': 200
			}
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

		this.controlOptions.svgLink = linkSvg;

		this.$control = $( this.template( this.controlOptions ) );
		this.$sliders = this.$control.find( '.slider' );
		this.$inputs = this.$control.find( 'input.number' );
		this.$links = this.$control.find( '.link' );

		this._bindSlider();
		this._bindInput();
		this._bindLinked();
		this._bindUnits();

		return this.$control;
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

		this.$sliders.each( ( index, element ) => {
			let $this = $( element );
			values[ $this.attr( 'data-name' ) ] = $this.slider( 'value' );
		} );

		return values;
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

	_bindUnits() {
		this.$control.find( '.unit[name="unit"]' ).on( 'change', ( e ) => {
			let $target = $( e.target );

			console.log( $target.val() );
		} );
	}

	/**
	 * Bind the user linking the controls.
	 * @return {[type]} [description]
	 */
	_bindLinked() {
		this.$links.on( 'click', ( event ) => {
			let $target = $( event.target ).closest( 'a' );
			event.preventDefault();
			$target.toggleClass( 'linked' );
			this.linked = $target.hasClass( 'linked' );
			this.$control.trigger( 'linked', { isLinked: this.linked } );
		} );
	}

	/**
	 * Bind the inputs change events.
	 *
	 * @since 1.0
	 */
	_bindInput() {
		this.$inputs.on( 'input', ( event ) => {
			let $this = $( event.target ),
				$slider = $this.prev(),
				val = $this.val();

			val = Math.min( $this.val(), this.controlOptions.slider.max );
			val = Math.max( $this.val(), this.controlOptions.slider.min );

			$slider.slider( 'value', val );
		} );
	}

	/**
	 * Bind the slider events.
	 *
	 * @since 1.0
	 */
	_bindSlider() {
		console.log( this.controlOptions );
		this.$sliders.slider( _.defaults( this.controlOptions.slider, {
			animate: 'fast',
			slide: event => this._onSliderChange( event ),
			change: event => this._onSliderChange( event )
		} ) );

		this.$sliders.each( ( index, slider ) => {
			this._updateInput( $( slider ) );
		} );
	}

	/**
	 * When the slider changes.
	 *
	 * @since 1.0
	 *
	 * @param  {DOM Event} event When the slider changes.
	 */
	_onSliderChange( event ) {
		let $slider = $( event.target );
		this._updateInput( $slider );
		this.$control.trigger( 'slide-change', this.getValues() );

		if ( this.linked && ! this.linkedDisabled ) {
			this.linkedDisabled = true;
			this.$sliders.not( $slider ).slider( 'value', $slider.slider( 'value' ) );
		}

		setTimeout( () => {
			this.linkedDisabled = false;
		} );
	}

	/**
	 * Update the input.
	 *
	 * @since 1.0
	 *
	 * @param  {$} $slider Slider element jquery.
	 */
	_updateInput( $slider ) {
		let $input = $slider.next(),
			value = $slider.slider( 'value' );

		$input.val( value );
	}
}

export { Direction as default };
