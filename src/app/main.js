import { Application as ComponentApplication } from '@boldgrid/components/src/app/js/main.js';
import { ColorPalette, StyleUpdater, ColorPaletteSelection } from '../controls';
import '@boldgrid/components/src/app/scss/main.scss';
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
		this.styleUpdater.setup();

		this.renderControls();
	}

	/**
	 * Create the controls.
	 *
	 * @since 1.0.0
	 */
	renderControls() {
		this.paletteCustomize();
		this.paletteSelection();
	}

	paletteSelection() {
		let $tab = $( '.palette-selection-tab .control' ),
			$log = $( '.palette-selection-tab .log' ),
			paletteSelection = new ColorPaletteSelection(),
			$control = paletteSelection.create();

		$tab.html( $control );

		$control.on( 'palette-selection', ( e, data ) => {
			let logData = {
				colors: data.palette,
				time: new Date().getTime()
			};

			$log.append( '<div class="log-line">' + JSON.stringify( logData ) + '</div>' );
		} );
	}

	paletteCustomize() {
		let $tab = $( '.colors-tab' ),
			colorPalette = new ColorPalette(),
			$control = colorPalette.render( $tab.find( '.control' ) );

		$control.on( 'sass_compiled', ( e, data ) => {
			this.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			this.styleUpdater.update( {
				id: 'bg-controls-buttons',
				css: '*{color:red}',
				scss: 'dddd',
				proirity: 30
			} );

			$tab.find( '.css .content' ).html( data.result.text );
			$tab.find( '.scss .content' ).html( data.scss );
		} );
	}
}
