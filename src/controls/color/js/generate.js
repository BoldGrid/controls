import './palettes.js';

export class Generate {

	constructor() {
		this.apiColorCount = {};

		/**
		 * Methods used to generate palettes based on only 1 color.
		 * These methods are included in color.js
		 */
		this.colorSchemeMethods = [
			'fiveToneAScheme',
			'fiveToneBScheme',
			'fiveToneCScheme',
			'fiveToneDScheme',
			'fiveToneEScheme',
			'neutralScheme', //Listed multiple times to increase probability of occurrence
			'neutralScheme',
			'neutralScheme',
			'analogousScheme', //Listed multiple times to increase probability of occurrence
			'analogousScheme',
			'analogousScheme'
		];

		/**
		 * Methods used to generate palettes based on only 1 color.
		 * These methods are included in this file.
		 */
		this.internalPalettes = [
			'monochromatic',
			'intesity_and_hue',
			'complementaryScheme',
			'splitComplementaryScheme',
			'splitComplementaryCWScheme',
			'triadicScheme',
			'tetradicScheme'
		];

		this.fillPaletteActions = [
			'compliment',
			'blend',
			'copy'
		];

		/**
		 * Methods used to randomize a palette
		 */
		this.methods = [
			'saturateByAmount',
			'lightenByAmount',
			'shiftHue'
		];

		/**
		 * List of predefined neutral colors.
		 *
		 * @since 1.1.1
		 */
		this.neutralColors = [
			'#FFFFF2',
			'#FBF5E6',
			'#FFFFFF',
			'#F6F9ED',
			'#FDFDF0',
			'#EBECE4',
			'#ECF1EF',
			'#FFFFFE',
			'#FCF6CF',
			'#FEFFEF',
			'#FFFFFD',
			'#FFFFF3',
			'#FEF1E9',
			'#FEF6E4',
			'#EEF3E2',

			// Dark.
			'#292929',
			'#4d4d4d',
			'#1a1a1a'
		];
	}

	/**
	 * Get a random color
	 * Not Used ATM
	 */
	getRandomColor() {
		let letters = '0123456789ABCDEF'.split( '' ),
			color = '#';

		for ( let i = 0; 6 > i; i++ ) {
			color += letters[Math.floor( Math.random() * 16 )];
		}
		return color;
	}

	/**
	 * Get a random element from an array.
	 *
	 * @since 1.1.1
	 *
	 * @return element.
	 */
	randomArrayElement( array ) {
		return array[ Math.floor( Math.random() * array.length ) ];
	}

	/**
	 * Generates a neutral color.
	 *
	 * @since 1.1.1
	 *
	 * @return string css value of a color.
	 */
	generateNeutralColor( palette ) {

		let random = Math.random(),
			neutralColor = null,
			randomLimit = 0.5,
			neutralLightness = 0.9,
			paletteColor,
			brehautColor;

		if ( random > randomLimit ) {

			paletteColor = self.randomArrayElement( palette );
			brehautColor = net.brehaut.Color( paletteColor );
			neutralColor = brehautColor.setLightness( neutralLightness ).toCSS();

		} else {
			neutralColor = self.randomArrayElement( neutralColors );
		}

		return neutralColor;
	}

	/**
	 * Calculate differences between 2 colors.
	 *
	 * @param colorA string
	 * @param colorB string
	 * @since 1.1.1
	 *
	 * @return array
	 */
	colorDiff( colorA, colorB ) {

		colorA = net.brehaut.Color( colorA ).toHSL();
		colorB =  net.brehaut.Color( colorB ).toHSL();

		let hueDiff = colorA.hue - colorB.hue,
			saturationDiff = colorA.saturation - colorB.saturation,
			lightnessDiff = colorA.lightness - colorB.lightness,
			huePercentageDiff = Math.abs( hueDiff ) / 360,
			saturationPercentageDiff = Math.abs( saturationDiff ),
			lightnessPercentageDiff = Math.abs( lightnessDiff ),
			totalPercentageDiff = huePercentageDiff + saturationPercentageDiff + lightnessPercentageDiff;

		return {
			'hue': hueDiff,
			'saturationDiff': saturationDiff,
			'lightnessDiff': lightnessDiff,
			'totalPercentageDiff': totalPercentageDiff
		};
	}

