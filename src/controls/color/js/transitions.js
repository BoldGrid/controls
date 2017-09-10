var self, colorPalette,
	jQuery = window.$;

window.BOLDGRID = window.BOLDGRID || {};
window.BOLDGRID.COLOR_PALETTE = window.BOLDGRID.COLOR_PALETTE || {};
window.BOLDGRID.COLOR_PALETTE.Modify = window.BOLDGRID.COLOR_PALETTE.Modify || {};

colorPalette = window.BOLDGRID.COLOR_PALETTE.Modify;
self = colorPalette;

/**
 * Get the body of the previewer iframe.
 *
 * @since 1.1.7
 *
 * @return jQuery Body of iframe.
 */
colorPalette.getPreviewerBody = function() {

	if ( ! self.configs.enableCustomizerTransitions ) {
		return $();
	}

	// Get the previewer frame.
	return $( wp.customize.previewer.container )
		.find( 'iframe' ).last().contents().find( 'body' );
};

/**
 * Add the color palette transitions class to the body of the iframe.
 * This allows transitions to affect all elements, class is removed after the direation
 * of the transition.
 *
 * @since 1.1.7
 */
colorPalette.addColorTransition = function() {
	var $previewerBody,
		timeout = 600,
		curTime = new Date().getTime();

	if ( ! self.configs.enableCustomizerTransitions ) {
		return;
	}

	$previewerBody = colorPalette.getPreviewerBody();

	$previewerBody.addClass( 'color-palette-transitions duration-long' );
	self.lastTransitionTime = curTime;
	setTimeout( function() {
		if ( self.lastTransitionTime === curTime ) {
			$previewerBody.removeClass( 'color-palette-transitions duration-long' );
		}
	}, timeout );
};
