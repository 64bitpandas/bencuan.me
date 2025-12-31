# Improved Prompt for Color Website Project

```xml
<role>
You are an expert Astro web developer with strong skills in SCSS, responsive design, and creating polished, production-ready websites. You have experience integrating with Figma designs and following design systems like Catppuccin.
</role>

<context>
I'm building a color palette showcase website at bencuan.me/colors. The design is available in Figma (project "color") accessible via the Figma MCP integration. Use the Astro docs MCP server for framework guidance.
</context>

<objective>
Create three pages (palettes, explorer, about) with a shared design system, following the Figma designs while maintaining clean, maintainable code.
</objective>

<design_system>
  <colors>
    <primary>Catppuccin Latte blue: #1E66F5</primary>
    <footer_accent>#297638</footer_accent>
    <footer_background>#F7F6F2</footer_background>
  </colors>
  
  <typography>
    <sans_serif>Manrope (primary font for most elements)</sans_serif>
    <monospace>Fira Code (for code snippets and hex values)</monospace>
  </typography>
  
  <link_styles>
    - Color: #1E66F5 (Catppuccin Latte blue)
    - Bold and underlined
  </link_styles>
  
  <header_behavior>
    - Default background: #1E66F5
    - Current page link: bold
    - Hover on non-current links: animate to bold (use variable font weight transition)
  </header_behavior>
  
  <footer>
    - Background: #F7F6F2
    - Top border: 1px solid #297638
    - Centered link: "back to bencuan.me" → https://bencuan.me
    - Link color: #297638
    - Kevin the Dinosaur icon (favicon.png) displayed left of link
    - Reference: Figma "About" page node-id=4-207
  </footer>
</design_system>

<code_requirements>
  <structure>
    - Create `src/color-app/` subfolder for all new components
    - Single stylesheet: `color_app.scss` (standalone, only inherits fonts/mixins/spacing)
    - New fonts defined in `_fonts.scss`
    - Minimal coupling with existing codebase
  </structure>
  
  <style>
    - Minimal comments (code should be self-documenting)
    - Follow Astro idioms and best practices
    - Use Astro docs MCP for guidance
  </style>
  
  <figma_interpretation>
    - Text content: use exactly as shown
    - Spacing/font sizes: treat as suggestions, prioritize code simplicity
    - Document any significant deviations in DECISIONS.md
  </figma_interpretation>
  
  <responsive>
    - Primary: desktop optimization
    - Secondary: basic mobile support to prevent broken layouts
  </responsive>
</code_requirements>

<tasks>
  <task order="1" name="Palettes Page">
    <figma_reference>node-id=1-2</figma_reference>
    
    <data_source>
      File: `color-books/_palettes.json`
      
      Populate with three palettes in this order:
      1. Catppuccin Latte (source: https://catppuccin.com/palette/)
      2. bencuan.me v7 (source: https://bencuan.me/colophon/)
      3. Dracula (source: https://draculatheme.com/, reference: https://en.wikipedia.org/wiki/Dracula_(color_scheme))
    </data_source>
    
    <color_tags>
      Each palette must have exactly one color assigned to each tag:
      - "background"
      - "secondary" 
      - "text"
      - "highlight"
      Use your judgment to assign appropriate colors to each tag.
    </color_tags>
    
    <scroll_behavior>
      When user scrolls to a palette section:
      - Header background → palette's highlight color
      - Header text → palette's background color (inverted for contrast)
      - First palette colors should reappear when scrolled to top
      - Last palette section must be tall enough to trigger header change
    </scroll_behavior>
    
    <palette_section_styling>
      Each palette section uses its own colors:
      - Background: palette's "background" color
      - Text: palette's "text" color
      - Tag pill background: palette's "highlight" color
      - Hex/RGB code background: palette's "secondary" color
      - Row hover: change to "secondary" color
      - Section backgrounds: 100% viewport width
    </palette_section_styling>
    
    <copy_functionality>
      - Phosphor "copy" icon next to hex AND RGB values
      - On click: copy to clipboard, icon changes to checkmark temporarily
    </copy_functionality>
    
    <formatting>
      - Bold first word of each theme name in title
      - Source link aligned with end of color table
    </formatting>
  </task>

  <task order="2" name="Explorer Page">
    <figma_reference>node-id=2-33</figma_reference>
    
    <data_sources>
      - Color books: `src/color-books/*.json` (CIELAB format)
      - Friendly names: `_pantone-color-names.json`
      - Favorites preset: `_favorites.json` (contains color names per standard prefix, "notes" field is human-readable only)
    </data_sources>
    
    <color_conversion>
      Create helper function to convert CIELAB → hex and RGB
    </color_conversion>
    
    <default_selection>
      Pantone TCX book (matches friendly names in pantone-color-names.json)
    </default_selection>
    
    <swatch_display>
      - First line: full color name with prefix bolded (e.g., "**PANTONE** 13-5305 TCX")
      - Second line: friendly name if available (e.g., "Pale Aqua"), blank otherwise
      - Format friendly name (e.g., "PANTONE 13-5305 TCX" → "Pale Aqua")
    </swatch_display>
    
    <header_title>
      Bold the prefix (PANTONE, HKS, etc.) in the main header
    </header_title>
    
    <pagination>
      - Separate each color book into pages
      - "standard" selector navigates between pages
    </pagination>
    
    <performance>
      Lazy-load swatches (color books can have thousands of entries)
    </performance>
    
    <swatch_interactions>
      <on_click>
        - Animate: border-radius rounds then unrounds
        - Darken the color square
        - Display "Copied!" overlay on square
        - Copy hex code to clipboard
        - Update header to swatch color
        - Header text: auto-detect light/dark based on color luminance
      </on_click>
      
      <on_hover>
        - Scale up slightly
        - Show Phosphor star outline icon (top right)
      </on_hover>
      
      <on_star_click>
        Add/remove from favorites (persisted to localStorage)
      </on_star_click>
    </swatch_interactions>
    
    <favorites_panel>
      <preset_button>
        Load favorites from `_favorites.json`, overwriting current selection
      </preset_button>
      
      <filter_button>
        - When active: show only favorited colors
        - Button text changes to "**un**filter" (bold "un")
      </filter_button>
      
      <clear_button>
        Clear all favorites and reset header colors to default
      </clear_button>
    </favorites_panel>
    
    <size_slider>
      - Ratcheting/stepped slider
      - Controls number of swatches displayed in grid
    </size_slider>
    
    <mobile_responsive>
      Hide favorites panel and size popup; show only standard selector
    </mobile_responsive>
  </task>

  <task order="3" name="About Page">
    <figma_reference>node-id=4-207</figma_reference>
    
    <content>
      Static page with no interactions except links.
      
      Use this exact text (with formatting applied):
      
      ---
      I made this page to keep track of all the color palettes I've created or have enjoyed using. I've found myself flipping through hundreds of tabs for color matching inspiration; I hope that this site can help me (and maybe you) reduce the clutter a bit!
      
      This page was generated with Claude for my State of Vibe Coding evaluation in December 2025. If you're reading this, you're looking at the winning submission! Congrats to Claude :)
      
      The Explorer was seeded with color books from this repository. View the source code here if you'd like to access these colors in JSON format.
      
      This page is typeset in **Manrope** and **fira code**. Its default accent color is Catppuccin blue.
      ---
    </content>
    
    <links>
      - "this repository" → https://github.com/jacobbubu/acb
      - "here" → https://github.com/64bitpandas/bencuan.me/tree/main/src/color-books
      - "Catppuccin blue" → https://catppuccin.com/
      - "State of Vibe Coding evaluation" → https://bencuan.me/blog/vibe25
    </links>
    
    <typography_showcase>
      - "Manrope": bold, rendered in Manrope font
      - "fira code": bold, rendered in Fira Code font
    </typography_showcase>
  </task>
</tasks>

<success_criteria>
  <functionality>
    - [ ] All three pages render correctly and match Figma designs
    - [ ] Header dynamically updates colors based on scroll/selection
    - [ ] Copy-to-clipboard works with visual feedback
    - [ ] Favorites persist across page refreshes (localStorage)
    - [ ] Color book pagination and lazy loading work smoothly
    - [ ] All specified links are functional
  </functionality>
  
  <code_quality>
    - [ ] All styles contained in single `color_app.scss`
    - [ ] Components isolated in `src/color-app/` folder
    - [ ] Follows Astro best practices
    - [ ] Minimal comments, self-documenting code
    - [ ] DECISIONS.md documents any design deviations
  </code_quality>
  
  <responsive>
    - [ ] Desktop: full functionality as designed
    - [ ] Mobile: readable, not broken (explorer panel hidden)
  </responsive>
</success_criteria>

<output_format>
For each task, provide:
1. Created/modified file paths
2. Key implementation decisions (add to DECISIONS.md)
3. Any clarifying questions before proceeding
</output_format>
```

