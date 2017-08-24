import '../scss/control.scss';

export class Control {

	render( $target ) {
		let html = this.getTemplate();
		$target.append( html );
	}

	getTemplate() {
		return require( '../template.html' );
	}
}
