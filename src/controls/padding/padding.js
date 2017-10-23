import { Direction } from '../direction';

export class Padding extends Direction {

	constructor( options ) {
		super( options );

		this.controlOptions = {
			'control': {
				'title': 'Padding',
				'default': 'em',
				'units': {
					'enabled': [
						'px',
						'percentage',
						'em'
					]
				}
			},
			'slider': {
				'px': {
					'min': 0,
					'max': 100
				},
				'%': {
					'min': 0,
					'max': 100
				},
				'em': {
					'min': .1,
					'max': 5
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
				'padding-left': data.left,
				'padding-right': data.right,
				'padding-top': data.top,
				'padding-bottom': data.bottom
			} );
		} );
	}

}

export { Padding as default };
