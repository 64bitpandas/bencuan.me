# Design Decisions

## Architecture

### Standalone SCSS File
Created `color_app.scss` as a self-contained stylesheet that only imports `_fonts`, `_mixins`, and `_spacing` from the existing codebase. This keeps the color app styles isolated and maintainable.

### React for Explorer, Astro for Others
- **Palettes page**: Pure Astro with inline `<script>` for intersection observer and copy functionality
- **Explorer page**: React component (`ColorExplorer.tsx`) for complex state management (favorites, filtering, size slider)
- **About page**: Pure Astro (static content)

This approach minimizes JavaScript while using React only where significant interactivity is required.

### Color Book Grouping
Color books are grouped by standardized prefix:
- `PANTONE` and `PANTONE+` combined into single "PANTONE" group
- `TOYO 94` and `TOYO COLOR FINDER` combined into single "TOYO" group
- `HKS` variants (E, K, N, Z and their Process versions) under single "HKS" group

## Visual Design

### Header Color Transitions
Used CSS custom properties (`--header-bg`, `--header-text`) with CSS transitions for smooth color changes. The palettes page uses IntersectionObserver with 30% threshold to trigger changes when sections are sufficiently visible.

### Tag Assignments in Palettes
Assigned semantic tags to palette colors based on typical usage:
- **Catppuccin Latte**: base=background, surface 2=secondary, text=text, mauve=highlight
- **bencuan.me v7**: stalactite=background, frosted mint=secondary, anthracite=text, palm tree island=highlight
- **Dracula**: background=background, current line=secondary, foreground=text, pink=highlight

### Swatch Grid Sizing
The size slider uses a range of 3-10 columns, stored in localStorage. Mobile defaults to 3 columns regardless of slider value.

### Copy Feedback Animation
Used border-radius animation (square → circle → square) combined with overlay text for copy confirmation. This provides clear visual feedback without being disruptive.

## Code Simplifications

### PANTONE Name Formatting
The `formatPantoneName` function extracts the numeric code (e.g., "13-5305" from "PANTONE 13-5305 TCX") and looks it up in the pantone-color-names.json file. Names are title-cased from kebab-case.

### LAB to RGB Conversion
Implemented standard CIELAB → XYZ → sRGB conversion. The conversion assumes D65 illuminant standard (which matches the color book specifications).

### Favorites Storage
Used simple JSON serialization of a Set for localStorage. The preset loading completely replaces current favorites rather than merging.

## Deviations from Figma

### Mobile Responsiveness
Added mobile-specific styles not shown in Figma:
- Hidden favorites panel and size slider on mobile (standard selector only)
- Reduced swatch columns to 3 on mobile
- Adjusted header font sizes and padding
- Stack palette row grid on mobile

### Footer Simplification
Used a single centered layout with Kevin icon + link rather than matching exact Figma spacing, as the design was straightforward enough to simplify.

### Palette Table vs Grid
Figma showed a table-like layout. Implemented as CSS Grid for better responsiveness and alignment control, maintaining the visual appearance while being more flexible.
