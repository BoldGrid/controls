import template from './template.html';

export class Control {
	constructor( options ) {
		this.options = _.defaults( options || {}, {
			title: 'My Checkbox'
		} );

		this.template = _.template( template );
	}

	render() {
		this.$element = $( this.template( this.options ) );

		return this.$element;
	}
}
