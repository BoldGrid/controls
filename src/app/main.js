import { Application as ComponentApplication } from 'boldgrid-components/src/app/js/main.js';
import 'boldgrid-components/src/app/scss/main.scss';

import './main.scss';
import { Control as ColorControl } from '../controls/color/js/control.js';

export class Application {

	/**
	 * Initialize the app used for testing.
	 *
	 * @since 1.0.0
	 */
	init() {
		new ComponentApplication().init();
		this.renderControls();
	}

	/**
	 * Create the controls.
	 *
	 * @since 1.0.0
	 */
	renderControls() {
		let colorControl = new ColorControl();
		colorControl.render( $( '.colors-tab' ) );
		console.log( colorControl );
	}
}
