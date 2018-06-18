import { Application as ComponentApplication } from '@boldgrid/components/src/app/js/main.js';

import {
	ColorPalette,
	StyleUpdater,
	ColorPaletteSelection,
	PaletteConfiguration,
	Animation,
	Slider,
	DeviceVisibility
} from '../controls';

import { Preview } from './preview';
import '@boldgrid/components/src/app/scss/main.scss';
import './main.scss';
import { Control as Save } from './save';

// Import Demo files.
import { Demo as MultiSliderDemo } from './multi-slider';
import { Demo as DeviceVisibilityDemo } from './device-visibility/demo';

export class Application {

	/**
	 * Initialize the app used for testing.
	 *
	 * @since 1.0.0
	 */
	init() {
		this.paletteConfig = new PaletteConfiguration();
		this.preview = new Preview();

		new ComponentApplication().init();

		this.saveUI = new Save();
		this.saveUI.render();

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
		this.setupSlider();
		new MultiSliderDemo( this.saveUI ).render();
		this.animation();
		new DeviceVisibilityDemo( this.saveUI, this.preview ).render();
	}

	setupSlider() {
		let $tab = $( '.slider-tab' );

		$tab.find( '.control' ).html( new Slider().render() );
	}

	/**
	 * Set up animation demo control.
	 *
	 * @since 0.10.0
	 */
	animation() {
		let $tab = $( '.animations-tab' ),
			$demoElement = $tab.find( '.demo-element' );

		$tab.find( '.control' ).html( new Animation( {
			target: $demoElement
		} ).render() );
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
		let $control,
			$tab = $( '.colors-tab' ),
			colorPalette = new ColorPalette();

		colorPalette.init();

		$control = colorPalette.render( $tab.find( '.control' ) );

		$control.on( 'sass_compiled', ( e, data ) => {
			this.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			$tab.find( '.css' ).show();

			if ( BOLDGRID.COLOR_PALETTE.Modify.state ) {
				let savableState = this.paletteConfig.createSavableState(
					BOLDGRID.COLOR_PALETTE.Modify.state
				);
				console.log( 'State', savableState );
				console.log( 'State', JSON.stringify( savableState ) );
			}
		} );
	}
}
