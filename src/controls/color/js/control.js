window.BOLDGRID = window.BOLDGRID || {};
window.BOLDGRID.COLOR_PALETTE = window.BOLDGRID.COLOR_PALETTE || {};
window.BOLDGRID.COLOR_PALETTE.Modify = window.BOLDGRID.COLOR_PALETTE.Modify || {};
window.BOLDGRIDSass = window.BOLDGRIDSass || {};

import './transitions.js';
import { SassCompiler }from '../../style/js/sass-compiler.js';
import { Generate } from './generate.js';
import { Picker as ColorPicker } from '../../color-picker';
import BrehautColorJs from 'color-js/color';
import BaseStyles from 'raw-loader!../scss/utilities/color-classes.sass';

var $ = jQuery,
	$window = $( window ),
	colorPalette = BOLDGRID.COLOR_PALETTE.Modify,
	self = colorPalette;

colorPalette.pickerCompileDelay = 100;
colorPalette.pendingCompile = false;
colorPalette.palette_generator = BOLDGRID.COLOR_PALETTE.Generate;
colorPalette.generated_color_palettes = 6;
colorPalette.state = null;
colorPalette.active_body_class = '';
colorPalette.first_update = true;
colorPalette.prelockNeutral = false;
colorPalette.themePalettes = [];

var default_neutrals =  [ '#232323', '#FFFFFF', '#FF5F5F', '#FFDBB8', '#FFFFB2', '#bad6b1', '#99acbf', '#cdb5e2' ];

colorPalette.init = function( $control, configs ) {
	colorPalette.first_update = true;

	self.configs = self.initConfigs( configs );
	self.$control = $control;
	self.sassCompiler = new SassCompiler();
	self.colorPicker = new ColorPicker();
	self.pausePickerChanges();

	self.classProperties();
	self.setupEvents();
};

colorPalette.classProperties = function() {
	self.$palette_control_wrapper = $( '.bgctrl-color-palette' );
	self.$colorPickerWrap = self.$palette_control_wrapper.find( '.color-picker-wrap' );
	self.$palette_option_field = self.$palette_control_wrapper.find( '.palette-option-field' );
	self.generated_palettes_container = self.$palette_control_wrapper.find( '.generated-palettes-container' );
	self.$accoridon_section_colors = $( '#accordion-section-colors' );
	self.$paletteWrapper = self.$palette_control_wrapper.find( '.boldgrid-color-palette-wrapper' );
	self.hasNeutral = self.$paletteWrapper.data( 'has-neutral' );
	self.numColors = self.$paletteWrapper.data( 'num-colors' );
};

colorPalette.setupEvents = function() {

	// Create icon set variable.
	colorPalette.duplicate_modification_icons();
	colorPalette.themePalettes = colorPalette.getThemePalettes();

	// Bind the actions of the user clicking on one of the icons that removes or adds palettes.
	colorPalette.bind_palette_duplicate_remove();
	colorPalette.bind_palette_activation();
	colorPalette.setup_color_picker();
	colorPalette.setup_close_color_picker();
	colorPalette.setup_palette_generation();
	colorPalette.bind_generate_palette_action();
	colorPalette.bind_help_section_visibility();
	colorPalette.bind_help_link();
	colorPalette.bindActiveColorClick();
	colorPalette.bindTransitions();

	// Action that occurs when color palette is compiled.
	colorPalette.bind_compile_done();

	colorPalette.fetch_acceptable_palette_formats();

	// Wait 100ms before running this function because it expects WP color picker to be set up.
	setTimeout( colorPalette.pickerPostInit, 100 );
};

colorPalette.initConfigs = function( configs ) {
	return _.defaults( {
		enableCustomizerTransitions: false,
		boldgrid_light_text: '#FFF',
		boldgrid_dark_text: '#000'
	}, configs );
};

/**
 * Try to show and hide the boldgrid color palette pointer depending on if the color the palette
 * selector is visible
 */
colorPalette.bind_help_section_visibility = function() {
	$( '.accordion-section' ).on( 'click', function() {
		var $bg_help = $( '.boldgrid-color-palette-help' );
		if ( self.$accoridon_section_colors.hasClass( 'open' ) && ! $bg_help.is( ':visible' ) ) {
			$bg_help.show();
		} else if ( false === self.$accoridon_section_colors.hasClass( 'open' ) ) {
			$bg_help.hide();
		}
	});
};

/**
 * Close Color Picker
 */
colorPalette.setup_close_color_picker = function() {
	self.$close_palette_creator = $( '<button type="button" class="button close-color-picker">Done</button>' );

	self.colorPicker.$input.after( self.$close_palette_creator );

	self.$close_palette_creator.on( 'click', () => {
		self.colorPicker.hide();
	} );
};

