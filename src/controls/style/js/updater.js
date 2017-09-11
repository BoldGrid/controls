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
	init() {
		this._setup();
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

		/**
		 * name, priority, auto_update
		 */
		this.registeredStyles.push(
			_.defaults( data, {
				priority: 99
			} )
		);

		return _.last( this.registeredStyles );
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

		// Check if this has been registered.
		state.$tag.html( styleData.css );
	}

	/**
	 * Render all configured styles.
	 *
	 * @since 1.0.0
	 */
	addAllStyles() {
		for ( let style of this.stylesState ) {
			style.$tag = this.createStyleTag( style.id );
			style.$tag.html( this.stylesState.css );
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
	 * Run all Dom load events.
	 *
	 * @since 1.0.0
	 */
	_setup() {
		$( () => {
			this._initialRender();
		} );
	}

	/**
	 * When the DOM first loads, take all registered styles and them to the DOM.
	 *
	 * @since 1.0.0
	 */
	_initialRender() {
		for ( let style of this.registeredStyles ) {
			this.pushConfig( style );
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
