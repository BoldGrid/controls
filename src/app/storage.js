export class Storage {
	constructor() {
		this.namespace = 'bgControls';
	}

	/**
	 * Get an item from local storage.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} key Items index.
	 * @return {any}        Value of item.
	 */
	getItem( key ) {
		const storage = this.getStorage();
		return storage[key];
	}

	/**
	 * Set a namespaced item within local storage.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} key   Key to save under.
	 * @param {string} value Value to save.
	 */
	setItem( key, value ) {
		const storage = this.getStorage();
		storage[key] = value;
		localStorage.setItem( this.namespace, JSON.stringify( storage ) );
	}

	/**
	 * Set a namespaced item within local storage.
	 *
	 * @since 1.0.0
	 *
	 * @param {string} key   Key to delete.
	 */
	removeItem( key ) {
		const storage = this.getStorage();
		delete storage[key];
		localStorage.setItem( this.namespace, JSON.stringify( storage ) );
	}

	/**
	 * Remove All localstorage items.
	 *
	 * @since 1.0.0
	 */
	clear() {
		localStorage.removeItem( this.namespace );
	}

	/**
	 * Get storage, cover.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Get entire storage object.
	 */
	getStorage() {
		const storage = localStorage.getItem( this.namespace ) || '{}';
		return JSON.parse( storage );
	}
}
