import templateHtml from './template.html';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import googleFonts from 'google-fonts-complete';
import './style.scss';
import $ from 'jquery';
import titleCase from 'title-case';
import { Slider } from '../../slider';
import { WebFont } from './webfont';

export class Control {

	/**
	 * Setup required dependcies and properties.
	 *
	 * @since 1.0.0
	 *
	 * @param  {array} options Options.
	 */
	constructor( options ) {
		this.options = options;

		this.selectStyleConfig = {
			minimumResultsForSearch: 10,
			width: '100%'
		};

		this.webFont = new WebFont( { $scope: $( 'html' ) } );
	}

	/**
	 * Creates a jQuery Control.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control.
	 */
	render() {
		const template = _.template( templateHtml )( {
			fonts: googleFonts
		} );
		const $control = $( template );

		this.fonts = googleFonts;
		this.$familySelect = $control.find( '.font-family-control select' ).select2();

		this.$variantSelect = $control
			.find( '.font-variant-control select' )
			.select2( this.selectStyleConfig );

		this.$weightSelect = $control
			.find( '.font-weight-control select' )
			.select2( this.selectStyleConfig );

		this._bindEvents();

		return $control;
	}

	/**
	 * Get the current selections.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Selected value of the 3 related options.
	 */
	getSelections() {
		return {
			family: this.$familySelect.val(),
			weight: this.$weightSelect.val(),
			variant: this.$variantSelect.val()
		};
	}

	/**
	 * Get the selected font configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return {object} Font configuration.
	 */
	getSelectedConfig() {
		return this.fonts[this.$familySelect.val()];
	}

	/**
	 * Setup all events for this class.
	 *
	 * @since 1.0.0
	 */
	_bindEvents() {

		// When user changes Family selection also update related options.
		this._bindWeightOptions();

		// Bind events when user changes selection.
		this._bindFamilyChange();
		this._bindStyleChange();
		this._bindWeightChange();
	}

	/**
	 * Update the selected Weight, sets css.
	 *
	 * @since 1.0.0
	 */
	_bindWeightChange() {
		this.$weightSelect.on( 'change', () => {
			const selections = this.getSelections();
			this.options.target.attr( 'data-font-weight', selections.weight );
			this.options.target.css( 'font-weight', selections.weight );
			this.webFont.updateFontLink();
		} );
	}

	/**
	 * Updates the selected style, sets CSS.
	 *
	 * @since 1.0.0
	 */
	_bindStyleChange() {
		this.$variantSelect.on( 'change', () => {
			const selections = this.getSelections();
			this.options.target.attr( 'data-font-style', selections.variant );
			this.options.target.css( 'font-style', selections.variant );
			this.webFont.updateFontLink();
		} );
	}

	/**
	 * When the font selection is changed, set all the default settings for that font.
	 *
	 * @since 1.0.0
	 */
	_bindFamilyChange() {
		this.$familySelect.on( 'change', () => {
			const selections = this.getSelections();

			this.options.target.attr( 'data-font-family', selections.family );
			this.options.target.attr( 'data-font-weight', selections.weight );
			this.options.target.attr( 'data-font-style', selections.variant );
			this.options.target.css( 'font-family', selections.family );
			this.options.target.css( 'font-weight', selections.weight );
			this.options.target.css( 'font-style', selections.variant );

			this.webFont.updateFontLink();
		} );
	}

	/**
	 * When the user changes their family, also change update the available weights.
	 *
	 * @since 1.0.0
	 */
	_bindWeightOptions() {
		this.$familySelect.on( 'change', () => {
			const config = this.getSelectedConfig();
			let weights = config.variants[this.$variantSelect.val()] || {};
			weights = Object.keys( weights );
			weights = weights.concat( [ '400', '600' ] );

			let defaultWeight = '400';

			// Add bold to weights.
			weights.sort();
			weights = _.uniq( weights );

			this.$weightSelect.empty();

			for ( const weight of weights ) {
				this.$weightSelect.append( `<option value="${weight}">${weight}</option>` );
			}

			this.$weightSelect
				.prop( 'disabled', 1 === weights.length )
				.val( defaultWeight )
				.select2( this.selectStyleConfig );
		} );
	}

}
