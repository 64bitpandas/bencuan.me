# Color App Decisions

- Explorer routing: each color-book JSON file is its own route under `/colors/explorer/<slug>` so the “standard selector” can navigate between books.
- Explorer “prefix” bolding: the bolded prefix is the first token in the swatch name (e.g. `PANTONE`, `HKS`).
- Header light/dark inference in Explorer: uses WCAG relative luminance with threshold `0.55` (>= 0.55 => dark text, else light text).
