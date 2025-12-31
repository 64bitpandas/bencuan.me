# Design Decisions for Color App

## Architecture

1. **Standalone SCSS file**: Created `color_app.scss` as a standalone stylesheet that only imports fonts, mixins, and spacing from the existing codebase. All color app styles are self-contained.

2. **Separate component folder**: All color app components live in `src/color-app/` to keep them isolated from the main site.

3. **Client-side rendering for interactive pages**: The Palettes and Explorer pages use React components with `client:load` for interactivity (scroll tracking, clipboard, favorites).

## Palettes Page

1. **Intersection Observer for scroll tracking**: Used IntersectionObserver with 30% threshold and negative root margin to detect which palette section is "active" as the user scrolls.

2. **Full-width palette sections**: Palette sections use `width: 100vw; margin-left: calc(-50vw + 50%);` to break out of the container and fill the viewport width while keeping content centered.

3. **Tag assignments for palettes**:
   - Catppuccin Latte: Blue (highlight), Text (text), Surface 0 (secondary), Base (background)
   - bencuan.me v7: Palm Tree Island (highlight), Aspen Green (secondary), Stalactite (background), Anthracite (text)
   - Dracula: Pink (highlight), Current Line (secondary), Background (background), Foreground (text)

4. **Inverted header colors**: When scrolling to a palette, the header uses the highlight color as background and the background color as text—intentionally inverted for contrast as specified.

## Explorer Page

1. **Lazy loading via pagination**: Color books can have thousands of entries, so we paginate with 100 items per page rather than true virtualization. This balances performance with implementation simplicity.

2. **Pantone friendly name extraction**: The friendly names file uses codes like "11-4201" without prefix/suffix. We extract this pattern from full names like "PANTONE 11-4201 TCX" using regex.

3. **Ratcheting size slider**: The size slider uses discrete steps (100, 120, 140, 160, 180, 200px) rather than continuous values, implemented via array indexing.

4. **Mobile simplification**: On mobile, the favorites panel and size control are hidden (`display: none`) to keep the interface clean. Only the standard selector remains visible.

5. **Header color on click**: When a swatch is clicked, the header updates to that color with automatic light/dark text detection based on luminance calculation.

## CIELAB Conversion

1. **Standard D65 illuminant**: Used D65 white point (95.047, 100, 108.883) for LAB to XYZ conversion, which is standard for sRGB displays.

2. **sRGB gamma correction**: Applied proper gamma correction (2.4 exponent with linear segment) in XYZ to RGB conversion.

## Styling

1. **Variable font weight transitions**: Header nav links use `transition: font-weight 0.15s ease` to smoothly animate between normal (400) and bold (700) states. Manrope is a variable font, so this works smoothly.

2. **Phosphor icons**: Used `@phosphor-icons/react` which was already in the project dependencies, specifically Copy, Check, Star, and StarFill icons.

3. **Footer design**: Followed the exact spec: #F7F6F2 background, #297638 accent, 1px top border, centered link with Kevin the Dinosaur icon.

## Data Sources

1. **Palettes JSON structure**: Created a nested structure with palette metadata (name, source) and colors array with optional tags.

2. **Favorites preset**: Created `_favorites.json` with Pantone Colors of the Year (2018-2025) as the preset favorites collection.