	/**
	 * Finds colors within a palette that are identical.
	 *
	 * @since 1.1.1
	 *
	 * @return object key value pairs of colors and keys that should have the same color.
	 */
	findMatches( palette ) {

		// Test for matches.
		let matches = {};
		$.each( palette, function( testIndex, testColor ) {
			$.each( palette, function( index, color ) {
				if ( color === testColor && index !== testIndex ) {

					if ( ! matches[color] ) {
						matches[color] = [];
					}

					if ( -1 === matches[color].indexOf( testIndex ) ) {
						matches[color].push( testIndex );
					}
					if ( -1 === matches[color].indexOf( index ) ) {
						matches[color].push( index );
					}
				}
			} );
		} );

		return matches;
	}

	/**
	 * Move array key from 1 index to another.
	 *
	 * Thanks: http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
	 *
	 * @param int
	 * @param int
	 * @since 1.1.1
	 *
	 * @return array
	 */
	arrayMove( array, newIndex, oldIndex ) {
		if ( newIndex >= array.length ) {
			let k = newIndex - array.length;
			while ( ( k-- ) + 1 ) {
				array.push( undefined );
			}
		}

		array.splice( newIndex, 0, array.splice( oldIndex, 1 )[0] );
		return array;
	}

	/**
	 * Finds colors within a palette that are identical.
	 *
	 * @since 1.1.1
	 *
	 * @return array An array of relationships from a palette.
	 */
	findRelations( palette ) {
		let matches,
			relations = [];

		matches = self.findMatches( palette );
		if ( false === $.isEmptyObject( matches ) ) {
			$.each( matches, function() {
				relations.push( {
					'type': 'match',
					'values': this
				} );
			} );
		}

		return relations;
	}

	/**
	 * Fins the relationships that currently exists within a palette.
	 *
	 * @since 1.1.1
	 *
	 * @return array relationships that exists within a palette.
	 */
	determineRelations( paletteData ) {

		/*
		 * Test the Sample Palette.
		 * If a relationship exists within this palette, no more testing will be done and
		 * all relational generating will be based off of this relationship.
		 */
		let paletteRelationships = {},
			relationsData = [],
			relationships = self.findRelations( paletteData.samplePalette );

		/*
		 * If this relationship match involves a locked color skip matching
		 * this relationship all together.
		 */
		$.each( relationships, function() {
			let validRelationship = true;

			$.each( this.values, function() {
				if ( paletteData.partialPalette[ this ] ) {
					validRelationship = false;
					return false;
				}
			} );

			if ( validRelationship ) {
				relationsData.push( this );
			}
		} );

		/*
		 * Test all other predefined palettes.
		 * Find 1 relationship within a list of palettes, if a relationship is found, we will use it
		 * for all relationship suggestions.
		 */
		if ( ! relationsData.length ) {
			$.each( paletteData.additionalSamplePalattes, function() {
				relationsData = self.findRelations( this );
				if ( relationsData.length ) {
					paletteRelationships = {
						'type': 'additionalSamplePalattes',
						'relationsData': relationsData
					};
					return false;
				}
			} );
		} else {
			paletteRelationships = {
				'type': 'samplePalette',
				'relationsData': relationsData
			};
		}

		return paletteRelationships;
	}

	/**
	 * Update a generated palette so that it has the same relationship as a previous palette.
	 *
	 * @since 1.1.1
	 */
	applyRelationships( palette, paletteRelationships, lockedIndexes ) {
		let newPalette = palette.slice( 0 );

		$.each( paletteRelationships.relationsData, function() {
			let relationship = this,
				copyColorIndex = false;

			if ( 'match' === relationship.type ) {

				$.each( relationship.values, function() {
					let lockedColorIndex = lockedIndexes.indexOf( this );
					if ( -1 !== lockedColorIndex ) {
						copyColorIndex = this;
					}
				} );

				/*
				 * If three of colors should match, grab a random color from one of those slots and
				 * copy it across to the rest of the slots.
				 */
				if ( false === copyColorIndex ) {
					copyColorIndex = relationship.values[ Math.floor( Math.random() * relationship.values.length ) ];
				}

				$.each( relationship.values, function() {
					newPalette[this] = newPalette[copyColorIndex];
				} );
			}
		} );

		return newPalette;
	}

