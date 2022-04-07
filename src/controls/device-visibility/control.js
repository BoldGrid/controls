var $ = window.jQuery;

import template from './template.html';
import { Checkbox } from '../checkbox';
import { Slider } from '../slider';

export class Control {
	constructor( options ) {
		this.options = options || {};
		this.$target = this.options.target;

		this.template = _.template( template );
		this.checkboxConfigs = [
			{
				name: 'phone-visibility',
				label: 'Phone',
				class: 'hidden-xs',
				icon: require( './img/phone.svg' )
			},
			{
				name: 'tablet-visibility',
				label: 'Tablet',
				class: 'hidden-sm',
				icon: require( './img/tablet.svg' )
			},
			{
				name: 'desktop-visibility',
				label: 'Desktop',
				class: 'hidden-md',
				icon: require( './img/desktop.svg' )
			},
			{
				name: 'large-visibility',
				label: 'Large Displays',
				class: 'hidden-lg',
				icon: require( './img/large.svg' )
			}
		];
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

		return this.$control;
	}

	/**
	 * Append all the checkboxes in the config to the control.
	 *
	 * @since 1.0.0
	 */
	_appendCheckboxes() {
		const $container = this.$control.find( '.checkboxes' );

		for ( const [ index, checkbox ] of this.checkboxConfigs.entries() ) {
			this.checkboxConfigs[index].control = new Checkbox( checkbox );
			$container.append( this.checkboxConfigs[index].control.render() );
			this._preset( checkbox );
			this._bind( checkbox );
		}
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
		if ( this.$target.hasClass( checkbox.class ) ) {
			checkbox.control.$input.prop( 'checked', true );
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
			} else {
				this.$target.removeClass( checkbox.class );
			}
		} );
	}
}

export { Control as default };
