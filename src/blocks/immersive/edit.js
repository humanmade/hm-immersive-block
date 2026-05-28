import { CustomizeHeight, MediaCaption, Multimedia } from '../../components';
import { InnerBlockSlider } from '@humanmade/block-editor-components';
import classnames from 'classnames';
import { ReactNode } from 'react';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = 'hm-immersive/immersive-slide';
const CONTENT_TEMPLATE = [ [ ALLOWED_BLOCKS ] ];

/**
 * Block edit view.
 *
 * @param {object} props - Component props.
 * @returns {ReactNode} Component.
 */
function Edit( props ) {
	const { attributes, clientId, isSelected, setAttributes } = props;
	const {
		align,
		creditText,
		fadeFirstSlide,
		mediaCaption,
		mediaId,
		minHeight,
		minHeightUnit,
		speed,
		transitionType,
		useMedia,
	} = attributes;

	const [ hasUpdated, setHasUpdated ] = useState( false );

	const mediaItem = useSelect( ( select ) =>
		select( 'core' ).getMedia( mediaId )
	);

	const minHeightWithUnit =
		minHeight && minHeightUnit
			? `${ minHeight }${ minHeightUnit }`
			: undefined;

	const style = {
		'--min-height': minHeightWithUnit || undefined,
	};

	const blockProps = useBlockProps( {
		className: classnames( 'immersive', 'wp-block-image-wrapper', {
			[ `align${ align }` ]: align,
			'has-media-caption': creditText || mediaCaption,
		} ),
		style: style,
	} );

	const innerBlocksClass = classnames( 
		'immersive--scroll-content',
		'is-layout-flow',
		{
			[ `align${ align }` ]: align,
		}
	);

	const blocksPropsFigure = {
		...blockProps,
		className: classnames(
			'block-editor-block-list__block',
			'immersive--image',
			{
				[ `align${ align }` ]: align,
			}
		),
		style: {},
	};

	return (
		<figure { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Block height', 'hm-immersive-block' ) }>
					<CustomizeHeight
						minHeight={ minHeight }
						minHeightUnit={ minHeightUnit }
						setAttributes={ setAttributes }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Block settings', 'hm-immersive-block' ) }>
					<ToggleGroupControl
						isBlock
						label={ __( 'Scroll speed', 'hm-immersive-block' ) }
						value={ speed }
						onChange={ ( state ) => {
							setAttributes( {
								speed: state,
							} );
						} }
					>
						<ToggleGroupControlOption
							label={ __( 'Slow', 'hm-immersive-block' ) }
							value="225"
						/>
						<ToggleGroupControlOption
							label={ __( 'Medium', 'hm-immersive-block' ) }
							value="150"
						/>
						<ToggleGroupControlOption
							label={ __( 'Fast', 'hm-immersive-block' ) }
							value="75"
						/>
					</ToggleGroupControl>
					<ToggleControl
						checked={ useMedia }
						label={ __(
							'Use the same background media across all slides',
							'hm-immersive-block'
						) }
						onChange={ ( useMedia ) => {
							setAttributes( { useMedia } );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Transitions', 'hm-immersive-block' ) }>
					<ToggleGroupControl
						isBlock
						label={ __( 'Transition type', 'hm-immersive-block' ) }
						value={ transitionType }
						onChange={ ( state ) => {
							setAttributes( {
								transitionType: state,
							} );
						} }
					>
						<ToggleGroupControlOption
							label={ __( 'Scroll', 'hm-immersive-block' ) }
							value="scroll"
						/>
						<ToggleGroupControlOption
							label={ __( 'Fade', 'hm-immersive-block' ) }
							value="fade"
						/>
					</ToggleGroupControl>
					<ToggleControl
						checked={ fadeFirstSlide }
						help={
							// prettier-ignore
							fadeFirstSlide
								? __(
									'The first slide will fade in from 0 opacity.',
									'hm-immersive-block'
								)
								: __(
									'The first slide will be full opacity on load.',
									'hm-immersive-block'
								)
						}
						label={ __(
							'Fade in the first slide',
							'hm-immersive-block'
						) }
						onChange={ ( fadeFirstSlide ) => {
							setAttributes( { fadeFirstSlide } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			{ useMedia && (
				<Multimedia
					attributes={ attributes }
					blockProps={ blocksPropsFigure }
					isSelected={ isSelected }
					setAttributes={ setAttributes }
				/>
			) }
			<div className={ innerBlocksClass }>
				<InnerBlockSlider
					allowedBlock={ ALLOWED_BLOCKS }
					parentBlockId={ clientId }
					slidesPerPage={ 1 }
					template={ CONTENT_TEMPLATE }
				/>
			</div>
			<MediaCaption
				attachmentData={ mediaItem }
				creditText={ creditText }
				hasUpdated={ hasUpdated }
				mediaCaption={ mediaCaption }
				mediaId={ mediaId }
				setAttributes={ setAttributes }
				setHasUpdated={ setHasUpdated }
			/>
		</figure>
	);
}

export default Edit;
