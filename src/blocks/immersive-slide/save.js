import { ReactNode } from 'react';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Block output.
 *
 * @returns {ReactNode} Component.
 */
function save() {
	const blockProps = useBlockProps.save( {
		className: 'immersive--scroll-content-item is-layout-constrained',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( blockProps );

	return <div { ...innerBlocksProps } />;
}

export default save;
