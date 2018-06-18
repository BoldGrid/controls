import './style.scss';
import templateHTML from './template.html';
import { Storage } from '../storage';

export class Control {
	constructor() {
		this.storage = new Storage();
	}

	getItem( settingName ) {
		return this.storage.getItem( settingName );
	}

	render() {
		this.$control = $( templateHTML );
		this.$save = this.$control.find( '.save-settings' );
		this.$clear = this.$control.find( '.clear-storage' );

		$( 'save-ui' ).replaceWith( this.$control );
	}

	setup( settingName, getValueCb ) {
		this.$save.on( 'click', () => {
			this.storage.setItem( settingName, getValueCb( settingName ) );
			setTimeout( () => location.reload() );
		} );

		this.$clear.on( 'click', () => {
			this.storage.removeItem( settingName );
			setTimeout( () => location.reload() );
		} );
	}
}
