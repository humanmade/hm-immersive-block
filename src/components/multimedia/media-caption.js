import MediaCredit from './media-credit';
import { ReactNode } from 'react';

import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Editable caption + credit figcaption for use in the block editor.
 *
 * @param {object}   props                Passed in props.
 * @param {object}   props.attachmentData Media attachment data.
 * @param {string}   props.creditText     Credit text attribute from block/component.
 * @param {boolean}  props.hasUpdated     Has the media element updated?
 * @param {boolean}  props.isSelected     Is the block selected?
 * @param {string}   props.mediaCaption   Caption from the block.
 * @param {number}   props.mediaId        ID of the attachment post we want meta for.
 * @param {Function} props.setAttributes  Set block attributes function.
 * @param {Function} props.setHasUpdated  Set hasUpdated function.
 * @returns {ReactNode} Component.
 */
const MediaCaption = ( {
	attachmentData,
	creditText,
	hasUpdated,
	isSelected,
	mediaCaption,
	mediaId,
	setAttributes,
	setHasUpdated,
} ) => (
	<figcaption className="wp-element-caption">
		<RichText
			className="wp-element-caption--caption"
			placeholder={ __( 'Add caption', 'hm-immersive-block' ) }
			tagName="p"
			value={ mediaCaption }
			onChange={ ( mediaCaption ) =>
				setAttributes( {
					mediaCaption,
				} )
			}
		/>
		<MediaCredit
			attachmentData={ attachmentData }
			creditText={ creditText }
			hasUpdated={ hasUpdated }
			isSelected={ isSelected }
			mediaId={ mediaId }
			setAttributes={ setAttributes }
			setHasUpdated={ setHasUpdated }
		/>
	</figcaption>
);

/**
 * Static caption + credit figcaption for save output.
 *
 * @param {object} props             Component props.
 * @param {string} props.creditText  Credit text attribute from block/component.
 * @param {string} props.mediaCaption Caption from the block.
 * @returns {ReactNode} Component.
 */
MediaCaption.Content = ( { creditText, mediaCaption } ) => (
	<figcaption className="wp-element-caption">
		{ mediaCaption && (
			<RichText.Content
				className="wp-element-caption--caption"
				tagName="p"
				value={ mediaCaption }
			/>
		) }
		{ creditText && (
			<p className="wp-element-caption--credit">{ creditText }</p>
		) }
	</figcaption>
);

export default MediaCaption;
