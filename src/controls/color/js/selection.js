import '../scss/selection.scss';
import '../scss/pagination.scss';
import './control.js';
import ColorPalettes from '../config/color-lover.js';
import Generate from './generate.js';

var $ = window.jQuery;

export class Selection {
	constructor() {
		this.pageSize = 6;
		this.maxPages = 20;

		this.$control;
		this.$pagination;
		this.$selectedPalette;
		this.currentPage = 0;
		this.currentCount = 0;
		this.pages = [];

		this.colors = this._createAvailablePalettes();
		this._paginatePalettes();
	}

	/**
	 * Create the control.
	 *
	 * @since 1.0.0
	 *
	 * @param  {jQuery} $target Where the control should be rendered.
	 * @return {jQuery} Control Element.
	 */
	create() {
		this.$control = $( require( '../template/selection.html' ) );
		this.$paletteRows = this.$control.find( '.palette-rows' );
		this.$pagination = this.$control.find( '.bg-pagination' );

		this._bindEvents();
		this.updatePage( this.currentPage );

		return this.$control;
	}

	/**
	 * Update the current page.
	 *
	 * @since 1.0.0
	 *
	 * @param  {number} requested page number.
	 */
	updatePage( page ) {
		this.currentPage = Math.min( page, this.maxPages );
		this._displayCurrentPage();
		this.currPageAttr = this.currentPage;

		if ( this.maxPages <= this.currentPage ) {
			this.currPageAttr = 'last';
		}

		this.$pagination.attr( 'data-page', this.currPageAttr );
	}

	/**
	 * Get the colors for the currently selected palette.
	 *
	 * @since 1.0.0
	 *
	 * @return {array} Colors for the selected palette.
	 */
	getSelectedPalette() {
		return this.$selectedPalette[0].colors;
	}

	/**
	 * Create a list of all available palettes.
	 *
	 * @since 1.0.0
	 *
	 * @return {array} Colors
	 */
	_createAvailablePalettes() {
		let colors = [],
			generate = new Generate();

		for ( let palette of ColorPalettes ) {
			colors.push( palette );
			palette.push( generate.generateNeutralColor( palette ) );
		}

		return _.shuffle( colors );
	}

	/**
	 * Split a set of palettes into a page.
	 *
	 * @since 1.0.0
	 */
	_paginatePalette() {
		let currentView = [],
			iterrationMax = this.currentCount + this.pageSize;

		for ( let i = this.currentCount; iterrationMax > i; i++ ) {
			currentView.push( this.colors[i] );
		}

		this.currentCount = this.pageSize + this.currentCount;
		this.pages.push( currentView );
	}

	/**
	 * Split all palettes into pages.
	 *
	 * @since 1.0.0
	 */
	_paginatePalettes() {
		for ( let i = 0; this.maxPages >= i; i++ ) {
			this._paginatePalette();
		}
	}

	/**
	 * Display the currently selected page.
	 *
	 * @since 1.0.0
	 */
	_displayCurrentPage() {
		let $existingPageRows = this.$paletteRows.find( '[data-page-id="' + this.currentPage + '"]' );

		this.$paletteRows.find( '.palette-row' ).hide();

		if ( $existingPageRows.length ) {
			$existingPageRows.show();
			return;
		}

		let palettes = this.pages[this.currentPage];

		for ( let palette of palettes ) {
			let $row = this._createPaletteRow( palette );
			this.$paletteRows.append( $row );
		}
	}

	/**
	 * Bind all event for this control.
	 *
	 * @since 1.0.0
	 */
	_bindEvents() {
		this.$paletteRows.on( 'click', '.palette-row', event => {
			this._activate( $( event.currentTarget ) );
		} );

		this.$control.find( '.next a' ).on( 'click', event => {
			event.preventDefault();
			this.updatePage( this.currentPage + 1 );
		} );

		this.$control.find( '.prev a' ).on( 'click', event => {
			event.preventDefault();
			this.updatePage( this.currentPage - 1 );
		} );
	}

	/**
	 * Activate a palette.
	 *
	 * @since 1.0.0
	 *
	 * @param  {jQuery} target Palette to select.
	 */
	_activate( $target ) {
		let $selectedPaletteArea = this.$control.find( '.selected-palette' );
		this.$selectedPalette = $target;
		$selectedPaletteArea.find( '.palette-row' ).replaceWith( $target.clone() );
		$selectedPaletteArea.addClass( 'active' );
		this.$paletteRows.find( '.active' ).removeClass( 'active' );
		this.selectedPalette = $target.addClass( 'active' );
		this.$control.trigger( 'palette-selection', { palette: this.getSelectedPalette() } );
	}

	/**
	 * Create a single row with colors in a palette.
	 *
	 * @since 1.0.0
	 *
	 * @param  {array} colors List of colors in a palette.
	 * @return {jQuery}        New Color Row.
	 */
	_createPaletteRow( colors ) {
		let $li,
			$row = $( '<ul class="palette-row" data-page-id="' + this.currentPage + '">' );

		$row[0].colors = colors;
		for ( let color of colors ) {
			$li = $( '<li>' ).css( 'background-color', color );
			$row.append( $li );
		}

		return $row;
	}
}

export { Selection as default };
