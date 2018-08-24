import templateHtml from './template.html';
import googleFonts from 'google-fonts-complete';
import systemFonts from './system-fonts.js';
import './style.scss';
import '../../util';
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

		this.defaultWeights = [ '400', '600' ];

		this.weightNames = {
			200: 'Thin',
			300: 'Light',
			400: 'Regular',
			500: 'Medium',
			600: 'Bold',
			700: 'Thick'
		};

		this.commonFonts = [

			// sansSerif.
			'Open Sans',
			'Roboto',
			'Lato',
			'Montserrat',
			'Oswald',

			// serif
			'Merriweather',
			'Roboto Slab',
			'EB Garamond',
			'Alegreya',
			'PT Serif'
		];

		this.selectStyleConfig = {
			minimumResultsForSearch: 10,
			width: '100%'
		};

		this.fonts = this.options.fonts || [];
		this.fonts = this.fonts.concat( [
			{
				sectionName: 'Common Fonts',
				type: 'inline',
				options: _.invert( this.commonFonts )
			},
			{
				sectionName: 'System Fonts',
				type: 'inline',
				options: systemFonts
			},
			{
				sectionName: 'Google Fonts',
				type: 'inline',
				options: googleFonts
			}
		] );

		this.webFont = new WebFont( { $scope: this.options.target.closest( 'html' ) } );
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
			options: this.fonts,
			defaultWeights: this.defaultWeights
		} );
		const $control = $( template );

		this.$familySelect = $control
			.find( '.font-family-control select' )
			.select2( this.selectStyleConfig );

		this.$variantSelect = $control
			.find( '.font-variant-control select' )
			.select2( this.selectStyleConfig );

		this.$weightControl = $control.find( '.font-weight-control' );
		this.$weightSelect = $control
			.find( '.font-weight-control select' )
			.select2( this.selectStyleConfig );


		this._preset();
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
		return ! this._getSystemFont() ? googleFonts[this.$familySelect.val()] || {} : {};
	}

	/**
	 * Given the attributes font the family selection populate the dropdowns.
	 *
	 * @since 1.0.0
	 */
	_preset() {
		let family = this.options.target.attr( 'data-font-family' ),
			weight = this.options.target.attr( 'data-font-weight' ),
			style = this.options.target.attr( 'data-font-style' );

		// If the target has the bg-font class, select the font from the menu.
		if ( this.hasFontClass() ) {
			let fontClass = this.getFontClass();
			let value = this.$familySelect.find( `[data-font-class="${fontClass}"]` ).attr( 'value' );
			this.$familySelect.val( value ).change();
		} else if ( family && this.$familySelect.find( '[value="' + family + '"]' ).length ) {
			this.$familySelect.val( family ).change();
		}
		this._updateWeightSelection();

		if ( weight && this.$weightSelect.find( '[value="' + weight + '"]' ).length ) {
			this.$weightSelect.val( weight ).change();
		}

		if ( style && this.$variantSelect.find( '[value="' + style + '"]' ).length ) {
			this.$variantSelect.val( style ).change();
		}
	}

	/**
	 * Get the the font class on the element.
	 *
	 * @since 1.0.0
	 *
	 * @return {string} Classname.
	 */
	getFontClass() {
		let classString = this.options.target.attr( 'class' );
		let matches = classString.match( /(^|\s)bg-font-family-\S+/g );

		let className = false;
		if ( matches && matches.length ) {
			className = matches[ 0 ] || '';
			className = className.trim();
		}

		return className;
	}

	/**
	 * Get the configured system font
	 *
	 * @since 1.0.0
	 *
	 * @return {boolean} system font.
	 */
	_getSystemFont() {
		return systemFonts[ this.$familySelect.val() ];
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
			window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-weight', selections.weight );

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
			window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-style', selections.variant );
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
			const $selection = this.$familySelect.find( ':checked' );
			const type = $selection.data( 'font-type' );

			if ( 'class' === type ) {
				this.applyClassFont( $selection );
			} else {
				this.applyInlineFont();
			}

			this.webFont.updateFontLink();
		} );
	}

	/**
	 * Add the selected font class to the element.
	 *
	 * @since 1.0.0
	 *
	 * @param  {$} $selection Current Selection.
	 */
	applyClassFont( $selection ) {
		let className = $selection.data( 'font-class' );

		this.removeFontClasses();
		this.options.target.addClass( className );
		this.options.target.removeAttr( 'data-font-family' );
		this.options.target.removeAttr( 'data-font-weight' );
		window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-weight', '' );
	}

	/**
	 * Remove all font class names.
	 *
	 * @since 1.0.0
	 */
	removeFontClasses() {
		this.options.target.removeClass( ( index, className ) => {
			return ( className.match( /(^|\s)bg-font-family-\S+/g ) || [] ).join( ' ' );
		} );
	}

	/**
	 * Check if the target has a font class.
	 *
	 * @since 1.0.0
	 *
	 * @return {Boolean} Does the elemt have a font class.
	 */
	hasFontClass() {
		return this.options.target.is( '[class*="bg-font-family-"]' );
	}

	/**
	 * Add the styles for fonts that are applied inline.
	 *
	 * @since 1.0.0
	 */
	applyInlineFont() {
		const selections = this.getSelections();
		const systemFont = this._getSystemFont();

		this.removeFontClasses();
		this.options.target.attr( 'data-font-family', selections.family );
		this.options.target.attr( 'data-font-weight', selections.weight );
		this.options.target.attr( 'data-font-style', selections.variant );

		if ( systemFont ) {
			window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-family', systemFont.style );
		} else {
			window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-family', selections.family );
		}

		window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-weight', selections.weight );
		window.BOLDGRID.CONTROLS.addStyle( this.options.target, 'font-style', selections.variant );
	}

	/**
	 * When the user changes their family, also change update the available weights.
	 *
	 * @since 1.0.0
	 */
	_bindWeightOptions() {
		this.$familySelect.on( 'change', () => this._updateWeightSelection() );
	}

	/**
	 * Update the list of avilable font weights.
	 *
	 * @since 1.0.0
	 */
	_updateWeightSelection() {
		const config = this.getSelectedConfig(),
			varient = this.$variantSelect.val() || 'normal',
			$selectedElement = this.$familySelect.find( ':checked' );
		let weights = config.variants ? config.variants[varient] || {} : {};

		this.$weightControl.toggle( 'class' !== $selectedElement.data( 'font-type' ) );

		weights = Object.keys( weights );
		weights = weights.concat( this.defaultWeights );

		let defaultWeight = '400';

		// Add bold to weights.
		weights.sort();
		weights = _.uniq( weights );

		this.$weightSelect.empty();

		for ( let weight of weights ) {
			let text = this.weightNames[ parseInt( weight, 10 ) ] || '';
			text = text ? `${weight} (${text})` : weight;
			this.$weightSelect.append( `<option value="${weight}">${text}</option>` );
		}

		this.$weightSelect
			.prop( 'disabled', 1 === weights.length )
			.val( defaultWeight )
			.select2( this.selectStyleConfig );
	}
}
