import { ReactNode } from 'react';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const CONTENT_TEMPLATE = [ [ 'core/paragraph' ] ];

/**
 * Block edit view.
 *
 * @returns {ReactNode} Component.
 */
function Edit() {
	const blockProps = useBlockProps( {
		className: 'immersive--scroll-content-item is-layout-constrained',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: CONTENT_TEMPLATE,
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}

export default Edit;
