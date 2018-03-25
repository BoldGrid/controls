var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { Slider } from '../slider';
import { MultiSlider } from '../multi-slider';
import { FontFamily } from './family';
import { LineHeight } from './line-height';
import { LetterSpacing } from './letter-spacing';
import { FontSize } from './font-size';

export class Control {

	constructor( options ) {
		this.options = options;

		this.fontFamily = new FontFamily( { target: this.options.target } );
		this.fontSize = new FontSize( { target: this.options.target } );
		this.lineHeight = new LineHeight( { target: this.options.target } );
		this.letterSpacing = new LetterSpacing( { target: this.options.target } );
	}

	render() {
		const $template = $( template );

		$template.find( 'font-family' ).replaceWith( this.fontFamily.render() );
		$template.find( 'font-size' ).replaceWith( this.fontSize.render() );
		$template.find( 'line-height' ).replaceWith( this.lineHeight.render() );
		$template.find( 'letter-spacing' ).replaceWith( this.letterSpacing.render() );

		return $template;
	}
}
