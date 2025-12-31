# Decisions Log

## Architecture
- **Monolithic SCSS**: Chose to use a single `color_app.scss` file as requested, overriding typical modular component styles. This simplifies style management for this specific sub-app but requires careful scoping to avoid bleeding into the main site (though main site styles are scoped or imported explicitly).
- **Client-Side Data Fetching**: For the Explorer page, decided to implementing a dynamic API endpoint (`/colors/api/book/...`) to serving JSON data. This prevents building thousands of static nodes at build time, which would significantly slow down the build and inflate the final HTML size. The client fetches only necessary book data on demand.
- **Color Conversion**: Implemented D50 to D65 adaptation in the Lab->RGB conversion pipeline to ensure industry-standard color representation for Pantone books.

## UI/UX
- **Favorites Persistence**: Used `localStorage` for favorites to persist user preferences across sessions without needing a backend database.
- **Performance**: Implemented a chunk-based rendering strategy with an Intersection Observer (infinite scroll) for the Explorer grid to maintain high frame rates even with thousands of color swatches.