/**
 * Create a list of theme palettes. These are the palettes that come with the theme.
 *
 * @since 1.1.1
 *
 * @return array list of palettes configured by theme dev.
 */
colorPalette.getThemePalettes = function() {
	var themePalettes = [];
	self.$palette_control_wrapper.find( '.boldgrid-inactive-palette[data-copy-on-mod="1"]' ).each( function() {
		var palette = [];

		$( this ).find( '[data-color]' ).each( function() {
			palette.push( $( this ).data( 'color' ) );
		});

		if ( self.hasNeutral ) {
			palette.splice( -1, 1 );
		}

		themePalettes.push( palette );
	});

	return themePalettes;
};

/**
 * Bind the handlers for palette generation.
 */
colorPalette.setup_palette_generation = function() {

	self.$palette_control_wrapper.find( '.palette-generator-button' ).on( 'click', function() {

		if ( false === self.$paletteWrapper.hasClass( 'palette-generate-mode' ) ) {

			if ( self.hasNeutral && self.prelockNeutral ) {

				// Lock it.
				self.$palette_control_wrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors:last' )
					.addClass( 'selected-for-generation' );

				colorPalette.sync_locks();
			}

			self.$paletteWrapper.addClass( 'palette-generate-mode' );
		}
	});

	self.$palette_control_wrapper.on( 'click', '.palette-generate-mode .current-palette-wrapper .color-lock', function( e ) {
		var $this = $( this );

		e.stopPropagation();

		self.$palette_control_wrapper.find( '.boldgrid-active-palette li' )
			.eq( $this.data( 'count' ) )
			.toggleClass( 'selected-for-generation' );

		$this.toggleClass( 'selected-for-generation' );
	});

	self.$palette_control_wrapper.find( '.cancel-generated-palettes-button' ).on( 'click', function( e ) {
		var $this = $( this );

		e.stopPropagation();

		// Strip out the auto generated data element.
		self.$palette_control_wrapper
			.find( '.boldgrid-active-palette[data-auto-generated]' )
			.removeAttr( 'data-auto-generated' );

		self.generated_palettes_container.empty();

		// Remove All Selected Colors.
		$this.closest( '.palette-generate-mode' )
			.removeClass( 'palette-generate-mode' )
			.find( '.selected-for-generation' )
			.removeClass( 'selected-for-generation' );
	});
};

/**
 * Clone one of the sets of the icons that are used for deletion and duplication
 * This is done to make it easier to add them when the palette becomes active
 */
colorPalette.duplicate_modification_icons = function() {
	colorPalette.$icon_set = self.$palette_control_wrapper.find( '.boldgrid-duplicate-dashicons' ).first();
	if ( colorPalette.$icon_set ) {
		colorPalette.$icon_set = colorPalette.$icon_set.clone();
	}
};

/**
 * Bind the event of the user clicking on the generate palette button
 */
colorPalette.bind_generate_palette_action = function() {
	self.$palette_control_wrapper.find( '.palette-generator-button' ).on( 'click', function() {
		var paletteData = colorPalette.paletteData(), neutralColor = null;

		// If this palette has a neutral color, generate that color independently.
		if ( self.hasNeutral ) {
			paletteData.samplePalette.splice( -1, 1 );
			neutralColor = paletteData.partialPalette.splice( -1, 1 );
			neutralColor = neutralColor[0];
		}

		// Generate Palettes.
		let generate = new Generate(),
			palettes = generate.generatePaletteCollection( paletteData, colorPalette.generated_color_palettes );

		if ( self.hasNeutral ) {
			$.each( palettes, function() {

				// Generate neutral color or pass through existing neutral.
				if ( ! neutralColor ) {
					this.push( generate.generateNeutralColor( this ) );
				} else {
					this.push( neutralColor );
				}
			} );
		}

		colorPalette.display_generated_palettes( palettes );
	});
};

/**
 * Given an array of palettes, display them in the generated palettes section.
 */
colorPalette.display_generated_palettes = function( palettes ) {
	var $palette_container = self.generated_palettes_container.empty(), neutralColor = null;

	$.each( palettes, function() {

		// Currently activate neutral.
		if ( self.hasNeutral ) {
			neutralColor = this[ this.length - 1 ];
		}

		var $wrapper = $( '<div data-palette-wrapper="true"><ul><li class="boldgrid-palette-colors"></li></ul></div>' );
		var $new_ul = $wrapper.find( 'ul' )
			.addClass( 'boldgrid-inactive-palette' )
			.attr( 'data-auto-generated', 'true' )
			.attr( 'data-neutral-color', neutralColor )
			.attr( 'data-color-palette-format', colorPalette.get_random_format() );

		var $new_li = $new_ul.find( 'li' );

		$.each( this, function() {
			var $span = $( '<span></span>' )
				.css( 'background-color', this )
				.attr( 'data-color', true );

			$new_li.append( $span );
		});

		$palette_container.append( $wrapper );
	});
};

