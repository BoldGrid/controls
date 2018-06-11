const $ = jQuery;

import template from './template.html';
import './style.scss';

export class Control {

	constructor( options ) {
		this.options = options || {};
		this._id = Math.random();
		this.template = _.template( template );
		this.$control = null;
		this.ranges = this._createDeviceRanges();

		this.devices = [
			{
				name: 'Desktop',
				icon: require( '../../device-visibility/img/desktop.svg' )
			},
			{
				name: 'Tablet',
				icon: require( '../../device-visibility/img/tablet.svg' )
			},
			{
				name: 'Phone',
				icon: require( '../../device-visibility/img/phone.svg' )
			}
		];
	}

	/**
	 * Render the control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control DOM element.
	 */
	render() {
		this.$control = $( this.template( {
			id: this._id
		} ) );

		this.$inputs = this.$control.find( 'input' );
		this.$selectionText = this.$control.find( '.selection-text' );

		return this.$control;
	}

	/**
	 * Add a media query to CSS given device selection.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} css CSS to wrap.
	 */
	addMediaQuery( css ) {
		let prefix = this._getMediaPrefix();
		return prefix ? `${prefix}{${css}}` : css;
	}

	/**
	 * Given a configuration of maximum screen sizes, create a list of ranges.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Devices ranges.
	 */
	_createDeviceRanges() {
		let ranges = {};
		ranges.phone = {};
		ranges.phone.min = 0;
		ranges.phone.max = this.options.phone;

		ranges.tablet = {};
		ranges.tablet.min = ranges.phone.max + 1;
		ranges.tablet.max = ranges.tablet;

		ranges.desktop = {};
		ranges.desktop.min = ranges.tablet.max + 1;
		ranges.desktop.max = this.options.desktop;

		return ranges;
	}

	/**
	 * Based on the user selection, get the media query prefix that we'll use.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Media Query prefix.
	 */
	_getMediaPrefix() {
		let prefix = '',
			selectedValue = this.getSelectedValue(),
			range = ranges[ selectedValue ];

		if ( range ) {
			prefix = `@media only screen and (min-width: ${range.min}px and max-width: ${range.min}px )`;
		}

		return prefix;
	}

	/**
	 * Get the currently selected value.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Device selected.
	 */
	getSelectedValue() {
		return this.$inputs.filter( ':checked' ).val();
	}

}
