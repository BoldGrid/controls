var $ = window.jQuery;
import './direction.scss';
import template from './template.html';
import config from './config.js';
import deepmerge from 'deepmerge';
import linkSvg from 'svg-inline-loader!./img/link.svg';
import refreshSvg from 'svg-inline-loader!./img/refresh.svg';

export class Direction {
	constructor( options ) {
		options = options || {};

		this.slidersLinked = true;
		this.$target = options.target;
		this.template = _.template( template );

		if ( ! this.$target ) {
			throw Error( 'Your must define a target element' );
		}
	}

	mergeDefaultConfigs() {
		this.controlOptions = deepmerge(
			config.defaults,
			this.controlOptions,
			{ arrayMerge: ( destination, source ) => source }
		);
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
		this.$sliders = this.$control.find( '.slider' );
		this.$inputs = this.$control.find( 'input.number' );
		this.$links = this.$control.find( '.link' );
		this.$units = this.$control.find( '.unit' );
		this.$revert = this.$control.find( '.refresh' );

		this._bindUnits();
		this.setUnits( this.controlOptions.control.units.default );
		this._storeDefaultValues();
		this._bindInput();
		this._bindLinked();
		this._bindRevert();
		this._bindSliderChange();

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
			let value = settings.values[ key ];
			this.$sliders.filter( '[data-name="' + key + '"]' ).slider( 'option', 'value', value );
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
	 * Save the default values for reverts.
	 *
	 * @since 1.0
	 */
	_storeDefaultValues() {
		this.defaultValues = {
			'unit': this.controlOptions.control.units.default,
			'values': this.getValues()
		};
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
	 * Bind reverting changes to original.
	 *
	 * @since 1.0
	 */
	_bindRevert() {
		this.$revert.on( 'click', ( event ) => {
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
			this._bindSlider();
		} );
	}

	/**
	 * Bind the user linking the controls.
	 * @return {[type]} [description]
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
	 * Bind the inputs change events.
	 *
	 * @since 1.0
	 */
	_bindInput() {
		this.$inputs.on( 'input', event => {
			let $this = $( event.target ),
				$slider = $this.prev(),
				val = $this.val(),
				config = this.getSliderConfig( $slider.data( 'name' ) );

			val = Math.min( $this.val(), config.max );
			val = Math.max( val, config.min );

			$this.val( val );

			$slider.slider( 'value', val );
		} );
	}

	getSliderConfig() {
		return this.controlOptions.slider[ this.selectedUnit ];
	}

	/**
	 * Bind the slider events.
	 *
	 * @since 1.0
	 */
	_bindSlider() {
		this.$sliders.each( ( index, slider ) => {
			let $slider = $( slider );

			$slider.slider(
				_.defaults( this.getSliderConfig( $slider.data( 'name' ) ), {
					animate: 'fast',
					slide: event => this._onSliderChange( event ),
					change: event => this._onSliderChange( event )
				} )
			);
		} );


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

		if ( this.slidersLinked && ! this.linkedDisabled ) {
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

	/**
	 * Update css as the control fires updates.
	 *
	 * @since 1.0.0
	 */
	_bindSliderChange() {
		this.$control.on( 'slide-change', ( e, data ) => {
			let name = this.controlOptions.control.name,
				property = {};

			_.each( this.controlOptions.control.sliders, ( slider ) => {
				property[ slider.cssProperty ] = data[ name + '-' + slider.name ] + this.selectedUnit;
			} );

			this.$target.css( property );
		} );
	}
}

export { Direction as default };
