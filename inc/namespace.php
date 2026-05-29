<?php
/**
 * HM Immersive Block.
 *
 * @package hm-immersive-block
 */

namespace HM\ImmersiveBlock;

/**
 * Set up actions and filters.
 */
function bootstrap() : void {
	add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
}

/**
 * Register block types from their built block.json files.
 *
 * Scripts and styles are declared as file: references in block.json and
 * registered automatically by WordPress when the block is present on a page.
 */
function register_blocks() : void {
	$build_dir  = dirname( __DIR__ ) . '/build/blocks';
	$vendor_dir = dirname( __DIR__ ) . '/build/vendor';
	$plugin_url = plugin_dir_url( dirname( __DIR__ ) . '/hm-immersive-block.php' );

	wp_register_script(
		'gsap',
		$plugin_url . 'build/vendor/gsap.min.js',
		[],
		file_exists( "$vendor_dir/gsap.min.js" ) ? (string) filemtime( "$vendor_dir/gsap.min.js" ) : false,
		[ 'in_footer' => true ]
	);

	wp_register_script(
		'gsap-scroll-trigger',
		$plugin_url . 'build/vendor/ScrollTrigger.min.js',
		[ 'gsap' ],
		file_exists( "$vendor_dir/ScrollTrigger.min.js" ) ? (string) filemtime( "$vendor_dir/ScrollTrigger.min.js" ) : false,
		[ 'in_footer' => true ]
	);

	register_block_type( "$build_dir/immersive" );
	register_block_type( "$build_dir/immersive-slide" );
}
