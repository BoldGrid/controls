import { Application as ComponentApplication } from 'boldgrid-components/src/app/js/main.js';
import { ColorPalette } from '../controls';
import { Updater as StyleUpdater } from '../controls/style/js/updater.js';
import 'boldgrid-components/src/app/scss/main.scss';
import './main.scss';

export class Application {

	/**
	 * Initialize the app used for testing.
	 *
	 * @since 1.0.0
	 */
	init() {
		new ComponentApplication().init();

		// Instantiate the css loader.
		this.styleUpdater = new StyleUpdater( document );
		this.styleUpdater.init();

		this.renderControls();
	}

	/**
	 * Create the controls.
	 *
	 * @since 1.0.0
	 */
	renderControls() {
		let $tab = $( '.colors-tab' ),
			colorPalette = new ColorPalette(),
			$control = colorPalette.render( $tab.find( '.control' ) );


		$control.on( 'sass_compiled', ( e, data ) => {

			this.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			$tab.find( '.css .content' ).html( data.result.text );
			$tab.find( '.scss .content' ).html( data.scss );
		} );
	}
}
