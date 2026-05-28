import { ReactNode } from 'react';

import apiFetch from '@wordpress/api-fetch';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Renders an oEmbed URL as a sandboxed iframe preview for use in the block editor.
 *
 * Uses document.write() with allow-same-origin so embedded players (e.g. YouTube)
 * see the parent page's origin, matching the behaviour of the core/embed Sandbox component.
 *
 * @param {object} props     Component props.
 * @param {string} props.src Original embed URL (e.g. a YouTube watch URL).
 * @returns {ReactNode} Component.
 */
function EmbedPreview( { src } ) {
	const ref = useRef( null );

	useEffect( () => {
		if ( ! src ) return;
		apiFetch( { path: addQueryArgs( '/oembed/1.0/proxy', { url: src } ) } )
			.then( ( response ) => {
				const parsed = new window.DOMParser().parseFromString(
					response.html,
					'text/html'
				);
				const iframe = parsed.querySelector( 'iframe' );
				const rawSrc = iframe?.getAttribute( 'src' );
				const embedSrc = rawSrc?.startsWith( '//' )
					? `https:${ rawSrc }`
					: rawSrc;
				const el = ref.current;
				const doc = el?.contentDocument ?? el?.contentWindow?.document;
				if ( ! embedSrc || ! doc ) return;
				doc.open();
				doc.write(
					`<!DOCTYPE html><html><head>` +
						`<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%}iframe{width:100%;height:100%;border:0}</style>` +
						`</head><body>` +
						`<iframe src="${ embedSrc }" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>` +
						`</body></html>`
				);
				doc.close();
			} )
			.catch( () => {} );
	}, [ src ] );

	return (
		<iframe
			ref={ ref }
			sandbox="allow-scripts allow-same-origin allow-presentation"
			title={ __( 'Embedded video', 'hm-immersive-block' ) }
		/>
	);
}

export default EmbedPreview;
