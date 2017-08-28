import '../scss/control.scss';
import SampleConfig from './sampleConfig.js';
import './control.js';

export class Renderer {

	constructor() {
		this.palettes = SampleConfig;
		this.formatConfig();
	}

	formatConfig() {
		this.palettes.hasNeutralColor = this.palettes.palettes[0]['neutral-color'] ? 1 : 0;
		this.palettes.colorPaletteColumns = this.palettes['color-palette-size'] + this.palettes.hasNeutralColor;
		this.assignNeutral();
	}

	assignNeutral() {
		for ( let palette of this.palettes.palettes ) {
			if ( palette['neutral-color'] ) {
				palette.colors.push( palette['neutral-color'] );
			}
		}
	}

	render( $target ) {
		let html = this.getHtml();
		$target.append( html );

		$( function() {

			if ( ! window.BOLDGRIDSass ) {
				window.BOLDGRIDSass = {};
				window.BOLDGRIDSass.WorkerUrl = '';
				window.BOLDGRIDSass.ScssFormatFileContents = '';
				window.BOLDGRIDSass.outputCssFilename = '';
			}

			window.BOLDGRID.COLOR_PALETTE.Modify.init( {
				enableCustomizerTransitions: false
			} );
		} );
	}

	getHtml( colorPalettes ) {
		let file = require( '../template.html' );

		return _.template( file )( { 'config': this.palettes } );
	}
}
