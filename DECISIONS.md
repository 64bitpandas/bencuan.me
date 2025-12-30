# Design Decisions for Ben's Colors

## Layout & Styling

1. **Standalone SCSS file**: Created `color_app.scss` that imports only `fonts`, `mixins`, and `spacing` from existing SCSS, defining all color-app specific styles in one place.

2. **CSS Variables for dynamic colors**: Used CSS custom properties (`--color-header-bg`, etc.) to enable JavaScript-driven color changes on scroll/interaction without inline style conflicts.

3. **Sticky header**: Made the header sticky instead of fixed to ensure it stays visible while scrolling through palettes but allows for natural document flow.

## Palettes Page

4. **Tag assignments**: Assigned exactly one color per tag type in each palette based on semantic meaning:
   - Catppuccin Latte: base (background), surface0 (secondary), text (text), mauve (highlight)
   - bencuan.me v7: stalactite (background), frosted mint (secondary), anthracite (text), palm tree island (highlight)
   - Dracula: background (background), current line (secondary), foreground (text), cyan (highlight)

5. **Header color inversion**: On palette scroll, the header uses `highlight` as background and `background` as text color to create intentional contrast, as specified.

6. **Last palette spacer**: Added a `min-height: 60vh` spacer after the final palette to ensure users can fully scroll and experience the header color change.

7. **IntersectionObserver threshold**: Used 0.3 threshold for palette detection to trigger color changes when ~30% of a palette section is visible, providing responsive feedback.

## Explorer Page

8. **Prefix grouping logic**: Combined PANTONE and PANTONE+ books under "PANTONE" prefix; combined TOYO 94 and TOYO COLOR FINDER under "TOYO" prefix.

9. **Size slider steps**: Used discrete steps [3, 4, 5, 6, 8, 10] for grid columns rather than continuous slider for cleaner grid layouts.

10. **Pantone name formatting**: Used regex to extract PANTONE TCX codes (XX-XXXX format) and match against `_pantone-color-names.json`. Names are converted from kebab-case to Title Case.

11. **Light/dark text detection**: Used relative luminance formula (WCAG) with 0.179 threshold to determine whether header text should be light or dark based on selected color.

12. **Mobile responsiveness**: Hide size slider and favorites panel on mobile, show only standard selector. Grid defaults to 2 columns on mobile.

## About Page

13. **Static content**: Kept about page simple and static with no interactive elements beyond links, as specified.

## Technical Choices

14. **React components with client:load**: Used Astro's `client:load` directive for interactive components (PalettesView, ExplorerView) to enable full hydration on page load.

15. **localStorage for favorites**: Favorites persist across sessions using localStorage with JSON serialization.

16. **LAB to RGB conversion**: Implemented standard CIELAB to XYZ to sRGB conversion with D65 illuminant and gamma correction.

