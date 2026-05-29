const immersiveVideos = document.querySelectorAll(
	'.wp-block-hm-immersive-immersive.wp-block-video--ambient'
);

/**
 * Initialises play/pause controls for ambient (autoplay, muted) video backgrounds.
 *
 * @param {NodeList} videos Node list of immersive video wrapper elements.
 */
export const showAmbientVideoControls = ( videos ) => {
	if ( videos.length === 0 ) {
		return;
	}

	videos.forEach( ( videoWrapper ) => {
		const iframe = videoWrapper.querySelector( '.immersive--image iframe' );
		const video = videoWrapper.querySelector( '.immersive--image video' );
		const ambientControls = videoWrapper.querySelector(
			'.video-ambient-controls'
		);

		if (
			! ( video || iframe ) ||
			( video && ! video.hasAttribute( 'autoplay' ) ) ||
			! ambientControls
		) {
			return;
		}

		if ( iframe ) {
			if ( iframe.src.includes( 'youtube' ) ) {
				iframe.src +=
					'&enablejsapi=1&autoplay=1&mute=1&controls=0&playsinline=1&rel=0&loop=1';
			} else if ( iframe.src.includes( 'vimeo' ) ) {
				iframe.src += '&background=1';
			}
		}

		// If it's not muted, it won't autoplay, so we need to adjust our controls.
		if ( video && ! video.hasAttribute( 'muted' ) ) {
			ambientControls.classList.toggle( 'play' );
			ambientControls.classList.toggle( 'pause' );

			// Set aria label.
			ambientControls.setAttribute( 'aria-label', 'Play ambient video' );
		}

		// Add click event listeners to play and pause the video.
		ambientControls.addEventListener(
			'click',
			function () {
				if ( ambientControls.classList.contains( 'play' ) ) {
					video?.play();
					iframe?.contentWindow.postMessage(
						JSON.stringify( {
							event: 'command', // For YouTube.
							func: 'playVideo', // For YouTube.
							method: 'play', // For vimeo.
						} ),
						'*'
					);
					ambientControls.setAttribute(
						'aria-label',
						'Pause ambient video'
					);
				} else {
					video?.pause();
					iframe?.contentWindow.postMessage(
						JSON.stringify( {
							event: 'command', // For YouTube.
							func: 'pauseVideo', // For YouTube.
							method: 'pause', // For vimeo.
						} ),
						'*'
					);
					ambientControls.setAttribute(
						'aria-label',
						'Play ambient video'
					);
				}
				ambientControls.classList.toggle( 'play' );
				ambientControls.classList.toggle( 'pause' );
			},
			false
		);
	} );
};

/**
 * @param {boolean} reduceMotion Is motion reduced?
 */
function setAutoPlay( reduceMotion ) {
	immersiveVideos.forEach( ( video ) => {
		const videoElement = video.querySelector( 'video' );
		const iframe = video.querySelector( 'iframe' );

		if ( videoElement ) {
			const autoPlay = videoElement.getAttribute( 'autoplay' );
			const hadAutoPlay = videoElement.getAttribute( 'hadautoplay' );

			if ( autoPlay === null && hadAutoPlay === null ) {
				return;
			}

			if ( reduceMotion ) {
				videoElement.removeAttribute( 'autoplay' );
				videoElement.setAttribute( 'hadautoplay', '' );
				videoElement.pause();
			} else {
				videoElement.setAttribute( 'autoplay', '' );
				videoElement.removeAttribute( 'hadautoplay' );

				if ( videoElement.hasAttribute( 'muted' ) ) {
					videoElement.play();
				}
			}
		}

		if ( iframe ) {
			const src = iframe.getAttribute( 'src' );
			const isYouTube = src.includes( 'youtube' );
			const autoplayString = isYouTube ? 'autoplay' : 'background';
			const autoPlay = src.includes( autoplayString + '=1' );
			const hadAutoPlay = iframe.getAttribute( 'hadautoplay' );

			if ( autoPlay === null && hadAutoPlay === null ) {
				return;
			}

			if ( reduceMotion ) {
				iframe.setAttribute(
					'src',
					src.replace( autoplayString + '=1', autoplayString + '=0' )
				);
				iframe.setAttribute( 'hadautoplay', '' );
			} else {
				iframe.setAttribute(
					'src',
					src.replace( autoplayString + '=0', autoplayString + '=1' )
				);
				iframe.removeAttribute( 'hadautoplay' );
			}
		}
	} );
}

/**
 * Watches the prefers-reduced-motion media query and toggles autoplay accordingly.
 */
export const monitorReducedMotion = () => {
	document.addEventListener( 'DOMContentLoaded', () => {
		const mediaQuery = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);
		setAutoPlay( mediaQuery.matches );
		mediaQuery.addEventListener( 'change', () => {
			setAutoPlay( mediaQuery.matches );
		} );
	} );
};
