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

	constructor( options ) {
		this.options = options;

		this.selectStyleConfig = {
			minimumResultsForSearch: 10,
			width: '100%'
		};

		this.webFont = new WebFont( { $scope: $( 'html' ) } );
	}

	render() {
		const template = _.template( templateHtml )( {
			'fonts': googleFonts
		} );
		const $control = $( template );

		this.fonts = googleFonts;
		this.$familySelect = $control.find( '.font-family-control select' ).select2();
		this.$variantSelect = $control.find( '.font-variant-control select' ).select2( this.selectStyleConfig );
		this.$weightSelect = $control.find( '.font-weight-control select' ).select2( this.selectStyleConfig );

		this._bindEvents();

		return $control;
	}

	_bindEvents() {
		this._bindVarientDisplay();
		this._bindWeightOptions();
		this._bindWebFont();
		this._bindWeightChange();
	}

	getSelections() {
		return {
			family: this.$familySelect.val(),
			weight: this.$weightSelect.val(),
			variant: this.$variantSelect.val()
		};
	}

	_bindWeightOptions() {
		this.$familySelect.on( 'change', () => {
			const config = this.getSelectedConfig();
			let weights = config.variants[ this.$variantSelect.val() ];
			weights = Object.keys( weights );
			let defaultWeight = ( -1 !== weights.indexOf( '400' ) ) ? '400' : keys[0];

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

	_bindWeightChange() {
		this.$weightSelect.on( 'change', () => {
			const selections = this.getSelections();
			this.options.target.attr( 'data-font-weight', selections.weight );
			this.options.target.css( 'font-weight', selections.weight );
			this.webFont.updateFontLink();
		} );
	}

	_bindWebFont() {
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

	getSelectedConfig() {
		return this.fonts[ this.$familySelect.val() ];
	}

	_bindVarientDisplay() {
		this.$familySelect.on( 'change', () => {
			const fontConfig = this.getSelectedConfig(),
				keys = Object.keys( fontConfig.variants );

			// Update select.
			this.$variantSelect.empty();
			_.each ( fontConfig.variants, ( value, name ) => {
				this.$variantSelect.prepend( `<option value="${name}">${titleCase( name )}</option>` );
			} );

			// Refresh select 2.
			this.$variantSelect
				.prop( 'disabled', 1 === keys.length )
				.val( _.last( keys ) )
				.select2( this.selectStyleConfig );
		} );
	}
}
