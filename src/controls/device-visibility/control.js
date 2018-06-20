var $ = window.jQuery;

import template from './template.html';
import { Checkbox } from '../checkbox';
import { EventEmitter } from 'eventemitter3';
import { Control as DeviceSelection } from '../multi-slider/device-selection/control';

export class Control {
	constructor( options ) {
		this.options = options || {};

		// Merge in configs.
		this.options.control = this.options.control || {};
		this.options.control.setting = this.options.control.setting || [];
		this.options.defaults = this.options.defaults || {};

		this.$target = this.options.target;
		this.controlRendered = false;
		this.template = _.template( template );
		this.checkboxConfigs = [
			{
				name: 'phone',
				label: 'Phone',
				class: 'hidden-xs',
				icon: require( './img/phone.svg' )
			},
			{
				name: 'tablet',
				label: 'Tablet',
				class: 'hidden-sm',
				icon: require( './img/tablet.svg' )
			},
			{
				name: 'desktop',
				label: 'Desktop',
				class: 'hidden-md',
				icon: require( './img/desktop.svg' )
			},
			{
				name: 'large',
				label: 'Large Displays',
				class: 'hidden-lg',
				icon: require( './img/large.svg' )
			}
		];

		this.hiddenDeviceNames = this.options.defaults.media || this.convertDefaults( this.options.control.setting );
		this.events = new EventEmitter();

		if ( ! this.$target ) {
			this.$target = $( '<div>' ).hide();
			$( 'body' ).append( this.$target );
			this.$target.detach();
		}
	}

	/**
	 * Render the control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control Element.
	 */
	render() {
		this.$control = $( this.template() );
		this._appendCheckboxes();

		this.deviceSelection = new DeviceSelection( {
			sizes: this.options.control.responsive || null
		} );

		this.deviceSelection.render();

		this.controlRendered = true;

		return this.$control;
	}

	/**
	 * Trigger the change event for this control.
	 *
	 * @since 1.0.0
	 */
	triggerChangeEvent() {
		if ( this.controlRendered ) {
			this.events.emit( 'change', this.getSettings() );
		}
	}

	/**
	 * Given an array of devices to hide by default, add device names to list.
	 *
	 * @since 1.0.0
	 *
	 * @return {array} Classes to use on element.
	 */
	convertDefaults( settings ) {
		let names = [];

		for ( const setting of settings ) {
			let config = this.checkboxConfigs.find( ( val ) => val.name === setting );
			if ( config ) {
				names.push( config.name );
			}
		}

		return names;
	}

	/**
	 * Get the current settings of the control.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Current Settings including css.
	 */
	getSettings() {
		return {
			css: this.createCss(),
			media: this.hiddenDeviceNames
		};
	}

	/**
	 * Append all the checkboxes in the config to the control.
	 *
	 * @since 1.0.0
	 */
	_appendCheckboxes() {
		const $container = this.$control.find( '.checkboxes' );

		for ( const [ index, checkbox ] of this.checkboxConfigs.entries() ) {
			let checkboxArgs = this._createUniqueName( checkbox );
			this.checkboxConfigs[index].control = new Checkbox( checkboxArgs );
			$container.append( this.checkboxConfigs[index].control.render() );
			this._bind( checkbox );
		}

		// Preset after all are rendered.
		for ( const [ index, checkbox ] of this.checkboxConfigs.entries() ) {
			this._preset( checkbox );
		}
	}

	/**
	 * Create a unique name for a checkbox.
	 *
	 * Names are also used for Id's
	 *
	 * @since 1.0.0
	 *
	 * @param {object} checkbox Object.
	 */
	_createUniqueName( checkbox ) {
		return { ..._.clone( checkbox ), name: `${checkbox.name}-${_.random( 0, 100000 )}` };
	}

	/**
	 * Test to see if all checkboxes are checked.
	 *
	 * @since 1.0.0
	 *
	 * @return {boolean} Are they all checked?
	 */
	_allChecked() {
		return 0 === this.$control.find( '.checkboxes input:not(:checked)' ).length;
	}

	/**
	 * Preselect the checkbox based on the state of the element.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} checkbox Checkbox configuration object.
	 */
	_preset( checkbox ) {
		if ( this.$target.hasClass( checkbox.class ) || -1 !== this.hiddenDeviceNames.indexOf( checkbox.name ) ) {
			checkbox.control.$input.prop( 'checked', true ).change();
		}
	}

	/**
	 * Bind the event of the user checking a box.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} checkbox Checkbox configuration object.
	 */
	_bind( checkbox ) {
		const $input = checkbox.control.$input;

		$input.on( 'change', e => {
			const isChecked = $input.prop( 'checked' );

			if ( this._allChecked() ) {
				$input.prop( 'checked', false );
				return;
			}

			if ( isChecked ) {
				this.$target.addClass( checkbox.class );
				this.hiddenDeviceNames.push( checkbox.name );
				this.hiddenDeviceNames = _.uniq( this.hiddenDeviceNames );
			} else {
				this.$target.removeClass( checkbox.class );
				this.hiddenDeviceNames = _.without( this.hiddenDeviceNames, checkbox.name );
			}

			this.triggerChangeEvent();
		} );
	}

	/**
	 * Create css that can be saved.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} CSS.
	 */
	createCss() {
		let css = '';
		if ( this.options.control && this.options.control.selectors ) {
			for ( const name of this.hiddenDeviceNames ) {

				// Force the library to use the device we want.
				this.deviceSelection.$inputs
					.prop( 'checked', false )
					.filter( `[value="${name}"]` )
					.prop( 'checked', true )
					.change();

				css += this.deviceSelection
					.addMediaQuery( this.options.control.selectors.join( ',' ) + '{ display: none !important; }' );
			}
		}

		return css;
	}
}

export { Control as default };
