import '../scss/control.scss';
import SampleConfig from './sampleConfig.js';
import './control.js';
import txt from 'raw-loader!../scss/color-classes.scss';

export class Renderer {

	constructor( configs ) {
		let palettes;

		this.configs = configs || {};
		this.configs.sass = this.updateSassConfigs( this.configs.sass );
console.log( txt );
		palettes = $.extend( true, {}, SampleConfig );
		this.palettes = palettes;
		this.formatConfig();
	}

	updateSassConfigs( sassConfigs ) {
		window.BOLDGRIDSass = _.defaults( sassConfigs || {}, {
			WorkerUrl: './static/sass.worker.js',
			ScssFormatFileContents: '* { color: $palette-primary_1; }, * { color: $palette-primary_2; }, * { color: $palette-primary_3; }, * { color: $palette-primary_4; }',
			outputCssFilename: ''
		} );

		sassConfigs = window.BOLDGRIDSass;

		return sassConfigs;
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
		let html = this.getHtml(),
			$control = $( html );

		$target.append( html );

		$( function() {
			window.BOLDGRID.COLOR_PALETTE.Modify.init( $control );
		} );

		return $control;
	}

	getHtml( colorPalettes ) {
		let file = require( '../template.html' );

		return _.template( file )( { 'config': this.palettes } );
	}
}

export { Renderer as default };