/**
 * Grab the selected palettes from the active palette class and add them to an array.
 *
 * @since 1.0
 */
colorPalette.paletteData = function() {
	var paletteData = {
		'samplePalette': [],
		'partialPalette': [],
		'additionalSamplePalattes': colorPalette.themePalettes
	};

	self.$palette_control_wrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function() {
		var $this = $( this );
		if ( $this.hasClass( 'selected-for-generation' ) ) {
			paletteData.partialPalette.push( $this.css( 'background-color' ) );
		} else {
			paletteData.partialPalette.push( null );
		}

		// Create an array of current colors in the palette.
		paletteData.samplePalette.push( $this.css( 'background-color' ) );
	});

	return paletteData;
};

/**
 * Get the palette formats that can be used for a palette
 * palette formats are essentially body classes
 */
colorPalette.fetch_acceptable_palette_formats = function() {

	// Store the color palette accepted formats.
	colorPalette.body_classes = self.$palette_control_wrapper
		.find( '.boldgrid-color-palette-wrapper' ).data( 'color-formats' );

	if ( typeof colorPalette.body_classes === 'object' ) {
		/*jshint unused:false*/
		colorPalette.body_classes = $.map( colorPalette.body_classes, function( value, index ) {
			return [value];
		});
	}
};

/**
 * Take the an active section and change the markup to what the the inactive
 * palettes should be
 */
colorPalette.revert_current_selection = function( $palette_wrapper ) {
	$palette_wrapper.removeClass( 'current-palette-wrapper' );
	var $ul = $palette_wrapper.find( '> ul' );
	$ul.removeClass( 'boldgrid-active-palette' ).addClass( 'boldgrid-inactive-palette' );
	$ul.find( '.boldgrid-duplicate-dashicons' ).remove();
	var $new_li = $( '<li class="boldgrid-palette-colors"></li>' );
	$ul.find( '.boldgrid-palette-colors:not(.ui-sortable-helper)' ).not( '.ui-sortable-placeholder' ).each( function() {
		var $this = $( this );
		if ( $this.css( 'position' ) !== 'absolute' ) {
			var $span = $( '<span data-color="true"></span>' )
				.css( 'background-color', $this.css( 'background-color' ) );
			$new_li.append( $span );
		}
	} );
	$palette_wrapper.find( '.bg-lock-controls' ).remove();

	$new_li.append( colorPalette.$icon_set.clone() );
	$ul.find( '.boldgrid-palette-colors' ).remove();
	$ul.append( $new_li );

	if ( $ul.data( 'ui-sortable' ) ) {
		$ul.sortable( 'disable' );
	}
};

/**
 * Allow user to click on a link inside the help screen to select the first color.
 */
colorPalette.bind_help_link = function() {
	self.$palette_control_wrapper.on( 'click', '[data-action="open-color-picker"]', function( e ) {
		e.stopPropagation();
		var $element = self.$palette_control_wrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors:first' );
		colorPalette.activate_color( null, $element );
	});
};

colorPalette.sync_locks = function() {
	var $lock_controls = self.$palette_control_wrapper.find( '.bg-lock-controls .color-lock' );
	$lock_controls.removeClass( 'selected-for-generation' );
	self.$palette_control_wrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function( index ) {
		var $this = $( this );
		if ( $this.hasClass( 'selected-for-generation' ) ) {
			$lock_controls.eq( index ).addClass( 'selected-for-generation' );
		}
	});
};

/**
 * Active a palette
 * Also apply jquery sortable
 */
