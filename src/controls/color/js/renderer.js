var $ = window.jQuery;

import '../scss/control.scss';
import SampleConfig from './sampleConfig.js';
import './control.js';
import { Config } from './config.js';
import { Button as ButtonColors } from './button.js';
import { SassCompiler } from '../../style/js/sass-compiler.js';

export class Renderer {

	constructor( configs ) {
		this.configs = configs || {};

		// Clone object to prevent modification of the original.
		this.palettes = this._getPaletteSetting( this.configs.paletteSettings );

		this.formatConfig();

		// Create a new compiler.
		this.sassCompiler = new SassCompiler( this.configs.sass || {} );

		this.buttonColors = new ButtonColors( {
			sassCompiler: this.sassCompiler
		} );

		this.buttonColors.init();
	}

	_getPaletteSetting( setting ) {
		let colorConfig = new Config();

		if ( ! setting ) {
			setting = colorConfig.createSimpleConfig();
		}

		return $.extend( true, {}, setting );
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

		window.BOLDGRID.COLOR_PALETTE.Modify.init( $control );

		this.$control = $control;

		return $control;
	}

	getHtml( colorPalettes ) {
		let file = require( '../template.html' );

		return _.template( file )( { config: this.palettes } );
	}

	updateButtons( cb ) {
		this.buttonColors.compile( {
			colors: this.buttonColors.convertColorState( BOLDGRID.COLOR_PALETTE.Modify.state )
		}, ( result ) => {
			cb( result );
		} );
	}
}

export { Renderer as default };
