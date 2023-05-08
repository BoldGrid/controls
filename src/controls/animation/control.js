import template from './template.html';
import './style.scss';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import 'animate.css/animate.css';
import { Slider } from '../slider';
import animateConfig from 'animate.css/animate-config.json';
import { titleCase } from 'title-case';

export class Control {
	constructor( options ) {
		this.options = options || {};
		this.$target = this.options.target;
		this.animationClasses = _.flatten( _.values( animateConfig ) );
		this.animationClassesString = this.animationClasses.join( ' ' );

		this.delayControl = new Slider( {
			name: 'animation-delay',
			label: 'Delay (secs)',
			uiSettings: {
				min: 0,
				max: 4,
				value: this.getDefault( 'data-wow-delay' ),
				step: .1
			}
		} );

		this.durationControl = new Slider( {
			name: 'animation-duration',
			label: 'Duration (secs)',
			uiSettings: {
				min: .5,
				max: 4,
				value: this.getDefault( 'data-wow-duration' ),
				step: .1
			}
		} );
	}

	/**
	 * Get the default value for delay.
	 *
	 * @since 0.10.0
	 *
	 * @return {string} Delay time.
	 */
	getDefault( name ) {
		let delay = this.$target.attr( name );

		if ( 'undefined' === typeof delay ) {
			delay = '1';
		}

		return delay.replace( 's', '' );
	}

	/**
	 * Create a control.
	 *
	 * @since 0.10.0
	 *
	 * @return {jQuery} Control.
	 */
	render() {
		this.$durationSlider = this.durationControl.render();
		this.$delaySlider = this.delayControl.render();

		this.$control = $( _.template( template )( {
			animateConfig: animateConfig,
			titleCase: titleCase
		} ) );

		this.$control.find( 'durationSlider' ).replaceWith( this.$durationSlider );
		this.$control.find( 'delaySlider' ).replaceWith( this.$delaySlider );
		this.$typeControl = this.$control.find( 'select' );

		this._presetType();

		this.$typeControl.select2();

		this._bindEvents();

		return this.$control;
	}

	/**
	 * Preset the type control.
	 *
	 * @since 0.10.2
	 */
	_presetType() {
		if ( this.$target.hasClass( 'wow' ) ) {
			for ( let className of this.animationClasses ) {
				if ( this.$target.hasClass( className ) ) {
					this.$typeControl.val( className );
				}
			}
		}
	}

	/**
	 * Remove the saved settings.
	 *
	 * @since 0.10.0
	 */
	removeSettings() {
		this.$target.removeClass( 'wow' );
		this.$target.removeAttr( 'data-wow-duration' );
		this.$target.removeAttr( 'data-wow-delay' );
		this._removeAnimationClasses();
	}

	/**
	 * Given an animation value, Save animation.
	 *
	 * @since 0.10.0
	 *
	 * @param  {string} val Animation Value.
	 */
	saveAnimation( val ) {
		let duration = this.durationControl.$input.val() + 's',
			delay = this.delayControl.$input.val() + 's';

		this.$target.addClass( 'wow' );
		this._removeAnimationClasses();
		this.$target.addClass( 'animated' );
		this.$target.addClass( val );
		this.$target.css( 'animation-duration', duration );
		this.$target.attr( 'data-wow-duration', duration );
		this.$target.attr( 'data-wow-delay', delay );

		this.$target.one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
			this._removeAnimationClasses();
			this.$target.addClass( val );
		} );
	}

	/**
	 * Trigger the selected animation.
	 *
	 * @since 0.10.0
	 */
	triggerAnimation() {
		let val = this.$typeControl.val();

		if ( val ) {
			this.saveAnimation( val );
		} else {
			this.removeSettings();
		}
	}

	/**
	 * Bind all events.
	 *
	 * @since 0.10.0
	 */
	_bindEvents() {
		this.$typeControl.on( 'change', () => this.triggerAnimation() );
		this.durationControl.$control.on( 'slide-change', () => this._updateAnimationSettings() );
		this.delayControl.$control.on( 'slide-change', () => this._updateAnimationSettings() );
	}

	/**
	 * Update the animation settings.
	 *
	 * @since 0.10.0
	 */
	_updateAnimationSettings() {
		let duration = this.durationControl.$input.val() + 's',
			delay = this.delayControl.$input.val() + 's';

		if ( this.$typeControl.val() ) {
			this.$target.attr( 'data-wow-duration', duration );
			this.$target.attr( 'data-wow-delay', delay );
		}
	}

	/**
	 * Remove any animation classes.
	 *
	 * @since 0.10.0
	 */
	_removeAnimationClasses() {
		this.$target.removeClass( 'animated' );
		this.$target.removeClass( this.animationClassesString );
		this.$target.css( 'animation-duration', '' );
	}

}

export { Control as default };
