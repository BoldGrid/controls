import '../scss/control.scss';

export class Control {

	constructor() {
		this.palettes = {
			'palette_formats': [ 'palette-primary' ],
			'color-palette-size': 5,
			'palettes': {
				'default': true,
				'palette_id': '7501ccf9673539117844dc999ecf6010',
				'format': 'palette-primary',
				'neutral-color': '#ffffff',
				'copy_on_mod': true,
				'is_active': true,
				'colors': [
					'#8bbe1d',
					'#0047ab',
					'#0047ab',
					'#8bbe1d',
					'#2a2a2a'
				]
			},
			'saved_palettes': {
				'default': true,
				'palette_id': '7501ccf9673539117844dc999ecf6010',
				'active-id': 'palette-primary',
				'all': [],
				'neutral-color': '#ffffff',
				'active': [
					'#8bbe1d',
					'#0047ab',
					'#0047ab',
					'#8bbe1d',
					'#2a2a2a'
				]
			}
		};
	}

	render( $target ) {
		let html = this.getTemplate( );
		$target.append( html );
	}

	getTemplate( colorPalettes ) {
		let configs = {
			'palette_formats': {}

			//'colorPalatteColumns': $color_palettes['color-palette-size'] + ( (int) $has_neutral_color );
			// 'has_neutral_color': colorPalettes.palettes[0]['neutral-color']
		};

		return require( '../template.html' );
	}
}
