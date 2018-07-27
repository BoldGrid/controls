import template from './template.html';
import { Switch } from '../../switch';
import './style.scss';

export class TextEffect {
	constructor() {
		this.presets = [
			'bg-text-fx bg-text-fx-inset-text',
			'bg-text-fx bg-text-fx-shadows',
			'bg-text-fx bg-text-fx-glow',
			'bg-text-fx bg-text-fx-closeheavy',
			'bg-text-fx bg-text-fx-enjoy-css',
			'bg-text-fx bg-text-fx-retro',
			'bg-text-fx bg-text-fx-stroke'
		];
	}

	render() {
		this.switchControl = new Switch( {
			name: 'text-effect',
			direction: 'reverse',
			label: 'Text Effect'
		} );

		this.switchControl.render();

		this.$control = $( _.template( template )( {
			presets: this.presets
		} ) );

		this.$control.find( 'switch' ).replaceWith( this.switchControl.$element );

		return this.$control;
	}
}

export { TextEffect as default };
