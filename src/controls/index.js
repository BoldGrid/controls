export { ColorPalette } from './color';
export { Selection as ColorPaletteSelection } from './color';
export { Config as PaletteConfiguration } from './color';
export { SassCompiler } from './color';
export { Padding } from './padding';
export { Border } from './border';
export { Margin } from './margin';
export { BorderRadius } from './border-radius';
export { BoxShadow } from './box-shadow';

export { Updater as StyleUpdater } from './style';

export default {
	'Color': require( './color' ),
	'Style': require( './style' ),
	'Padding': require( './padding' )
};
