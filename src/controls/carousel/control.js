var $ = window.jQuery;

import { Switch } from '../switch';
import { Slider } from '../slider';
import { MatSelect } from '../mat-select';
import { Icon } from './icon';
import { FontColor } from '../typography/font-color';
import template from './template.html';
import navigationOptions from './config/nav-position';
import navigationDesign from './config/nav-design';
import dotPosition from './config/dot-position';
import { EventEmitter } from 'eventemitter3';
import deepmerge from 'deepmerge';
import './style.scss';

export class Control {

	/**
	 * Init Control Options.
	 *
	 * @since 1.0.0
	 *
	 * @param {object} options List of control options.
	 */
	constructor( options ) {
		options = options || {};

		this.defaultSettings = {
			title: 'BoldGrid Slider',
			preset: {
				arrows: true,
				autoplay: false,
				autoplaySpeed: 10,
				dots: false,
				infinite: true,
				bgOptions: {
					arrowsPos: 'standard',
					arrowsDesign: 'square',
					arrowsOverlay: true,
					arrowsBgColor: 'rgba(0,0,0,0)',
					arrowsSize: 30,
					dotsPos: 'bottom',
					dotsOverlay: true,
					dotsColor: '#333333',
					dotsSize: 50
				}
			}
		};

		this.options = deepmerge( this.defaultSettings, options, {
			arrayMerge: ( destination, source ) => source
		} );

		this.template = _.template( template );
		this._setupNavigation();
		this._setupAutoPlay();
		this._setupInfinite();
		this._setupDots();

		this.event = new EventEmitter();
	}

	/**
	 * Render the carousel control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control library.
	 */
	render() {
		this.$element = $( this.template( this.options ) );
		this.$form = this.$element.find( 'form' );

		this.$element.find( 'nav-switch' ).replaceWith( this.navSwitch.render() );
		this.$element.find( 'nav-position' ).replaceWith( this.navPosition.render() );
		this.$element.find( 'nav-overlay' ).replaceWith( this.navOverlay.render() );
		this.$element.find( 'nav-size' ).replaceWith( this.navSize.render() );
		this.$element.find( 'nav-icon' ).replaceWith( this.navIcon.render() );
		this.$element.find( 'nav-background-color' ).replaceWith( this.navBgColor.render() );

		this.$element.find( 'dots-switch' ).replaceWith( this.dotSwitch.render() );
		this.$element.find( 'dots-position' ).replaceWith( this.dotPosition.render() );
		this.$element.find( 'dots-overlay' ).replaceWith( this.dotOverlay.render() );
		this.$element.find( 'dots-color' ).replaceWith( this.dotColor.render() );
		this.$element.find( 'dots-size' ).replaceWith( this.dotSize.render() );

		this.$element.find( 'autoplay-switch' ).replaceWith( this.autoplaySwitch.render() );
		this.$element.find( 'autoplay-speed' ).replaceWith( this.autoplaySlider.render() );
		this.$element.find( 'infinite-switch' ).replaceWith( this.infiniteSwitch.render() );

		this._preset( this.options.preset );
		this._bindUIEvents();
		this._bindChangeEvent();
		this.updateUI();

		return this.$element;
	}

	/**
	 * Get the currently set values.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} All Values.
	 */
	getValues() {
		let values = {
			arrows: this.navSwitch.isEnabled(),
			autoplay: this.autoplaySwitch.isEnabled(),
			autoplaySpeed: this.autoplaySlider.$input.val(),
			dots: this.dotSwitch.isEnabled(),
			infinite: this.infiniteSwitch.isEnabled(),
			bgOptions: {
				arrowsPos: this.navPosition.getValue(),
				arrowsOverlay: this.navOverlay.isEnabled(),
				arrowsBgColor: this.navBgColor.$colorVal.val(),
				arrowsIcon: this.navIcon.$select.val(),
				arrowsSize: this.navSize.$input.val(),
				dotsPos: this.dotPosition.getValue(),
				dotsOverlay: this.dotOverlay.isEnabled(),
				dotsColor: this.dotColor.$colorVal.val(),
				dotsSize: this.dotSize.$input.val()
			}
		};

		return values;
	}

	/**
	 * Update the UI.
	 *
	 * @since 1.0.0
	 */
	updateUI() {
		let navButtonEnabled = this.navSwitch.isEnabled(),
			navDotsEnabled = this.dotSwitch.isEnabled(),
			autoplayEnabled = this.autoplaySwitch.isEnabled();

		this.navPosition.$element.toggle( navButtonEnabled );
		this.navOverlay.$element.toggle( navButtonEnabled );
		this.navIcon.$control.toggle( navButtonEnabled );
		this.navSize.$control.toggle( navButtonEnabled );
		this.navBgColor.$control.toggle( navButtonEnabled );

		this.dotPosition.$element.toggle( navDotsEnabled );
		this.dotOverlay.$element.toggle( navDotsEnabled );
		this.dotColor.$control.toggle( navDotsEnabled );
		this.dotSize.$control.toggle( navDotsEnabled );

		this.autoplaySlider.$control.toggle( autoplayEnabled );
	}