	/**
	 * Check which slots of a palette should remain unmodified.
	 *
	 * @since 1.1.1
	 *
	 * @return array indexes of array that should not be changed.
	 */
	findLockedIndexes( partialPalette ) {
		let lockedIndexes = [];
		$.each( partialPalette, function( index ) {
			if ( this ) {
				lockedIndexes.push( index );
			}
		} );

		return lockedIndexes;
	}

	/**
	 * Determine the number of palettes that should be returned as relational.
	 *
	 * @since 1.1.1
	 *
	 * @return int number of palettes to return based on another palettes relationships.
	 */
	determineRelationalCount( type, size ) {
		let relationalPercentage;

		// Percentage of palettes that will be relational if possible.
		relationalPercentage = ( 2 / 3 );
		if ( 'additionalSamplePalattes' === type ) {
			relationalPercentage = ( 1 / 3 );
		}

		return Math.floor( size * relationalPercentage );
	}

	/**
	 * For a given color, return a list of palettes that have a similar color. Sorted by similarity.
	 *
	 * @param string sampleColor
	 * @since 1.1.1
	 *
	 * @return array palettes.
	 */
	findPalettesByColor( sampleColor ) {
		let palettes = [],
			sort,
			getPalette;

		getPalette = function() {
			return self.palette_collection[ this.paletteIndex ].slice( 0 );
		};

		$.each( self.palette_collection, function( paletteIndex ) {
			$.each( this, function( colorIndex ) {
				let colorDiff = self.colorDiff( this, sampleColor );

				// Max Hue Diff 16%.
				if ( 16 < colorDiff.hue ) {
					return;
				}

				let relationship = {
					'paletteIndex': paletteIndex,
					'colorIndex': colorIndex,
					'distance': colorDiff,
					'getPalette': getPalette
				};

				palettes.push( relationship );
			} );
		} );

		// Sort by diff percentage sum.
		sort = function( a, b ) {
			if ( Math.abs( a.distance.totalPercentageDiff ) > Math.abs( b.distance.totalPercentageDiff ) ) {
				return 1;
			}
			if ( Math.abs( a.distance.totalPercentageDiff ) < Math.abs( b.distance.totalPercentageDiff ) ) {
				return -1;
			}

			return 0;
		};

		palettes.sort( sort );

		return palettes;
	}

	/**
	 * Calls generate palette X times.
	 *
	 * @since 1.0
	 */
	generatePaletteCollection( paletteData, count ) {
		if ( ! count ) {
			count = 5;
		}

		// Determine Relationships.
		let paletteRelationships = self.determineRelations( paletteData ),
			lockedIndexes = self.findLockedIndexes( paletteData.partialPalette ),
			relationalCount = self.determineRelationalCount( paletteRelationships.type, count );

		let palettes = [];
		for ( let i = 0; i < count; i++ ) {
			let newPalette = self.generatePalette( paletteData );
			if ( ( 'object' === typeof newPalette ) && newPalette.length ) {
				let shouldApplyRelationships =
					'samplePalette' === paletteRelationships.type && i < relationalCount ||
					'additionalSamplePalattes' === paletteRelationships.type && ( i >= ( count - relationalCount ) );

				if ( shouldApplyRelationships ) {
					newPalette = self.applyRelationships( newPalette, paletteRelationships, lockedIndexes );
				}

				// Make sure that any locked colors are still locked in suggestions.
				newPalette = self.fixLockedIndex( newPalette, paletteData.partialPalette );

				palettes.push( newPalette );
			}
		}

		return palettes;
	}

	/**
	 * Make sure that any locked colors are still locked in suggestions.
	 *
	 * @since 1.2.7
	 */
	fixLockedIndex( newPalette, partialPalette ) {

		$.each( partialPalette, function( index ) {
			if ( this ) {
				newPalette[ index ] = this;
			}
		} );

		return newPalette;
	}

