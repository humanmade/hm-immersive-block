import { getImageDataForSize } from '@humanmade/block-editor-components';
import classnames from 'classnames';
import { merge } from 'lodash';
import { ReactNode } from 'react';

import {
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import {
	Disabled,
	ExternalLink,
	PanelBody,
	TextareaControl,
	ToolbarButton,
	withNotices,
} from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ALLOWED_MEDIA_TYPES = [ 'image', 'video/mp4' ];

const ALLOWED_URL_PATTERNS = [
	/^https?:\/\/((m|www)\.)?youtube\.com\/.+/i,
	/^https?:\/\/youtu\.be\/.+/i,
	/^https?:\/\/(www\.)?vimeo\.com\/.+/i,
];

/**
 * Multimedia selection component for use in the block editor.
 *
 * @param {object}   props                  Component props.
 * @param {Array}    props.allowedMedia     Allowed media types.
 * @param {object}   props.attributes       Block media attributes.
 * @param {object}   props.blockProps       Block props passed from block.
 * @param {boolean}  props.isSelected       Is the block selected?
 * @param {object}   props.noticeUI         Notice UI from withNotices HOC.
 * @param {object}   props.noticeOperations Notice operations from withNotices HOC.
 * @param {Function} props.setAttributes    Set block attributes function.
 * @returns {ReactNode} Component.
 */
const MultimediaWrapper = withNotices(
	( {
		allowedMedia = ALLOWED_MEDIA_TYPES,
		attributes,
		blockProps = {},
		isSelected,
		noticeUI,
		noticeOperations,
		setAttributes,
	} ) => {
		const {
			mediaAlt,
			mediaHeight,
			mediaId,
			mediaSize,
			mediaType,
			mediaUrl,
			mediaWidth,
		} = attributes;

		const classes = classnames(
			blockProps?.className && blockProps?.className,
			{
				'wp-block-image': mediaType === 'image',
				'wp-block-video': mediaType === 'video',
				'wp-block-video--ambient': mediaType === 'video',
			}
		);

		blockProps = merge( { ...blockProps, className: classes } );

		const onSelectMedia = useCallback(
			( media ) => {
				if ( ! media?.url ) {
					setAttributes( {
						mediaAlt: undefined,
						mediaCaption: undefined,
						mediaHeight: undefined,
						mediaId: undefined,
						mediaLength: undefined,
						mediaType: undefined,
						mediaUrl: undefined,
						mediaWidth: undefined,
					} );
					return;
				}

				if ( media.type === 'video' ) {
					setAttributes( {
						mediaAlt: undefined,
						mediaCaption: media.caption,
						mediaHeight: undefined,
						mediaId: media.id,
						mediaType: media.type,
						mediaUrl: media.url,
						mediaWidth: undefined,
					} );
					return;
				}

				const mediaSizeData = getImageDataForSize(
					media,
					media.sizes && media.sizes[ mediaSize ] ? mediaSize : 'full'
				);

				setAttributes( {
					mediaAlt: media?.alt,
					mediaCaption: media?.caption,
					mediaHeight: mediaSizeData?.height,
					mediaId: media?.id,
					mediaType: media?.type,
					mediaUrl: mediaSizeData?.src,
					mediaWidth: mediaSizeData?.width,
				} );
			},
			[ mediaSize, setAttributes ]
		);

		const matchesPatterns = ( url, patterns = ALLOWED_URL_PATTERNS ) =>
			patterns.some( ( pattern ) => url.match( pattern ) );

		const normalizeUrl = useCallback( ( mediaUrl ) => {
			let mediaArr = [];
			let embedURL;
			if ( matchesPatterns( mediaUrl, [ ALLOWED_URL_PATTERNS[ 0 ] ] ) ) {
				const cleanedUrl = mediaUrl.replace(
					'youtube.com/watch?v=',
					'youtube.com/embed/'
				);
				mediaArr = cleanedUrl.split( /&|%|embed\/|\?/ );
				embedURL = 'https://www.youtube.com/embed/' + mediaArr[ 1 ];
			} else if (
				matchesPatterns( mediaUrl, [ ALLOWED_URL_PATTERNS[ 1 ] ] )
			) {
				mediaArr = mediaUrl.split( 'youtu.be/' );
				embedURL = 'https://www.youtube.com/embed/' + mediaArr[ 1 ];
			} else if (
				matchesPatterns( mediaUrl, [ ALLOWED_URL_PATTERNS[ 2 ] ] )
			) {
				mediaArr = mediaUrl.split( 'vimeo.com/' );
				embedURL = 'https://player.vimeo.com/video/' + mediaArr[ 1 ];
			}
			return embedURL;
		}, [] );

		const onSelectUrl = useCallback(
			( mediaUrl ) => {
				if ( ! matchesPatterns( mediaUrl ) ) {
					noticeOperations.createErrorNotice(
						__(
							'Please provide a YouTube or Vimeo URL.',
							'hm-immersive-block'
						)
					);
					return;
				}
				onSelectMedia( { type: 'video', url: normalizeUrl( mediaUrl ) } );
			},
			[ normalizeUrl, noticeOperations, onSelectMedia ]
		);

		const mediaToolbarControl = useMemo(
			() =>
				mediaUrl && (
					<BlockControls group="other">
						<MediaReplaceFlow
							allowedTypes={ allowedMedia }
							mediaId={ mediaId }
							mediaURL={ mediaUrl }
							name={ __( 'Replace Media', 'hm-immersive-block' ) }
							onSelect={ onSelectMedia }
							onSelectURL={
								allowedMedia.includes( 'video/mp4' )
									? onSelectUrl
									: false
							}
						/>
						<ToolbarButton
							onClick={ () => onSelectMedia( undefined ) }
						>
							{ __( 'Remove Media', 'hm-immersive-block' ) }
						</ToolbarButton>
					</BlockControls>
				),
			[ allowedMedia, mediaId, mediaUrl, onSelectMedia, onSelectUrl ]
		);

		const mediaSettingsPanel = useMemo(
			() =>
				mediaUrl && mediaType === 'image' && (
					<InspectorControls>
						<PanelBody
							title={ __( 'Settings', 'hm-immersive-block' ) }
						>
							<TextareaControl
								help={
									<>
										<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
											{ __(
												'Describe the purpose of the image.',
												'hm-immersive-block'
											) }
										</ExternalLink>
										<br />
										{ __(
											'Leave empty if decorative.',
											'hm-immersive-block'
										) }
									</>
								}
								label={ __(
									'Alternative text',
									'hm-immersive-block'
								) }
								value={ mediaAlt }
								onChange={ ( mediaAlt ) =>
									setAttributes( { mediaAlt } )
								}
							/>
						</PanelBody>
					</InspectorControls>
				),
			[
				mediaAlt,
				mediaType,
				mediaUrl,
				setAttributes,
			]
		);

		const mediaPlaceholder = useMemo(
			() => (
				<>
					<MediaPlaceholder
						allowedTypes={ allowedMedia }
						className={ 'wp-block-image' }
						disableMediaButtons={ mediaUrl }
						icon="format-image"
						onError={ ( message ) => {
							noticeOperations.removeAllNotices();
							noticeOperations.createErrorNotice( message );
						} }
						onSelect={ onSelectMedia }
						onSelectURL={
							allowedMedia.includes( 'video/mp4' )
								? onSelectUrl
								: false
						}
					/>
					{ noticeUI }
					{ mediaUrl && (
						<figure { ...blockProps }>
							{ mediaType === 'image' ? (
								<img
									alt={ mediaAlt }
									height={ mediaHeight }
									loading="lazy"
									src={ mediaUrl }
									width={ mediaWidth }
								/>
							) : mediaId ? (
								<Disabled isDisabled={ ! isSelected }>
									<video
										controls
										playsinline
										src={ mediaUrl }
									/>
								</Disabled>
							) : (
								<Disabled isDisabled={ ! isSelected }>
									<iframe
										src={ mediaUrl }
										title={ __(
											'Embedded content from youtube.com',
											'hm-immersive-block'
										) }
									/>
								</Disabled>
							) }
						</figure>
					) }
				</>
			),
			[
				allowedMedia,
				blockProps,
				isSelected,
				mediaAlt,
				mediaHeight,
				mediaId,
				mediaType,
				mediaUrl,
				mediaWidth,
				noticeOperations,
				noticeUI,
				onSelectMedia,
				onSelectUrl,
			]
		);

		return (
			<>
				{ mediaToolbarControl }
				{ mediaSettingsPanel }
				{ mediaPlaceholder }
			</>
		);
	}
);

/**
 * Static media output for save() output.
 *
 * @param {object}  props            Component props.
 * @param {object}  props.attributes Block media attributes.
 * @param {object}  props.blockProps Block props passed from block.
 * @param {boolean} props.lazyLoad   Lazy load images.
 * @returns {ReactNode} Component.
 */
MultimediaWrapper.Content = ( {
	attributes,
	blockProps = {},
	lazyLoad = true,
} ) => {
	const {
		mediaAlt,
		mediaHeight,
		mediaId,
		mediaType,
		mediaUrl,
		mediaWidth,
	} = attributes;

	const classes = classnames(
		blockProps?.className && blockProps?.className,
		{
			'wp-block-image': mediaType === 'image',
			'wp-block-video': mediaType === 'video',
			'wp-block-video--ambient': mediaType === 'video',
		}
	);

	blockProps = merge( { ...blockProps, className: classes } );

	const loading = lazyLoad === false ? 'eager' : 'lazy';

	if ( ! mediaUrl ) {
		return <></>;
	}

	return (
		<figure { ...blockProps }>
			{ mediaType === 'image' ? (
				<img
					alt={ mediaAlt }
					className={ 'wp-image-' + mediaId }
					height={ mediaHeight }
					loading={ loading }
					src={ mediaUrl }
					width={ mediaWidth }
				/>
			) : mediaId ? (
				<video autoplay loop muted playsinline src={ mediaUrl } />
			) : (
				`\n${ mediaUrl }\n`
			) }
		</figure>
	);
};

export default MultimediaWrapper;
