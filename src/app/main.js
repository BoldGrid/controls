import { Application as ComponentApplication } from '@boldgrid/components/src/app/js/main.js';

import {
	ColorPalette,
	StyleUpdater,
	ColorPaletteSelection,
	PaletteConfiguration,
	Padding,
	Margin,
	Border,
	BoxShadow,
	Slider,
	BorderRadius
} from '../controls';

import '@boldgrid/components/src/app/scss/main.scss';
import './main.scss';

export class Application {

	/**
	 * Initialize the app used for testing.
	 *
	 * @since 1.0.0
	 */
	init() {
		this.paletteConfig = new PaletteConfiguration();

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
		this.setupSlider();
		this.multislider();
	}

	setupSlider() {
		let $tab = $( '.slider-tab' );

		$tab.find( '.control' ).html( new Slider().render() );
	}

	multislider() {
		let $tab = $( '.directional-controls' ),
			$combined = $tab.find( '.combined' ),
			padding = new Padding( { target: $combined } ),
			border = new Border( { target: $combined } ),
			boxShadow = new BoxShadow( { target: $combined } ),
			borderRadius = new BorderRadius( { target: $combined } ),
			margin = new Margin( { target: $combined } );

		$tab.find( '.padding-control .control' ).html( padding.render() );
		$tab.find( '.margin-control .control' ).html( margin.render() );
		$tab.find( '.border-control .control' ).html( border.render() );
		$tab.find( '.border-radius .control' ).html( borderRadius.render() );
		$tab.find( '.box-shadow .control' ).html( boxShadow.render() );
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
				let savableState = this.paletteConfig.createSavableState( BOLDGRID.COLOR_PALETTE.Modify.state );
				console.log( 'State', savableState );
				console.log( 'State', JSON.stringify( savableState ) );
			}
		} );
	}
}
