import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

/**
 * Initialise the GSAP ScrollTrigger animation for one immersive block element.
 *
 * Reads data-speed, data-transition-type, and data-fade-first-slide from the
 * element written by save.js.
 *
 * The sticky-header offset uses '.site-header' — update to match your theme.
 *
 * @param {Element} immersiveEl The .immersive block element.
 */
function initImmersive( immersiveEl ) {
	const content = immersiveEl.querySelector( '.immersive--scroll-content' );
	const scrollSpeed = parseInt( immersiveEl?.dataset?.speed || 150 );
	const fadeFirstSlide =
		immersiveEl?.dataset?.fadeFirstSlide === 'true' ? true : false;
	const transitionType = immersiveEl?.dataset?.transitionType || 'scroll';

	const mm = gsap.matchMedia();
	const breakpoint = 1200;

	mm.add(
		{
			isDesktop: `(min-width: ${ breakpoint }px)`,
			isMobile: `(max-width: ${ breakpoint - 1 }px)`,
			isPrint: 'print',
			reduceMotion: '(prefers-reduced-motion: reduce)',
		},
		( context ) => {
			const { isPrint, reduceMotion } = context.conditions;

			if ( isPrint ) {
				return;
			}

			// scroll-padding-top on <html> is the CSS standard way for themes
			// to declare how much space a sticky header occupies.
			const headerHeight =
				parseInt(
					getComputedStyle( document.documentElement )
						.scrollPaddingTop
				) || 0;

			const contentHeight = content.offsetHeight;
			const contentItems = content.querySelectorAll(
				'.immersive--scroll-content-item'
			);
			const scrollEnd = `+=${ contentItems.length * scrollSpeed }%`;

			const tl = gsap.timeline( {
				scrollTrigger: {
					trigger: immersiveEl,
					start: 'top ' + headerHeight + 'px',
					end: scrollEnd,
					pin: true,
					pinType: 'fixed',
					refreshPriority: 0,
					scrub: 1,
					toggleClass: 'immersive--active',
				},
				defaults: { ease: 'none' },
			} );

			contentItems.forEach( ( item, index ) => {
				const isFirst = index === 0;
				const isLast = index === contentItems.length - 1;
				const isVisibleFirstSlide = isFirst && ! fadeFirstSlide;
				const firstDuration = isVisibleFirstSlide ? 0 : 1;
				const middleDuration = transitionType === 'fade' ? 1 : 0.5;
				const lastDuration = isLast ? 0 : 1;

				tl.fromTo(
					item,
					{
						opacity: reduceMotion || isVisibleFirstSlide ? 1 : 0,
						y:
							isFirst || transitionType === 'fade'
								? 0
								: contentHeight,
					},
					{
						keyframes: [
							{
								y:
									isFirst || transitionType === 'fade'
										? 0
										: '-=' + contentHeight,
								duration: firstDuration,
								opacity: 1,
							},
							{
								duration: middleDuration,
							},
							{
								y:
									isLast || transitionType === 'fade'
										? '-=0'
										: '-=' + contentHeight,
								duration: lastDuration,
								opacity: reduceMotion || isLast ? 1 : 0,
							},
						],
					},
					'>-1'
				);
			} );

			if (
				! immersiveEl.parentElement.classList.contains( 'pin-spacer' )
			) {
				return;
			}

			immersiveEl.parentElement.classList.add( 'immersive-pin' );

			if ( immersiveEl.classList.contains( 'alignfull' ) ) {
				immersiveEl.parentElement.classList.add( 'alignfull' );
			}

			if ( immersiveEl.classList.contains( 'alignwide' ) ) {
				immersiveEl.parentElement.classList.add( 'alignwide' );
			}
		}
	);
}

function init() {
	document.querySelectorAll( '.immersive' ).forEach( initImmersive );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
