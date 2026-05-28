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
	$build_dir = dirname( __DIR__ ) . '/build/blocks';

	register_block_type( "$build_dir/immersive" );
	register_block_type( "$build_dir/immersive-slide" );
}
