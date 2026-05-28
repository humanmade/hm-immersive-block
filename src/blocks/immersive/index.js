import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import edit from './edit';
import save from './save';

// style.scss is extracted by @wordpress/scripts splitChunks into style.css (frontend, on-demand).
// editor-style.scss is extracted into index.css (editor, on-demand via editorStyle in block.json).
import './style.scss';
import './editor-style.scss';

registerBlockType( metadata.name, {
	...metadata,
	edit,
	save,
} );
