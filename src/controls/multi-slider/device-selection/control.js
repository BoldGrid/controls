const $ = jQuery;

import template from './template.html';
import './style.scss';
import unlinkIcon from '../img/unlink.svg';
import linkIcon from '../img/link.svg';
import titleCase from 'title-case';

export class Control {

	constructor( options ) {
		this.options = options || {};

		this.options.sizes = this.options.sizes || {

			// These are max widths.
			phone: 767, // 0 to 767 is phone.
			tablet: 991,  // 768 to 991 is tablet.
			desktop: 1199  // 992 to 1199 is desktop.

			// Large is 1200+
		};

		let maxRand = 1000000;
		this._id = _.random( 0, maxRand );
		this.template = _.template( template );
		this.$control = null;
		this.ranges = this._createDeviceRanges();

		this.devices = [
			{
				name: 'base',
				icon: require( '../../device-visibility/img/all-devices.svg' ),
				tooltip: 'All Devices'
			},
			{
				name: 'large',
				icon: require( '../../device-visibility/img/large.svg' )
			},
			{
				name: 'desktop',
				icon: require( '../../device-visibility/img/desktop.svg' )
			},
			{
				name: 'tablet',
				icon: require( '../../device-visibility/img/tablet.svg' )
			},
			{
				name: 'phone',
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
			id: this._id,
			titleCase: titleCase,
			linkIcon: linkIcon,
			unlinkIcon: unlinkIcon
		} ) );

		this.$inputs = this.$control.find( 'input' );
		this.$selectionText = this.$control.find( '.selection-text' );
		this.$relationship = this.$control.find( '.relationship' );

		return this.$control;
	}

	/**
	 * Update the current linked status.
	 *
	 * @since 1.0.0
	 *
	 * @param  {boolean} linked Is this device linked to the base?
	 */
	updateRelationship( linked ) {
		let title = 'Inherting from All Devices setting';

		if ( ! linked ) {
			title = 'Unlinked from All Devices setting';
		}

		this.$control.attr( 'data-relationship-linked', linked ? 1 : 0 );
		this.$relationship.attr( 'title', title );
	}

	/**
	 * Activate the requested device.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} device Device.
	 */
	activate( device ) {
		this.$inputs
			.filter( `#${this._id}-${device}` )
			.prop( 'checked', true )
			.change();
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
		ranges.phone.max = this.options.sizes.phone;

		ranges.tablet = {};
		ranges.tablet.min = ranges.phone.max + 1;
		ranges.tablet.max = this.options.sizes.tablet;

		ranges.desktop = {};
		ranges.desktop.min = ranges.tablet.max + 1;
		ranges.desktop.max = this.options.sizes.desktop;

		ranges.large = {};
		ranges.large.min = ranges.desktop.max + 1;

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
			range = this.ranges[ selectedValue ];

		if ( range ) {
			if ( range.min && range.max ) {
				prefix = `@media only screen and (max-width: ${range.max}px) and (min-width: ${range.min}px)`;
			} else if ( range.min && ! range.max ) {
				prefix = `@media only screen and ( min-width: ${range.min}px )`;
			} else if ( ! range.min && range.max ) {
				prefix = `@media only screen and ( max-width: ${range.max}px )`;
			}
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