	/**
	 * Generate a single palette based on a partial list of colors in a palette.
	 *
	 * @since 1.0
	 */
	generatePalette( paletteData ) {
		let newPalette = [],
			colorsPartialPalette = self.partialPaletteIntoColorsPalette( paletteData.partialPalette ),
			boolEmptyPalette = self.isPaletteEmpty( colorsPartialPalette.palette );

		// If no colors are locked.
		if ( boolEmptyPalette ) {
			newPalette = self.getPaletteFromStaticList( colorsPartialPalette.palette );
		} else {

			// If the more than 1 color is locked.
			if ( 1 < colorsPartialPalette.generateKeys.length ) {
				let filledPalette = self.generatePaletteFromPartial( colorsPartialPalette.palette );
				newPalette = self.randomizePalette( filledPalette, colorsPartialPalette.unchangedKeys );

			// If only 1 color is locked.
			} else {

				let color = colorsPartialPalette.palette[ colorsPartialPalette.generateKeys[0] ];

				// Generate list of similar palettes if we don't have 1 saved already.
				if ( color.toCSS() !== apiColorCount.color ) {
					apiColorCount.color = color.toCSS();
					apiColorCount.palettes = self.findPalettesByColor( apiColorCount.color );
					apiColorCount.paletteCounter = 0;
				}

				if ( apiColorCount.palettes[ apiColorCount.paletteCounter ] ) {
					newPalette = apiColorCount.palettes[ apiColorCount.paletteCounter ].getPalette();
					newPalette = self.arrayMove( newPalette, colorsPartialPalette.generateKeys[0], this.colorIndex );
					newPalette = self.truncateGeneratedPalette( newPalette, colorsPartialPalette.palette );
					apiColorCount.paletteCounter++;

				} else {

					/*
					 * Try to generate a palette based on the color api color scheme methods.
					 * This is almost never used because it requires users to exhaust ~2500 color combinations.
					 */
					let random = ( Math.floor( Math.random() * 3 ) + 1 );
					if ( 1 === random ) {
						let internalMethod = internalPalettes[ Math.floor( Math.random() * internalPalettes.length ) ];

						let colorPalettes = new Palettes();
						newPalette = colorPalettes[ internalMethod ]( color );

					} else if ( 2 === random ) {
						let colorsMethod = colorSchemeMethods[ Math.floor( Math.random() * colorSchemeMethods.length ) ];
						newPalette = color[colorsMethod]();

					} else {
						let degrees = self.randomArray( 4, 5 );
						degrees.unshift( 0 );
						newPalette = color.schemeFromDegrees( degrees );
					}

					newPalette = self.randomizePalette( newPalette, [ 0 ] );
					newPalette = self.formatPaletteToUnchanged( newPalette, colorsPartialPalette.generateKeys[0] );
					newPalette = self.truncateGeneratedPalette( newPalette, colorsPartialPalette.palette );
				}
			}
		}

		// Set unchanged keys.
		let paletteClone = newPalette.slice( 0 );
		$.each( colorsPartialPalette.unchangedKeys, function() {
			paletteClone[this] = paletteData.partialPalette[this];
		} );

		return paletteClone;
	}

	/**
	 * If the user requests a 3 color palette and we generate a 5 color palette. trim the
	 * last 2 color in a palette
	 */
	truncateGeneratedPalette( generatedPalette, givenPartialPalette ) {
		let truncatedPalette = [];
		for ( let i = 0; i < givenPartialPalette.length; i++ ) {
			truncatedPalette.push( generatedPalette[i] );
		}

		return truncatedPalette;
	}

	/***
	 * Place the single color in the correct placement
	 */
	formatPaletteToUnchanged( newPalette, neededKey ) {
		let selectedColor = newPalette[0],
			formatedPalette = {};

		formatedPalette[neededKey] = selectedColor;
		formatedPalette[0] = newPalette[neededKey];

		$.each( newPalette, function( key ) {
			if ( 0 === key ) {
				return;
			}

			if ( key !== neededKey ) {
				formatedPalette[key] = ( this );
			}
		} );

		/*jshint unused:false*/
		formatedPalette = $.map( formatedPalette, function( value, index ) {
			return [ value ];
		} );

		return formatedPalette;
	}

	/**
	 * Take a partial palette and convert the color values from css to Color objects
	 */
	partialPaletteIntoColorsPalette( partialPalette ) {
		let colorPalette = [];
		let unchangedKeys = [];
		let generateKeys = [];
		$.each( partialPalette, function( key ) {
			if ( this ) {
				let color = net.brehaut.Color( this );

				// Colors that are to dark, light, or not saturated enough, should not be used for color calculations.
				if ( ( 0.90 ) > color.getLightness() && ( 0.10 ) < color.getLightness() && ( 0.15 ) < color.getSaturation() ) {
					colorPalette.push( color );
					generateKeys.push( key );
				} else {
					colorPalette.push( null );
				}

				unchangedKeys.push( key );
			} else {
				colorPalette.push( null );
			}
		} );

		return {
			'palette': colorPalette,
			'unchangedKeys': unchangedKeys,
			'generateKeys': generateKeys
		};
	}

