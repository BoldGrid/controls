// Import { Application as ComponentApplication } from 'boldgrid-components/src/app/js/main.js';

// import './main.scss';
import { Renderer as ColorRender } from '../controls/color/js/renderer.js';

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
		let colorRender = new ColorRender();
		colorRender.render( $( '.colors-tab' ) );
		console.log( colorRender );
	}
}