	/**
	 * Preset the contorls to a set of given values.
	 *
	 * @since 1.0.0
	 *
	 * @param {object} presets Values to use as presets.
	 */
	_preset( presets ) {

		// Arrows.
		this.navSwitch.setChecked( presets.arrows );
		this.navPosition.setValue( presets.bgOptions.arrowsPos );
		this.navOverlay.setChecked( presets.bgOptions.arrowsOverlay );
		this.navBgColor.updateUI( presets.bgOptions.arrowsBgColor );
		this.navSize.$slider.slider( 'value', presets.bgOptions.arrowsSize );

		// Dots.
		this.dotSwitch.setChecked( presets.dots );
		this.dotPosition.setValue( presets.bgOptions.dotsPos );
		this.dotOverlay.setChecked( presets.bgOptions.dotsOverlay );
		this.dotColor.updateUI( presets.bgOptions.dotsColor );
		this.dotSize.$slider.slider( 'value', presets.bgOptions.dotsSize );

		// Autoplay.
		this.autoplaySwitch.setChecked( presets.autoplay );
		this.autoplaySlider.$slider.slider( 'value', presets.autoplaySpeed );

		// Loop.
		this.infiniteSwitch.setChecked( presets.infinite );
	}

	/**
	 * When the form changes emit an event.
	 *
	 * @since 1.0.0
	 */
	_bindChangeEvent() {
		this.$form.on( 'submit', ( e ) => e.preventDefault() );
		this.$form.on( 'change', () => this.event.emit( 'change', this.getValues() ) );
	}

	/**
	 * Setup all events.
	 *
	 * @since 1.0.0
	 */
	_bindUIEvents() {
		this.navSwitch.$input.on( 'change', () => this.updateUI() );
		this.dotSwitch.$input.on( 'change', () => this.updateUI() );
		this.autoplaySwitch.$input.on( 'change', () => this.updateUI() );
	}

	/**
	 * Setup controls for navigation dots.
	 *
	 * @since 1.0.0
	 */
	_setupDots() {
		this.dotSwitch = new Switch( {
			name: 'carousel-navigation-dots',
			direction: 'reverse',
			label: 'Navigation Dots'
		} );

		this.dotOverlay = new Switch( {
			name: 'carousel-dots-overlay',
			direction: 'reverse',
			label: 'Overlay'
		} );

		this.dotSize = new Slider( {
			name: 'carousel-dots-size',
			label: 'Size',
			uiSettings: {
				min: 20,
				max: 90
			}
		} );

		this.dotPosition = new MatSelect( dotPosition );
		this.dotColor = new FontColor( {
			label: 'Color',
			name: 'dotsColor',
			target: $( '<div style="color: #000000">' )
		} );
	}

	/**
	 * Setup the infinite loop switc.
	 *
	 * @since 1.0.0
	 */
	_setupInfinite() {
		this.infiniteSwitch = new Switch( {
			name: 'carousel-infinite',
			direction: 'reverse',
			label: 'Loop'
		} );
	}

	/**
	 * Setup the controls for auto play.
	 *
	 * @since 1.0.0
	 */
	_setupAutoPlay() {
		this.autoplaySwitch = new Switch( {
			name: 'carousel-autoplay-enabled',
			direction: 'reverse',
			label: 'Autoplay'
		} );

		this.autoplaySlider = new Slider( {
			name: 'autoplay-duration',
			label: 'Autoplay Duration',
			uiSettings: {
				min: 1,
				max: 20
			}
		} );
	}

	/**
	 * Setup any controls needed for navigation controls.
	 *
	 * @since 1.0.0
	 */
	_setupNavigation() {
		this.navSwitch = new Switch( {
			name: 'carousel-navigation-buttons',
			direction: 'reverse',
			label: 'Navigation Buttons'
		} );

		this.navSize = new Slider( {
			name: 'carousel-nav-size',
			label: 'Size',
			uiSettings: {
				min: 10,
				max: 100
			}
		} );

		this.navIcon = new Icon();
		this.navOverlay = new Switch( {
			name: 'carousel-navigation-overlay',
			direction: 'reverse',
			label: 'Overlay'
		} );

		this.navPosition = new MatSelect( navigationOptions );
		this.navBgColor = new FontColor( {
			label: 'Background Color',
			name: 'arrowsBG',
			target: $( '<div style="color: #000000">' )
		} );
	}
}
