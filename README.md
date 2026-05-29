# HM Immersive Block

A WordPress block plugin that pins a full-viewport background image or video while scrolling text slides animate into view. Scroll animation is powered by [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## Blocks

### `hm-immersive/immersive`

The container block. Accepts a background image or video (including YouTube/Vimeo embeds) and one or more Immersive Slide inner blocks. Inspector controls:

- **Block height** — minimum height in `px` or `vh`
- **Scroll speed** — slow / medium / fast (controls how long each slide is pinned)
- **Transition type** — scroll (slides move vertically) or fade (slides crossfade)
- **Fade in first slide** — whether the first slide starts at zero opacity
- **Same background across all slides** — when off, each slide can set its own background image via block supports

### `hm-immersive/immersive-slide`

A single content panel inside the Immersive block. Accepts any inner blocks. Supports per-slide background image and color via block supports.

## Requirements

- WordPress 6.3+
- PHP 8.0+

## Sticky header offset

The frontend animation pins the block to the viewport and begins scrolling from the top of the visible area. If the site has a sticky header, the block needs to account for its height so it doesn't start behind it.

The plugin reads `scroll-padding-top` from the `<html>` element to determine this offset. Set it in your theme to match the sticky header height:

```css
html {
    scroll-padding-top: var(--hm-immersive-header-height);
}
```

`scroll-padding-top` is a [CSS standard](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top) already used by browsers for anchor link positioning — no plugin-specific configuration required. If it is not set, the offset defaults to `0`.

## Theming

The plugin exposes CSS custom properties for colors. Define these in your theme to override the defaults:

| Property | Default | Usage |
|---|---|---|
| `--hm-immersive-header-height` | `var(--wp-admin--admin-bar--height, 0px)` | CSS-side sticky header height; used to compute available block height. Set to match your header height. |
| `--hm-immersive-max-height` | `100vh` | Maximum height the block can occupy |
| `--hm-immersive-min-height` | `var(--hm-immersive-available-height)` | Minimum block height; override to enforce a specific floor |
| `--hm-immersive-overlay-bg` | `rgba(0,0,0,0.55)` | Dark overlay on the background image |
| `--hm-immersive-content-color` | `#fff` | Slide text color when no background is set |
| `--hm-immersive-caption-color` | `initial` | Caption text color; inherits by default |
| `--hm-immersive-caption-bg` | `#fff` | Background of the media caption area |
| `--hm-immersive-slide-bg` | `#777` | Slide background when no image and no block background is set |
| `--hm-immersive-nav-bg` | `rgba(255,255,255,0.95)` | In-editor slide navigation bar background |
| `--hm-immersive-button-color-bg` | `#FFF` | Background color of the ambient video button; swaps to foreground on hover/focus |
| `--hm-immersive-button-color` | `#000` | Foreground/text color of the ambient video button; swaps to background on hover/focus |
| `--hm-immersive-button-margin` | `1rem` | Spacing around the ambient video pause button |
| `--hm-immersive-button-padding` | `0.5rem` | Inner padding of the ambient video pause button |
| `--hm-immersive-button-width` | `3rem` | Size of the ambient video pause button |
| `--hm-immersive-button-font-size` | `2rem` | Font size of the play/pause icon inside the button |
| `--hm-immersive-button-outline` | `2px solid currentColor` | Focus outline of the ambient video pause button |

Content alignment uses the WordPress layout custom properties (`--wp--style--global--wide-size`, `--wp--style--root--padding-left/right`) with sensible fallbacks, so it integrates automatically with full-site-editing themes.

## Build

```bash
npm install
npm run build   # production
npm run start   # development watch
```

Built assets are output to `build/`. The `build/` directory should not be committed — run the build step as part of your deployment process.

Requires Node.js. Uses [`@wordpress/scripts`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) with automatic block detection; no custom webpack configuration is needed.

GSAP and ScrollTrigger are loaded as registered WordPress scripts (not bundled into the view script). The build step copies the GSAP dist files from `node_modules` to `build/vendor/` automatically.
