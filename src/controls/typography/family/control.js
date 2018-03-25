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

		this.selectWeightConfig = {
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
		this.$varientSelect = $control.find( '.font-variant-control select' ).select2( this.selectWeightConfig );
		$control.find( 'font-weight' ).replaceWith( this.fontWeightRender() );

		this._bindEvents();

		return $control;
	}

	_bindEvents() {
		this._bindVarientDisplay();
		this._bindWebFont();
	}

	_bindWebFont() {
		this.$familySelect.on( 'change', () => {
			this.options.target.attr( 'data-font-family', this.$familySelect.val() );
			this.options.target.css( 'font-family', this.$familySelect.val() );
			this.webFont.updateFontLink();
		} );
	}

	fontWeightRender() {
		return new Slider( {
			name: 'font-weight',
			label: 'Font Weight',
			uiSettings: {
				step: 100,
				min: 100,
				max: 900
			}
		} ).render();
	}

	updateFontWeight( variants ) {
		console.log( variants );
	}

	getSelectedConfig() {
		return this.fonts[ this.$familySelect.val() ];
	}

	_bindVarientDisplay() {
		this.$familySelect.on( 'change', () => {
			const fontConfig = this.getSelectedConfig(),
				keys = Object.keys( fontConfig.variants );

			// Update select.
			this.$varientSelect.empty();
			_.each ( fontConfig.variants, ( value, name ) => {
				this.$varientSelect.prepend( `<option value="${name}">${titleCase( name )}</option>` );
			} );

			// Refresh select 2.
			this.$varientSelect
				.prop( 'disabled', 1 === keys.length )
				.val( _.last( keys ) )
				.select2( this.selectWeightConfig );

			// Update the font silder.
			this.updateFontWeight( fontConfig.variants[ keys[0] ] );
		} );
	}
}