colorPalette.activate_palette = function( $ul ) {

	colorPalette.addColorTransition();

	self.$palette_control_wrapper.find( '.wp-color-result' ).addClass( 'expanded-wp-colorpicker' );

	if ( $ul.attr( 'data-auto-generated' ) ) {
		$ul = $ul.closest( 'div' ).clone().find( '[data-auto-generated]' );
	}

	var saved_colors = [];
	self.$palette_control_wrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function( key ) {
		var $this = $( this );
		if ( $this.hasClass( 'selected-for-generation' ) ) {
			saved_colors.push( key );
		}
	});

	// Creating Lists.
	$ul.find( 'span[data-color]' ).each( function( key ) {
		var $this = $( this );
		var background_color = $this.css( 'background-color' );

		// Carry over selected.
		var selected_class = '';
		if ( saved_colors.indexOf( key ) !== -1 ) {
			selected_class = 'selected-for-generation';
		}

		$ul.append( '<li class="boldgrid-palette-colors ' + selected_class + ' boldgrid-dashicon" style="background-color: ' + background_color + '"></li>' );
	} );

	$ul.append( colorPalette.$icon_set.clone() );

	// This is the old palette strip that had the colors contained.
	$ul.find( 'li:first' ).remove();
	var $div = $ul.closest( 'div' ).addClass( 'current-palette-wrapper' ).detach();
	self.$palette_control_wrapper.find( '.boldgrid-color-palette-wrapper' ).prepend( $div );

	var $actionButtons = self.$palette_control_wrapper.find( '.palette-action-buttons' );
	$actionButtons.removeClass( 'hidden' ).insertAfter( $ul );

	self.$palette_control_wrapper.find( '.boldgrid-active-palette' ).each( function() {
		var $this = $( this );
		if ( ! $this.attr( 'data-auto-generated' ) ) {
			colorPalette.revert_current_selection( $this.closest( 'div' ) );
		} else {
			$this.closest( 'div' ).remove();
		}
	});

	// Apply Sortable.
	colorPalette.add_jquery_sortable( $ul );

	$ul.sortable( 'enable' );
	$ul.disableSelection();
	$ul.removeClass( 'boldgrid-inactive-palette' );
	$ul.addClass( 'boldgrid-active-palette' );
	$ul.find( 'li' ).disableSelection();

	var $lock_controls = $( '<div class="bg-lock-controls"></div>' );
	$ul.find( 'li' ).each( function( index ) {
		$lock_controls.append( '<div class="color-lock" data-count="' + index + '"><div class="lock unlock"><div class="top"></div><div class="mid"></div><div class="bottom"><div class="keyhole-top"></div><div class="keyhole-bottom"></div></div></div>' );
	});
	$ul.after( $lock_controls );
	colorPalette.sync_locks();

	if ( ! colorPalette.first_update ) {
		colorPalette.update_theme_option( { source: 'activatePalette' } );
	} else {
		self.$control.trigger( 'rendered' );
		colorPalette.first_update = false;
	}
};

/**
 * Apply jQuery sortable
 */
colorPalette.add_jquery_sortable = function( $ul ) {
	var originalOrder = [],
		originalIndex = null;

	$ul.sortable( {
		items: '.boldgrid-palette-colors',
		axis: 'x',
		start: function( event, ui ) {
			originalOrder = [];
			originalIndex = null;

			if ( ui.item ) {
				self.$palette_control_wrapper
					.find( '.active-palette-section' )
					.removeClass( 'active-palette-section' );

				if ( ! ui.item.find( 'span' ).length ) {
					colorPalette.modify_palette_action( ui.item.closest( '[data-palette-wrapper="true"]' ) );
				}

				// Color the placeholder the same as the current drag color.
				ui.placeholder
					.css( 'background-color', ui.item.css( 'background-color' ) )
					.css( 'visibility', 'visible' );

				// Store the original order of colors.
				$ul.find( 'li' ).not( ui.helper ).not( ui.placeholder ).each( function( index ) {
					var $this = $( this );
					originalOrder.push( $this.css( 'background-color' ) );
					if ( $this.is( ui.item ) ) {
						originalIndex = index;
					}
				} );
			}
		},

		// On change, instead of sorting colors. Only swap the placeholder with displaced color.
		change: function( event, ui ) {
			var $listItems = $ul.find( 'li' ).not( ui.helper ).not( ui.item );

			$listItems.each( function( key ) {
				var $this = $( this ),
				    bg_color = originalOrder[ key ];

				if ( $this.is( ui.placeholder ) ) {

					// Set the original slot to the displaced color.
					$listItems.eq( originalIndex ).css( 'background-color', bg_color );
				} else if ( originalIndex !== key ) {

					// The other colors should be unmodified.
					$listItems.eq( key ).css( 'background-color', bg_color );
				}
			} );
		},
		helper: 'clone',
		stop: function( event, ui ) {

			colorPalette.addColorTransition();

			colorPalette.update_theme_option( { source: 'dragColor' } );
			colorPalette.open_picker();
			if ( ui.item ) {
				var $to_element = ui.item;
				if ( ! $to_element.find( 'span' ).length ) {
					self.$palette_control_wrapper
						.find( '.active-palette-section' )
						.removeClass( 'active-palette-section' );

					$to_element.addClass( 'active-palette-section' );

					// Toggle this class to make sure that dashicon placement is updated.
					$to_element.siblings().each( function() {
						var $this = $( this );
						$this.toggleClass( 'boldgrid-dashicon' );

						setTimeout( function() {
							$this.toggleClass( 'boldgrid-dashicon' );
						}, 15 );
					});

					var $scope = $to_element.closest( '.boldgrid-color-palette-wrapper' );

					// Change the color of the color picker to the active palette.
					colorPalette.preselect_active_color( $scope );
					colorPalette.sync_locks();
					colorPalette.updateNeutralData();
				}
			}
		}
	});
};

