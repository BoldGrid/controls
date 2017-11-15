var self,
	colorPalette,
	$ = window.jQuery,
	$window = $( window );

window.BOLDGRID = window.BOLDGRID || {};
window.BOLDGRID.COLOR_PALETTE = window.BOLDGRID.COLOR_PALETTE || {};
window.BOLDGRID.COLOR_PALETTE.Modify = window.BOLDGRID.COLOR_PALETTE.Modify || {};

import BrehautColorJs from 'color-js/color';

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
		.find( 'iframe' )
		.last()
		.contents()
		.find( 'body' );
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

/**
 * Upon clicking a color in the active palette, fade in and out the color on the iframe.
 *
 * @since 1.1.7
 */
colorPalette.bindTransitions = function() {
	if ( ! self.configs.enableCustomizerTransitions ) {
		return;
	}

	self.$palette_control_wrapper.on( 'click', '.boldgrid-active-palette li', function( e ) {
		var transitionColor,
			backgroundColor,
			$previewerBody,
			timeStartedCompile,
			$this = $( this ),
			originalColor = $this.css( 'background-color' ),
			isNeutral = false,
			desiredDelay = 350,
			transitionDistance = 0.4,
			darknessThreshold = 0.5;

		if ( self.fadeEffectInProgress || ! e.originalEvent ) {
			return;
		}

		// Get the previewer frame.
		$previewerBody = colorPalette.getPreviewerBody();

		if ( self.hasNeutral && $this.is( ':last-of-type' ) ) {
			isNeutral = true;
		}

		// Calculate the color to transition to.
		backgroundColor = BrehautColorJs( originalColor );
		if ( backgroundColor.getLuminance() > darknessThreshold ) {
			transitionColor = backgroundColor.darkenByAmount( transitionDistance );
			transitionColor = transitionColor.toCSS();
		} else {
			transitionColor = backgroundColor.lightenByAmount( transitionDistance );
			transitionColor = transitionColor.toCSS();
		}

		// Set color to transition to.
		$this.css( 'background-color', transitionColor );
		if ( isNeutral ) {
			$this.closest( '.boldgrid-active-palette' ).attr( 'data-neutral-color', transitionColor );
		}

		// Enable transitions for the colors.
		$previewerBody.addClass( 'color-palette-transitions' );

		// Compile.
		colorPalette.update_theme_option();

		// Reset Color.
		$this.css( 'background-color', originalColor );
		if ( isNeutral ) {
			$this.closest( '.boldgrid-active-palette' ).attr( 'data-neutral-color', originalColor );
		}

		timeStartedCompile = new Date().getTime();
		self.fadeEffectInProgress = true;

		$window.one( 'boldgrid_sass_compile_done', function() {
			var timeout = 0,
				duration = new Date().getTime() - timeStartedCompile;

			// The compile to fade back in should trigger at a minimum time of desiredDelay.

			// If the compile time exceeds the min than the the timeout will be 0.
			if ( duration < desiredDelay ) {
				timeout = desiredDelay;
			}

			// Wait for compile to finish then fade back in.
			$window.one( 'boldgrid_sass_compile_done', function( event, data ) {
				setTimeout( function() {
					colorPalette.update_iframe( data );
					setTimeout( function() {
						$previewerBody.removeClass( 'color-palette-transitions' );
						self.fadeEffectInProgress = false;
					}, 250 );
				}, timeout );
			} );

			colorPalette.update_theme_option( { source: 'color_palette_focus' } );
		} );
	} );
};
