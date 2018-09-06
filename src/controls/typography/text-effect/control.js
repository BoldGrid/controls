import template from './template.html';
import { Switch } from '../../switch';
import './style.scss';
import selectedSVG from './check.svg';
import { EventEmitter } from 'eventemitter3';
import '../../util';

export class TextEffect {
	constructor( { ...options } ) {
		this.options = options || {};
		this.presets = [
			'bg-text-fx bg-text-fx-inset-text',
			'bg-text-fx bg-text-fx-shadows',
			'bg-text-fx bg-text-fx-glow',
			'bg-text-fx bg-text-fx-closeheavy',
			'bg-text-fx bg-text-fx-enjoy-css',
			'bg-text-fx bg-text-fx-retro',
			'bg-text-fx bg-text-fx-stroke',
			'bg-text-fx bg-text-fx-anaglyph'
		];

		this.$target = this.options.target;
		this.events = new EventEmitter();
	}

	/**
	 * Return a control object.
	 *
	 * @since 1.0.0
	 *
	 * @return {$} Jquery Element.
	 */
	render() {
		this._initSwitch();

		this.$control = $( _.template( template )( {
			presets: this.presets,
			selectedSVG: selectedSVG
		} ) );

		this.$control.find( 'switch' ).replaceWith( this.switchControl.$element );
		this.$selections = this.$control.find( '.selections' );
		this.$inputs = this.$selections.find( 'input' );

		this._preset();
		this._setupHandlers();

		return this.$control;
	}

	/**
	 * Remove classes from the target.
	 *
	 * @since 1.0.0
	 */
	removeClasses() {
		this.$target.removeClass( this.presets.join( ' ' ) );
	}

	/**
	 * Get the currently saved value.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Currently used classes.
	 */
	getValue() {
		return this.switchControl.isEnabled() ?
			this.$inputs.filter( ':checked' ).val() : null;
	}

	/**
	 * Add the classes for the currently selected value.
	 *
	 * @since 1.0.0
	 */
	applySelection() {
		this.removeClasses();
		this.$target.addClass( this.getValue() );
		window.BOLDGRID.CONTROLS.addStyle( this.$target, 'text-shadow', '' );
	}

	/**
	 * Setup the switch control.
	 *
	 * @since 1.0.0
	 */
	_initSwitch() {
		this.switchControl = new Switch( {
			name: 'text-effect',
			direction: 'reverse',
			label: 'Text Effect'
		} );

		this.switchControl.render();
	}

	/**
	 * Set the presets.
	 *
	 * @since 1.0.0
	 */
	_preset() {
		this._presetRadio();
		this._presetSwitch();
	}

	/**
	 * Preset Switch.
	 *
	 * @since 1.0.0
	 */
	_presetSwitch() {
		this.switchControl.$input.prop( 'checked', !! this.$inputs.filter( ':checked' ).length ).change();
		this.$selections.toggle( !! this.$inputs.filter( ':checked' ).length );
	}

	/**
	 * Set the radio to it's intial value.
	 *
	 * @since 1.0.0
	 */
	_presetRadio() {
		for ( const preset of this.presets ) {
			if ( this.$target.hasClass( preset ) ) {
				this.$inputs.filter( '[value="' + preset + '"]' ).prop( 'checked', true );
			}
		}
	}

	/**
	 * Setup all event handlers.
	 *
	 * @since 1.0.0
	 */
	_setupHandlers() {
		this._setupSwitch();
		this._setupInput();
	}

	/**
	 * When changing selection, apply the value.
	 *
	 * @since 1.0.0
	 */
	_setupInput() {
		this.$inputs.on( 'change', () => this.applySelection() );
	}

	/**
	 * Bind the switch event.
	 *
	 * @since 1.0.0
	 */
	_setupSwitch() {
		this.switchControl.$element.on( 'change', () => {
			let isEnabled = this.switchControl.isEnabled(),
				action = isEnabled ? 'slideDown' : 'slideUp';

			this.$selections[ action ]( 'fast' );

			if ( isEnabled ) {

				// If nothing is selected, select the first item.
				if ( ! this.getValue() ) {
					this.$inputs.eq( 0 ).prop( 'checked', true );
				}

				this.applySelection();
				this.events.emit( 'open' );
			} else {
				this.removeClasses();
				this.events.emit( 'close' );
			}
		} );
	}
}

export { TextEffect as default };
