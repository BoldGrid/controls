import {
	DeviceVisibility
} from '../../controls';

export class Demo {

	constructor( saveUI, preview ) {
		this.saveUI = saveUI;
		this.preview = preview;
	}

	render() {
		let $tab = $( '.device-visibility' ),
			$demoElement = $tab.find( '.demo-element' ),
			name = 'deviceVisibility',
			control = new DeviceVisibility( {
				defaults: this.saveUI.getItem( 'deviceVisibility' ),
				control: {
					selectors: [ '.demo-element' ]
				}
			} );

		// Render the control.
		$tab.find( '.control' ).html( control.render() );

		// On change of the control, update the styles.
		control.events.on( 'change', ( settings ) => this.preview.appendStyles( name, settings.css ) );

		// When the user clicks on save, save the settings.
		this.saveUI.setup( name, () => control.getSettings() );

		// On Load, append the current setting styles to the head.
		this.preview.appendStyles( name, control.getSettings().css );
	}
}
