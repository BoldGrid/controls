var $ = window.jQuery;

import template from './template.html';
import './style.scss';
import { Slider } from '../slider';
import { MultiSlider } from '../multi-slider';
import { FontFamily } from './family';
import { LineHeight } from './line-height';
import { LetterSpacing } from './letter-spacing';
import { FontTransform } from './transform';
import { FontColor } from './font-color';
import { FontSize } from './font-size';
import { TextShadow } from './text-shadow';
import { TextEffect } from './text-effect';
import { TextDecoration } from './decoration';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';

export class Control {

	/**
	 * Instantiate all related controls.
	 *
	 * @since 1.0.0
	 */
	constructor( options ) {
		this.options = options;

		this.fontFamily = new FontFamily( this.options );
		this.fontSize = new FontSize( this.options );
		this.lineHeight = new LineHeight( this.options );
		this.letterSpacing = new LetterSpacing( this.options );
		this.fontTransform = new FontTransform( this.options );
		this.textDecoration = new TextDecoration( this.options );
		this.textShadow = new TextShadow( this.options );
		this.textEffect = new TextEffect( this.options );
		this.fontColor = new FontColor( this.options );
	}

	/**
	 * Render the entire typography control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} jQuery.
	 */
	render() {
		const $template = $( template );

		$template.find( 'font-family' ).replaceWith( this.fontFamily.render() );
		$template.find( 'font-size' ).replaceWith( this.fontSize.render() );
		$template.find( 'line-height' ).replaceWith( this.lineHeight.render() );
		$template.find( 'letter-spacing' ).replaceWith( this.letterSpacing.render() );
		$template.find( 'transform' ).replaceWith( this.fontTransform.render() );
		$template.find( 'text-decoration' ).replaceWith( this.textDecoration.render() );
		$template.find( 'text-shadow' ).replaceWith( this.textShadow.render() );
		$template.find( 'text-effect' ).replaceWith( this.textEffect.render() );
		$template.find( 'font-color' ).replaceWith( this.fontColor.render() );

		this._setupShadowSwitch();

		return $template;
	}

	/**
	 * Close 1 switch when the other 1 opens.
	 *
	 * @since 1.0.0
	 */
	_setupShadowSwitch() {
		this.textShadow.events.on( 'open', () => {
			this.textEffect.switchControl.setChecked( false );
		} );
		this.textEffect.events.on( 'open', () => {
			this.textShadow.switchControl.setChecked( false );
		} );
	}
}
