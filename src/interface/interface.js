import './interface.scss';
import { Control as ColorControl } from '../controls/color/js/control.js';

export class Interface {

	/**
	 * Initialize the interface used for testing.
	 *
	 * @since 1.0.0
	 */
	init() {
		this.initTabs();
		this.renderControls();
	}

	/**
	 * Create the controls.
	 *
	 * @since 1.0.0
	 */
	renderControls() {
		let colorControl = new ColorControl();
		colorControl.render( $( '#tabs-2' ) );
		console.log( colorControl );
	}

	initTabs() {
		$( '#tabs' ).tabs();
	}
}
