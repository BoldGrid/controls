export { ColorPalette } from './color';
export { Selection as ColorPaletteSelection } from './color';
export { Config as PaletteConfiguration } from './color';
export { SassCompiler } from './color';

export { Updater as StyleUpdater } from './style';

export default {
	'Color': require( './color' ),
	'Style': require( './style' )
};
