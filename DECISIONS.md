# Color App Design Decisions

## Architecture

### File Structure
- Created `src/color-app/` subfolder for all color app components
- Single `src/sass/color_app.scss` imports only fonts, mixins, spacing from existing codebase
- Pages at `/colors`, `/colors/explorer`, `/colors/about`

### Component Strategy
- `ColorLayout.astro` - Shared layout with header/footer
- React components for interactive pages (PalettesPage, ExplorerPage)
- Astro pages for static content (About)

## Styling Decisions

### Typography
- Manrope variable font (200-800 weight) for UI
- Fira Code variable font for hex/RGB values
- Bold first word of palette names achieved via splitting and wrapping

### Header Navigation
- Used `//` as separator per Figma design
- `current` class for active page styling
- Smooth font-weight transition on hover (0.15s)

### Dynamic Header Theming (Palettes)
- IntersectionObserver watches palette sections
- Header background/text updates to current section's highlight/background colors
- Scroll-to-top resets to first palette theme

### Color Rows
- Grid layout with consistent column widths
- Hover background uses CSS custom property `--hover-bg` per section
- Copy buttons use simple Unicode symbols (⧉ → ✓)

## Explorer Decisions

### Performance
- Limited initial render to 200 swatches for performance
- Lazy loading could be added for full dataset

### Swatch Interactions
- Click copies hex, shows "Copied!" overlay, updates header
- Star button toggles localStorage favorites
- Ratcheting size slider with preset values [60, 80, 100, 120, 140]px

### Mobile
- Hide favorites controls and size slider on mobile
- Only standard selector remains visible

## Data Decisions

### Palette Format
Changed from array to object structure:
```json
{
  "palette name": {
    "source": "url",
    "colors": [{ "name": "", "hex": "", "tag": null|"background"|"secondary"|"text"|"highlight" }]
  }
}
```

### Color Tags
- One color per palette assigned to each tag
- Tags determine section theming
- Tags displayed as pills with highlight background

### CIELAB Conversion
- Implemented D65 illuminant standard
- sRGB gamma correction applied
- Values clamped to 0-255 range

## Deviations from Figma

1. **Spacing**: Used existing Utopia fluid spacing scale rather than exact pixel values
2. **Swatch info layout**: Simplified to bottom-aligned text instead of strict grid
3. **Copy icons**: Used Unicode instead of Phosphor icons (not installed in project)
4. **Footer dinosaur**: Used existing favicon.png instead of separate asset