/**
 * Grab all the palettes from the DOM and create a variable to be passed to the iframe
 * via wp_customizer
 */
colorPalette.format_current_palette_state = function() {
	let palettes_object = {},
		$active_palette = self.$palette_control_wrapper.find( '.boldgrid-active-palette' ).first();

	// Initialize palette settings.
	palettes_object['active-palette'] = $active_palette.attr( 'data-color-palette-format' );
	palettes_object['active-palette-id'] = $active_palette.attr( 'data-palette-id' );
	palettes_object.palettes = {};	//A list of palettes to be compiled
	palettes_object.saved_palettes = []; //A complete list of palettes

	// Store the active body class in the color palette class.
	self.active_body_class = palettes_object['active-palette'];

	var palette_routine = function() {
		var $this = $( this ),
			$color_backgrounds = {},
			copyOnMod =  parseInt( $this.attr( 'data-copy-on-mod' ) ),
			isActivePalette = $this.hasClass( 'boldgrid-active-palette' );

		if ( isActivePalette ) {
			$color_backgrounds = $this.find( 'li.boldgrid-palette-colors' );
		} else {
			$color_backgrounds = $this.find( '.boldgrid-palette-colors > span' );
		}

		var colors = [];
		$color_backgrounds.not( self.hasNeutral ? ':last-of-type' : '' ).each( function() {
			colors.push( $( this ).css( 'background-color' ) );
		});

		var palette = {
			'format': $this.attr( 'data-color-palette-format' ),
			'colors': colors,
			'neutral-color': $this.attr( 'data-neutral-color' )
		};

		if ( isActivePalette ) {
			palettes_object.palettes[ $this.attr( 'data-color-palette-format' ) ] = palette;
		}

		if ( ! isActivePalette && ! copyOnMod ) {
			palettes_object.saved_palettes.push( palette );
		}
	};

	self.$palette_control_wrapper
		.find( '[data-color-palette-format]' )
		.not( $active_palette )
		.not( '[data-auto-generated="true"]' )
		.each( palette_routine );

	$active_palette.each( palette_routine );

	return palettes_object;
};

colorPalette.getContrastColor = function( type ) {
	if ( window.wp && window.wp.customize ) {
		return wp.customize( 'boldgrid_dark_text' ).get();
	} else {
		return self.configs[ type ];
	}
};

/**
 * Take the colors in a palette and format them into an SCSS format
 */
colorPalette.create_color_scss_file = function( palette_config ) {
	var scss_file = '',
		colors_prefix = '$colors: ';

	$.each( palette_config.palettes, function( format ) {
		if ( this.colors ) {
			var class_colors = colors_prefix;
			$.each( this.colors, function( color_order ) {
				var actual_order = color_order + 1;
				scss_file += '$' + format + '_' + actual_order.toString() + ':' + this + ';';
				class_colors += '$' + format + '_' + actual_order.toString() + ' ';
			});

			if ( class_colors !== colors_prefix ) {
				scss_file += class_colors + ';';
			}
		}
		if ( this['neutral-color'] ) {
			scss_file += '$' + format + '-neutral-color:' + this['neutral-color'] + ';';
		}
	});

	// Text contrast variables.
	var text_light = self.getContrastColor( 'boldgrid_light_text' );
	var text_dark = self.getContrastColor( 'boldgrid_dark_text' );

	scss_file += '$light-text:' + text_light + ';';
	scss_file += '$dark-text:' + text_dark + ';';

	scss_file = self.appendButtonRules( scss_file );

	return scss_file;
};

