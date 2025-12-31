# Decisions

- Header link styling: body links use Catppuccin blue and are underlined; header nav links inherit the header text color (so the dynamic header inversion stays readable) and use weight-animation only.
- Explorer rendering: groups are routed by `prefix` (e.g. `PANTONE`, `HKS`) and a group page renders all JSON books for that prefix as stacked sections, matching the spec even though some groups (notably PANTONE) are very large.
- Figma access: the environment couldn’t load Figma (WebGL blocked), so spacing and typography are implemented by best-effort matching the screenshots/spec.
