import { Direction } from '../direction';
import template from './template.html';
import './style.scss';

export class Border extends Direction {

	constructor( options ) {
		super( options );

		this.controlOptions = {
			'control': {
				'title': 'Border Width',
				'name': 'border-width',
				'units': {
					'default': 'px',
					'enabled': [
						'px'
					]
				}
			},
			'slider': {
				'px': {
					'min': 0,
					'max': 15
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

		$control = this.$typeControl.add( this.$control );

		return $control;
	}

	/**
	 * Bind all events.
	 *
	 * @since 1.0.0
	 */
	bindEvents() {
		this._bindWidthChange();
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
		this.$typeControl.find( 'input' )
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
		this.$typeControl.find( 'input' ).on( 'change', ( e ) => {
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

	/**
	 * Update css as the control fires updates,
	 *
	 * @since 1.0.0
	 */
	_bindWidthChange() {
		this.$control.on( 'slide-change', ( e, data ) => {
			this.$target.css( {
				'border-left-width': data.left,
				'border-right-width': data.right,
				'border-top-width': data.top,
				'border-bottom-width': data.bottom
			} );
		} );
	}

}

export { Border as default };
