var $ = window.jQuery;

import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { Select } from '../select';

export class Icon extends Select {
	constructor() {
		super( { target: $( '<div>' ) } );

		this.direction = 'right';
		this.icons = [
			'angle',
			'angle-double',
			'chevron',
			'chevron-circle',
			'arrow-circle',
			'arrow-circle-o',
			'arrow',
			'caret',
			'caret-square-o',
			'hand-o',
			'long-arrow',
			'toggle'
		];

		this.controlOptions = {
			title: 'Icon',
			name: 'carousel-icon',
			property: 'invalid',
			options: []
		};

		this._appendOptions();
		this.selectStyleConfig.minimumResultsForSearch = 20;
		this.selectStyleConfig.templateResult = ( icon ) => this.template( icon );
		this.selectStyleConfig.templateSelection = ( icon ) => this.template( icon );
	}

	/**
	 * Take the list of options and append them in the correct format to the select config.
	 *
	 * @since 1.0.0
	 */
	_appendOptions() {
		for ( let icon of this.icons ) {
			let config = {};
			config[ icon ] = icon;

			this.controlOptions.options.push( {
				value: icon,
				label: icon
			} );
		}
	}

	/**
	 * Template callback to set rendering format.
	 *
	 * @since 1.0.0
	 *
	 * @param  {object} icon
	 * @return {$}            jQuery object.
	 */
	template( icon ) {
		return $( `<i class="fa fa-${icon.id}-${this.direction}"></i>` );
	}
}
