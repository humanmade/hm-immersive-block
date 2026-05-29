import { ReactNode } from 'react';

import { RichText } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Inline credit field that auto-populates from attachment metadata.
 *
 * @param {object}   props                Passed in props.
 * @param {object}   props.attachmentData Media attachment data.
 * @param {string}   props.creditText     Credit text attribute from block/component.
 * @param {boolean}  props.hasUpdated     Has the media element updated?
 * @param {number}   props.mediaId        ID of the attachment post we want meta for.
 * @param {Function} props.setAttributes  Set block attributes function.
 * @param {Function} props.setHasUpdated  Set hasUpdated function.
 * @returns {ReactNode} Component.
 */
const MediaCredit = ( {
	attachmentData,
	creditText,
	hasUpdated,
	mediaId,
	setAttributes,
	setHasUpdated,
} ) => {
	const [ creditMeta, setCreditMeta ] = useState( undefined );

	useEffect( () => {
		if ( attachmentData?.credit_text && ! creditMeta ) {
			setCreditMeta( attachmentData?.credit_text );
		}
	}, [ attachmentData?.credit_text, creditMeta ] );

	useEffect( () => {
		if ( attachmentData?.credit_text && creditMeta === creditText ) {
			setCreditMeta( attachmentData?.credit_text );
			setAttributes( {
				creditText: attachmentData?.credit_text,
			} );
		}
	}, [ attachmentData?.credit_text, creditMeta, creditText, setAttributes ] );

	const { invalidateResolution } = useDispatch( 'core/data' );
	const invalidateResolver = useCallback( () => {
		invalidateResolution( 'core', 'getMedia', [ mediaId ] );
	}, [ mediaId, invalidateResolution ] );

	// If a user lacks upload_files capability, invalidating would return 403,
	// corrupting the entity state for all components using that media.
	const canInvalidateMedia = useSelect( ( select ) =>
		select( 'core' ).canUser( 'create', 'media' )
	);

	useEffect( () => {
		if ( ! hasUpdated || canInvalidateMedia === undefined ) {
			return;
		}
		if ( canInvalidateMedia ) {
			invalidateResolver();
		}
		setHasUpdated( false );
	}, [ hasUpdated, canInvalidateMedia, invalidateResolver, setHasUpdated ] );

	return (
		<RichText
			className="wp-element-caption--credit"
			placeholder={ __( 'Add media credit', 'hm-immersive-block' ) }
			tagName="p"
			value={ creditText }
			onChange={ ( creditText ) => setAttributes( { creditText } ) }
		/>
	);
};

export default MediaCredit;