colorPalette.appendButtonRules = function ( scss_file ) {
	if ( BOLDGRIDSass.ButtonVariables ) {
		scss_file += '$ubtn-namespace: "' + BOLDGRIDSass.ButtonVariables['ubtn-namespace'] + '";';
		scss_file += '$ubtn-bgcolor: ' + BOLDGRIDSass.ButtonVariables['ubtn-bgcolor'];
		scss_file += '$ubtn-font-color: ' + BOLDGRIDSass.ButtonVariables['ubtn-font-color'];
		scss_file += '$ubtn-theme-color: ' + BOLDGRIDSass.ButtonVariables['ubtn-bgcolor'].replace( /\$/g, '' );
	}

	if ( typeof BOLDGRIDSass.ButtonExtends !== 'undefined' ) {
		if ( typeof BOLDGRIDSass.ButtonExtends.primary !== 'undefined' ) {
			scss_file += '$button-primary-classes: "' + BOLDGRIDSass.ButtonExtends.primary + '";';
		}
		if ( typeof BOLDGRIDSass.ButtonExtends.secondary !== 'undefined' ) {
			scss_file += '$button-secondary-classes: "' + BOLDGRIDSass.ButtonExtends.secondary + '";';
		}
	}

	return scss_file;
}

/**
 * Update the theme option
 */
colorPalette.update_theme_option = function( options ) {
	options = options || {};

	let scss = self.getScss();
	options.colorConfig = colorPalette.state;

	colorPalette.compile( scss, options );
};

/**
 * Get the sass needed to pass into the compiler.
 *
 * @since 1.0.0
 *
 * @return {string}         Compiler content.
 */
colorPalette.getScss = function() {
	colorPalette.state = colorPalette.format_current_palette_state();

	let scss_file = colorPalette.create_color_scss_file( colorPalette.state ),
		colorClasses = scss_file + self.configs.renderer.getImportString();

	return colorClasses + self.configs.renderer.buttonColors.getCompileString( colorPalette.state );
};

/**
 * A wrapper for the compile action. Sets the upcoming compile info, overwriting the
 * most recent request.
 *
 * @since 1.1.7
 */
colorPalette.compile = function( content, options ) {
	self.pendingCompile = {
		'content': content,
		options: options
	};
	colorPalette.doCompile();
};

/**
 * Grabs the most recent request for a compile and processes it if we are not currently
 * compiling.
 *
 * @since 1.1.7
 */
colorPalette.doCompile = function() {
	var currentCompile = self.pendingCompile;

	if ( currentCompile && ! self.sassCompiler.processing ) {
		self.sassCompiler.compile( currentCompile.content, currentCompile.options );
		self.pendingCompile = false;
	}
};

/**
 * When the user clicks on a plattte active it
 */
colorPalette.bind_palette_activation = function() {
	self.$palette_control_wrapper.on( 'click', '.boldgrid-inactive-palette', function() {
		colorPalette.activate_palette( $( this ) );
	} );
};

colorPalette.activate_color = function( e, $element, ignoreColorChange ) {
	var $this;
	if ( ! e ) {
		$this = $element;
	} else {

		// This event should not occur during palette generation mode.
		$this = $( this );
		e.stopPropagation();
	}

	if ( false === $this.hasClass( 'active-palette-section' ) ) {

		// If this is a neutral color set a different set of defaults.
		if ( self.hasNeutral && $this.is( '.boldgrid-active-palette .boldgrid-palette-colors:last' ) ) {
			self.colorPicker.$input.iris({ palettes: default_neutrals });
		} else {
			self.colorPicker.$input.iris({ palettes: true });
		}

		colorPalette.modify_palette_action( $this.closest( '[data-palette-wrapper="true"]' ) );

		self.$palette_control_wrapper.find( '.active-palette-section' ).removeClass( 'active-palette-section' );
		$this.addClass( 'active-palette-section' );
		colorPalette.open_picker();

		if ( ignoreColorChange ) {
			self.pausePickerChanges();
		}

		self.colorPicker.setColor( $this.css( 'background-color' ) );
	}
};

/**
 * Stop compiling colors and allow all events to catch up.
 *
 * @since 1.1.7
 */
colorPalette.pausePickerChanges = function() {
	self.ignoreColorChange = true;
	setTimeout( function() {
		self.ignoreColorChange = false;
	} );
};

colorPalette.open_picker = function() {
	self.colorPicker.show();
};

/**
 * Update the neutral color data attributes that are used to generate css.
 *
 * @since 1.1.1
 */
colorPalette.updateNeutralData = function() {
	var hasNeutralColor, currentNeutralColor, $activePalette;

	// If active palette has data-neutral-color.
	hasNeutralColor = !! self.$palette_control_wrapper
		.find( '.boldgrid-active-palette' ).attr( 'data-neutral-color' );

	if ( hasNeutralColor ) {

		// Find the last color in the palette and set its color as the data-neutral.
		$activePalette = self.$palette_control_wrapper.find( '.boldgrid-active-palette' );
		currentNeutralColor = $activePalette.find( '.boldgrid-palette-colors:last' ).css( 'background-color' );
		$activePalette.attr( 'data-neutral-color', currentNeutralColor );
	}
};

