window.BOLDGRID = window.BOLDGRID || {};
window.BOLDGRID.CONTROLS = {

	/*
	 * These 2 methods are hacks to make sure tinymce works.
	 */
	addStyles: ( $target, styles ) => {
		$target.css( styles );
	},
	addStyle: ( $target, prop, value ) => {
		$target.css( prop, value );
	}
};