	/**
	 * Get a palette from the color lovers list of palettes or otherwise
	 */
	getPaletteFromStaticList( partialPalette ) {
		let newPalette = [];

		// Try up to 2 times to find a palette.
		$.each( [ 1, 2 ], function() {
			let foundPalette = self.palette_collection [ Math.floor( Math.random() * self.palette_collection.length ) ];
			if ( foundPalette.length >= partialPalette.length ) {
				if ( foundPalette.length > partialPalette.length ) {
					for ( let i = 0; i < partialPalette.length; i++ ) {
						newPalette.push( foundPalette[i] );
					}
				} else if ( foundPalette.length === partialPalette.length ) {
					newPalette = foundPalette;
				}
			}

			if ( newPalette.length ) {

				// Break out of the loop if found.
				return false;
			}
		} );

		return newPalette;
	}

	/**
	 * Check if an array has no color definitions.
	 */
	isPaletteEmpty( partialPalette ) {
		let emptyPalette = true;
		$.each( partialPalette, function() {
			if ( this ) {
				emptyPalette = false;
				return false;
			}
		} );

		return emptyPalette;
	}

	/**
	 * Get a random shade of grey
	 */
	getGrey() {
		let Color = net.brehaut.Color( '#FFFFFF' );
		return Color.setBlue( 0 ).setRed( 0 ).setGreen( 0 ).setLightness( Math.random() ).toCSS();
	}

	/**
	 * Covert an array of color objects to an array of css color definitions
	 */
	colorArrayToCss( colors ) {
		let cssColors = [];

		$.each( colors, function( key ) {
			if ( 5 < key ) {
				cssColors.push( this.toCSS() );
			}
		} );

		return cssColors;
	}

	/**
	 * This function is used to create the rest of a palette if more than 1 color is given
	 */
	generatePaletteFromPartial( colors ) {
		let actualColors = [];
		$.each( colors, function( key, thisValue ) {
			if ( thisValue ) {
				actualColors.push( thisValue );
			}
		} );

		let paletteColors = [];
		$.each( colors, function( key, thisValue ) {
			if ( ! thisValue ) {
				let action = fillPaletteActions[Math.floor( Math.random() * fillPaletteActions.length )];
				let paletteColor = actualColors[Math.floor( Math.random() * actualColors.length )];
				let paletteColor2 = actualColors[Math.floor( Math.random() * actualColors.length )];
				let newColor;
				if ( 'compliment' === action ) {
					newColor = paletteColor.shiftHue( 180 );
				} else if ( 'blend' === action ) {
					newColor = paletteColor.blend( paletteColor2, 0.5 );
				} else {
					newColor = paletteColor;
				}
				paletteColors.push( newColor );
			} else {
				paletteColors.push( thisValue );
			}
		} );

		return paletteColors;
	}

	/**
	 * Take a palette palette and shaift the values slighly in order to provide the
	 * appearence of a completely new palette
	 * This function essentially makes a palette lighter/darker, saturates and hue shifts
	 */
	randomizePalette( palette, unchangedKeys ) {
		let paletteColors = [];
		$.each( palette, function( key ) {

			if ( 5 <= key ) {
				return false;
			}

			if ( -1 !== unchangedKeys.indexOf( key ) ) {
				paletteColors.push( this.toCSS() );
				return;
			}

			let color = this;
			for ( let i = 0; 2 > i; i++ ) {
				let method = methods[Math.floor( Math.random() * methods.length )];
				let value;

				if ( 'shiftHue' === method ) {
					value = ( Math.floor( Math.random() * 45 ) + 1 ) - 23;
				} else {
					value = ( Math.floor( Math.random() * 20 ) + 1 ) / 100;
				}

				color = color[method]( value );
				if ( 1 === i ) {
					paletteColors.push( color.toCSS() );
				}
			}
		} );

		return paletteColors;
	}

	/**
	 * Create an array with random variance values
	 */
	randomArray( size, varianceScale ) {
		let degrees = [];

		let range = 45 * varianceScale;
		for ( let i = 0; i < size; i++ ) {
			degrees.push( ( Math.floor( Math.random() * range ) + 1 ) - ( range / 2 ) );
		}
		return degrees;
	};

}
