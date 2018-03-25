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
		this.familyControl = new FontFamily();
		this.$target = options.target;
	}

	render() {
		const $template = $( template );

		$template.find( 'font-family' ).replaceWith( this.familyControl.render() );
		$template.find( 'font-size' ).replaceWith( new FontSize( { target: this.$target } ).render() );
		$template.find( 'line-height' ).replaceWith( new LineHeight( { target: this.$target } ).render() );
		$template.find( 'letter-spacing' ).replaceWith( new LetterSpacing( { target: this.$target } ).render() );

		return $template;
	}
}
