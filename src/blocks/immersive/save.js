import { MediaCaption, Multimedia } from '../../components';
import classnames from 'classnames';
import { ReactNode } from 'react';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Block output.
 *
 * @param {object} props - Component props.
 * @returns {ReactNode} Component.
 */
function save( props ) {
	const { attributes } = props;
	const {
		align,
		creditText,
		fadeFirstSlide,
		mediaCaption,
		mediaType,
		minHeight,
		minHeightUnit,
		speed,
		transitionType,
		useMedia,
		useOverlay,
	} = attributes;

	const minHeightWithUnit =
		minHeight && minHeightUnit
			? `${ minHeight }${ minHeightUnit }`
			: undefined;

	const style = {
		'--min-height': minHeightWithUnit || undefined,
	};

	const blockProps = useBlockProps.save( {
		className: classnames( 'immersive', {
			[ `align${ align }` ]: align,
			'has-media-caption': creditText || mediaCaption,
			'has-overlay': useMedia && useOverlay,
			'wp-block-video': mediaType === 'video',
			'wp-block-video--ambient': mediaType === 'video',
		} ),
		'data-fade-first-slide': fadeFirstSlide,
		'data-speed': speed,
		'data-transition-type': transitionType,
		style: style,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: classnames( 'immersive--scroll-content', 'is-layout-flow', {
			[ `align${ align }` ]: align,
		} ),
	} );

	const blocksPropsFigure = {
		className: classnames( 'immersive--image', {
			[ `align${ align }` ]: align,
		} ),
	};

	return (
		<figure { ...blockProps }>
			{ useMedia && (
				<Multimedia.Content
					attributes={ attributes }
					blockProps={ blocksPropsFigure }
				/>
			) }
			<div { ...innerBlocksProps } />
			{ mediaType === 'video' && (
				<button
					aria-label="Pause ambient video"
					className="video-ambient-controls pause"
				></button>
			) }
			{ ( creditText || mediaCaption ) && (
				<MediaCaption.Content
					creditText={ creditText }
					mediaCaption={ mediaCaption }
				/>
			) }
		</figure>
	);
}

export default save;
