import { Direction } from '../direction';

export class Margin extends Direction {

	constructor( options ) {
		super( options );

		this.controlOptions = {
			'control': {
				'title': 'Margin',
				'name': 'margin',
				'units': {
					'default': 'px',
					'enabled': [
						'px'
					]
				}
			},
			'slider': {
				'px': {
					'min': -100,
					'max': 100
				},
				'%': {
					'min': -100,
					'max': 100
				}
			}
		};
	}

	render() {
		super.render();

		this.bindEvents();

		return this.$control;
	}

	bindEvents() {
		this.$control.on( 'slide-change', ( e, data ) => {
			this.$target.css( {
				'margin-left': data.left,
				'margin-right': data.right,
				'margin-top': data.top,
				'margin-bottom': data.bottom
			} );
		} );
	}

}

export { Margin as default };
