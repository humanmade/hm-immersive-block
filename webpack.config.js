const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) => ! ( plugin instanceof DependencyExtractionWebpackPlugin )
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal( request ) {
				if ( request === 'gsap' ) return 'gsap';
				if ( request === 'gsap/ScrollTrigger' ) return [ 'gsap', 'ScrollTrigger' ];
			},
			requestToHandle( request ) {
				if ( request === 'gsap' ) return 'gsap';
				if ( request === 'gsap/ScrollTrigger' ) return 'gsap-scroll-trigger';
			},
		} ),
	],
};
