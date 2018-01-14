import template from './template.html';
import './style.scss';

export class Control {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			name: _.random( 0, 10000 ),
			label: 'My Checkbox'
		} );

		this.template = _.template( template );
	}

	/**
	 * Create a checkbox and return the html.
	 *
	 * @since 1.0.0
	 *
	 * @return {jQuery} Control created.
	 */
	render() {
		this.$element = $( this.template( this.options ) );
		this.$input = this.$element.find( 'input' );

		return this.$element;
	}
}