/**
 * Set the options for the color picker.
 */
colorPalette.setup_color_picker = function() {

	let throttled = _.throttle( () => {
		colorPalette.update_theme_option( { source: 'updatePicker' } );
	}, 100 );

	// Hack, colors are updated shortly after, just give it an array.
	var secondaryPalette = colorPalette.themePalettes[0];
	if ( self.hasNeutral ) {
		secondaryPalette.push( '#FFF' );
	}

	var myOptions = {
		width: 255,
		secondaryPalette: secondaryPalette,
		change: function( event, ui ) {
			if ( self.fadeEffectInProgress ) {
				return false;
			}
			var color = ui.color.toString();

			self.$palette_control_wrapper
				.find( '.active-palette-section' )
				.css( 'background-color', color );

			// Update the neutral color data elements.
			colorPalette.updateNeutralData();
			colorPalette.updateCustomPalettes();

			if ( self.ignoreColorChange ) {
				return;
			}
			throttled();
		}
	};

	this.colorPicker.init( self.$palette_control_wrapper.find('.color-picker'), myOptions );
};

/**
 * Update the custom colors listed on the left side of your color picker.
 *
 * @since 1.1.1
 */
colorPalette.updateCustomPalettes = function() {
	var $pickerPalettes = self.$palette_control_wrapper.find( '.secondary-colors .iris-palette' );

	self.$palette_control_wrapper.find( '.boldgrid-active-palette .boldgrid-palette-colors' ).each( function( index ) {

		// Copy Color from active Palette.
		$pickerPalettes.eq( index ).css( 'background-color', $( this ).css( 'background-color' ) );
	} );
}

/**
 * Set the color on the color palette to the color that has the class ".active-palette-seciton"
 */
colorPalette.preselect_active_color = function( $scope ) {
	self.colorPicker.setColor( $scope.find( '.active-palette-section' ).css( 'background-color' ) );
};

/**
 * Setup the duplicate nad remove palette icon clicks.
 */
colorPalette.bind_palette_duplicate_remove = function() {
	self.$palette_control_wrapper.on( 'click', '.boldgrid-copy-palette, .boldgrid-remove-palette', function( e ) {
		e.stopPropagation();
		var $this = $( this );

		// Get the closest wrapper of the pallette, this container holds all of the colors.
		var $palette_wrapper = $this.closest( '[data-palette-wrapper="true"]' );

		var removal = true;
		if ( $this.hasClass( 'boldgrid-copy-palette' ) ) {
			removal = false;
		}

		if ( removal ) {
			colorPalette.remove_palette( $palette_wrapper );
		} else {
			colorPalette.copy_palette( $palette_wrapper );
		}
	});
};

/**
 * Remove a palette form the list of inactive palettes.
 */
colorPalette.remove_palette = function( $palette ) {
	if ( $palette.find( '.boldgrid-inactive-palette' ).length ) {
		$palette.remove();
		colorPalette.state = colorPalette.format_current_palette_state();
		colorPalette.update_palette_settings();
	}
};

/**
 * Clone a palette
 */
colorPalette.modify_palette_action = function( $palette ) {
	if ( $palette.find( '[data-copy-on-mod="1"]' ).length ) {
		colorPalette.copy_palette( $palette );
	}
};

/**
 * Triggered when the user presses the copy palette icon
 * Split into two actions, when the user clicks on a palette that is inactive or active
 */
colorPalette.copy_palette = function( $palette ) {
	var $active_palette = $palette.find( '.boldgrid-active-palette' );
	if ( $active_palette.length ) {

		// Translate the active palette into an inactive palette, clone to make sure that.

		// the original stays.
		var $cloned_active_palette = $palette.clone( false );
		$cloned_active_palette.find( '.palette-action-buttons' ).remove();
		$cloned_active_palette.find( '.boldgrid-active-palette' ).removeAttr( 'data-auto-generated' );

		// Since this item has already been copied, don't preserve it on modification.
		colorPalette.clean_palette_clone( $palette.find( '.boldgrid-active-palette' ) );

		colorPalette.revert_current_selection( $cloned_active_palette );

		// Find the first inactive palette.
		var $first_inactive = colorPalette.get_first_inactive();

		// After the palette was changed into an inactive style, wrap it in the standard container.

		// For easy identification purposes.
		$cloned_active_palette.insertBefore( $first_inactive );
	} else if ( $palette.find( '.boldgrid-inactive-palette' ).length ) {

		// Simply copy in place.
		var $cloned_palette = $palette.clone( false );

		// Since this item has already been copied, don't preserve it on modification.
		colorPalette.clean_palette_clone( $cloned_palette.find( '.boldgrid-inactive-palette' ) );

		$palette.after( $cloned_palette );
	}

	colorPalette.state = colorPalette.format_current_palette_state();
	colorPalette.update_palette_settings();
};

