var $ = jQuery;

export class Updater {
	constructor( context ) {
		this.$head = $( context ).find( 'head' );

		/**
		 * Styles registered to be loaded or added after init.
		 *
		 * @type {Array}
		 */
		this.registeredStyles = [];

		/**
		 * Renderable styles.
		 *
		 * @type {Array}
		 */
		this.stylesState = [];
	}

	/**
	 * Initialize this class.
	 *
	 * @since 1.0.0
	 */
	setup() {
		this._loadStyles();
	}

	/**
	 * Get the stylesheet CSS.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Get the stylesheet CSS.
	 */
	getStylesheetCss() {
		let css = '';

		for ( let style of this.stylesState ) {
			css += style.css;
		}

		return css;
	}

	/**
	 * Register a new style to be added when the DOM is loaded.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Object} data Styles.
	 * @return {Object}      Configured Style.
	 */
	register( data ) {
		if ( ! data.id ) {
			throw 'Register Sass: Must Provide Name value.';
		}

		/*
		 * Name, priority, auto_update
		 */
		this.registeredStyles.push(
			_.defaults( data, {
				priority: 99
			} )
		);

		return _.last( this.registeredStyles );
	}

	/**
	 * Given an array opf configs, register and add each of them.
	 *
	 * @since 1.0.0
	 *
	 * @param  {array} configuration Configuration.
	 */
	loadSavedConfig( configuration ) {
		for ( let config of configuration ) {
			this.register( config );
		}
	}

	/**
	 * Add or update style into the dom.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Object} styleData Data used for style.
	 */
	update( styleData ) {
		let state = _.find( this.stylesState, state => {
			return state.id === styleData.id;
		} );

		if ( ! state ) {

			// Push into the style state.
			state = this._createState( styleData );
		}

		state.$tag.html( styleData.css );
		state.css = styleData.css;
		state.scss = styleData.scss;
	}

	/**
	 * Render all configured styles.
	 *
	 * @since 1.0.0
	 */
	addAllStyles() {
		for ( let style of this.stylesState ) {
			style.$tag = this.createStyleTag( style.id );
			style.$tag.html( style.css );
			this.$head.append( style.$tag );
		}
	}

	/**
	 * Create a style html tag.
	 *
	 * @since 1.0.0
	 *
	 * @param  {string} id Id for style.
	 * @return {jQuery}    Created Style tag.
	 */
	createStyleTag( id ) {
		return $( '<style type="text/css" id="' + id + '"></style>' );
	}

	/**
	 * When the DOM first loads, take all registered styles and them to the DOM.
	 *
	 * @since 1.0.0
	 */
	_loadStyles() {
		for ( let style of this.registeredStyles ) {
			this._pushComponent( style );
		}

		this._sort();
		this.addAllStyles();
	}

	/**
	 * Add a configuration to renderable states.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Object} config Registered States.
	 */
	_pushComponent( config ) {
		this.stylesState.push( config );
	}

	/**
	 * Create a state
	 *
	 * @since 1.0.0
	 *
	 * @param  {Object} config Configuration for style.
	 * @return {Object}        Configured state.
	 */
	_createState( config ) {
		config = this.register( config );
		this._pushComponent( config );
		this._sort();

		this._insertNewtag( config );

		return config;
	}

	/**
	 * Insert style tag into DOM.
	 *
	 * @since 1.0.0
	 *
	 * @param  {Object} config Configuration for style.
	 */
	_insertNewtag( config ) {
		let prevIndex, newStateIndex;

		newStateIndex = _.findIndex( this.stylesState, state => {
			return state.id === config.id;
		} );

		// Create new style tag.
		config.$tag = this.createStyleTag( config.id );

		// Find the index before mine, and insert the html after.
		prevIndex = newStateIndex - 1;
		if ( -1 !== prevIndex ) {
			this.stylesState[prevIndex].$tag.after( config.$tag );
		} else {
			this.$head.append( config.$tag );
		}
	}

	/**
	 * Sort all states by priority.
	 *
	 * @since 1.0.0
	 */
	_sort() {
		this.stylesState = _.sortBy( this.stylesState, 'priority' );
	}
}
