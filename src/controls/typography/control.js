var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { Slider } from '../slider';
import { FontFamily } from './family';

export class Control {

	constructor() {
		this.familyControl = new FontFamily();
	}

	render() {
		const $template = $( template );

		$template.find( 'font-family' ).replaceWith( this.familyControl.render() );
		$template.find( 'font-size' ).replaceWith( this.fontSizeRender() );
		$template.find( 'line-height' ).replaceWith( this.lineHeightRender() );
		$template.find( 'letter-spacing' ).replaceWith( this.letterSpacingRender() );

		return $template;
	}

	fontSizeRender() {
		return new Slider( {
			name: 'font-size',
			label: 'Font Size',
			uiSettings: {
				min: 1,
				max: 100
			}
		} ).render();
	}

	lineHeightRender() {
		return new Slider( {
			name: 'line-height',
			label: 'Line Height',
			uiSettings: {
				min: 0,
				max: 10
			}
		} ).render();
	}

	letterSpacingRender() {
		return new Slider( {
			name: 'letter-spacing',
			label: 'Letter Spacing',
			uiSettings: {
				min: 0,
				max: 10
			}
		} ).render();
	}
}