/**
 * Remove attributes that identify this palette as a hardcoded palette
 */
colorPalette.clean_palette_clone = function( $palette_clone ) {
	$palette_clone.removeAttr( 'data-copy-on-mod data-palette-id' );
};

/**
 * Out of the list of palettes return the first palette that is inactive
 */
colorPalette.get_first_inactive = function() {
	return self.$palette_control_wrapper
		.find( '.boldgrid-color-palette-wrapper > [data-palette-wrapper="true"]' )
		.not( '.current-palette-wrapper' )
		.first();
};

/**
 * When the Sass script return that a compile was complete, send the data to the
 * preview script
 */
colorPalette.bind_compile_done = function() {
	$window.on( 'boldgrid_sass_compile_done', function( event, data ) {
		colorPalette.doCompile();
		if ( 'color_palette_focus' !== data.source ) {
			colorPalette.update_iframe( data );
			self.$control.trigger( 'sass_compiled', data );
		}
	});
};

colorPalette.update_iframe = function( data ) {
	colorPalette.compiled_css = data.result.text;
	colorPalette.update_palette_settings();
};

/**
 * Change the palette settings
 */
colorPalette.update_palette_settings = function() {
	colorPalette.text_area_val = JSON.stringify({ 'state': colorPalette.state });

	if ( window.wp && window.wp.customize ) {
		wp.customize( 'boldgrid_color_palette' ).set( '' ).set( colorPalette.text_area_val );
	}
};

/**
 * Get a random acceptble format.
 * TEMP: hardcoded to first palette.
 */
colorPalette.get_random_format = function() {

	// Return colorPalette.body_classes[ Math.floor( Math.random() * colorPalette.body_classes.length)];
	return colorPalette.body_classes[0];
};

colorPalette.compareColors = function( color1, color2 ) {
	var color1Obj = BrehautColorJs.toRgba( color1 ),
		color2Obj = BrehautColorJs.toRgba( color2 );

	console.log( {
		color1: color1Obj.toString(),
		color2: color2Obj.toString()
	} );

	return color1Obj.toString() === color2Obj.toString();
}

/**
 * Initialization processes to be run after the picker has been initialized
 */
colorPalette.pickerPostInit = function() {

	// Post Color Picker Load.
	var $active_palette = self.$palette_control_wrapper.find( '.boldgrid-inactive-palette[data-is-active="1"]' ).first();
	var $default_palette = self.$palette_control_wrapper.find( '.boldgrid-inactive-palette[data-is-default="1"]' ).first();

	var $palette_to_activate = $default_palette;
	if ( $active_palette.length ) {
		$palette_to_activate = $active_palette;
	}

	// Active the palette in the UI.
	$palette_to_activate.click();

	self.$palette_control_wrapper.find( '.wp-color-result' ).addClass( 'expanded-wp-colorpicker' );

	$( 'body' ).on( 'click', function() {
		self.$palette_control_wrapper.find( '.wp-color-result' ).addClass( 'expanded-wp-colorpicker' );

		// Deselect color.
		self.$palette_control_wrapper
			.find( '.active-palette-section' )
			.removeClass( 'active-palette-section' );
	} );

	// TODO this doesnt work on auto close.
	self.$palette_control_wrapper.find( '.wp-color-result' ).on( 'click', function() {
		var $this = $( this );
		var picker_visible = $this.parent().find( '.iris-picker' ).is( ':visible' );
		if ( picker_visible ) {
			$this.removeClass( 'expanded-wp-colorpicker' );

			// Auto Select first color.
			if ( ! self.$palette_control_wrapper.find( '.active-palette-section' ).length ) {
				self.$palette_control_wrapper.find( '.boldgrid-active-palette li:first' ).click();
			}
		}
	} );

	self.active_body_class = self.$palette_control_wrapper
		.find( '.boldgrid-active-palette' )
		.first()
		.attr( 'data-color-palette-format' );
};

/**
 * Upon clicking a color in the active palette, fade in and out the color on the iframe.
 *
 * @since 1.1.7
 */
colorPalette.bindActiveColorClick = function() {
	self.$palette_control_wrapper.on( 'click', '.boldgrid-active-palette li', function( e ) {
		e.stopPropagation();
		colorPalette.activate_color( null, $( this ), true );
	} );
};
