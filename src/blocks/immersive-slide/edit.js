import { ReactNode } from 'react';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const CONTENT_TEMPLATE = [ [ 'core/paragraph' ] ];

/**
 * Block edit view.
 *
 * @returns {ReactNode} Component.
 */
function Edit( { attributes } ) {
	const { layout } = attributes;

	const blockProps = useBlockProps( {
		className: 'immersive--scroll-content-item',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: CONTENT_TEMPLATE,
		templateLock: false,
		__experimentalLayout: layout,
	} );

	return <div { ...innerBlocksProps } />;
}

export default Edit;
