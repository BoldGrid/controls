var $ = window.jQuery;

import { MultiSlider } from '../multi-slider';
import template from './template.html';
import './style.scss';

export class Border extends MultiSlider {
	constructor( options ) {
		super( options );

		this.controlOptions = {
			control: {
				title: 'Border Width',
				name: 'border-width',
				units: {
					default: 'px',
					enabled: [ 'px', 'em' ]
				}
			},
			slider: {
				px: {
					step: 0.1,
					min: 0,
					max: 15
				},
				em: {
					min: 0,
					max: 5,
					step: 0.1
				}
			}
		};
	}

	/**
	 * Create a control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control.
	 */
	render() {
		let $control;

		super.render();

		this.$typeControl = $( template );

		this.bindEvents();

		$control = this.$typeControl.append( this.$control );

		return $control;
	}

	/**
	 * Bind all events.
	 *
	 * @since 1.0.0
	 */
	bindEvents() {
		this._bindTypeChange();
		this.setDefaultType( this.$target.css( 'border-style' ) );
	}

	/**
	 * Set the default type.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} style Border style.
	 */
	setDefaultType( style ) {
		this.$typeControl
			.find( 'input' )
			.filter( '[value="' + style + '"]' )
			.prop( 'checked', true )
			.change();
	}

	/**
	 * When the border type changes, update the css.
	 *
	 * @since 1.0.0
	 */
	_bindTypeChange() {
		this.$typeControl.find( 'input' ).on( 'change', e => {
			let $this = $( e.target ),
				val = $this.val();

			this.$target.css( {
				'border-style': val
			} );

			this.$control.trigger( 'type-change', val );

			if ( val ) {
				this.$control.show();
			} else {
				this.$control.hide();
			}
		} );
	}
}

export { Border as default };
