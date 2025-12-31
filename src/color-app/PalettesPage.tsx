import { useEffect, useRef } from 'react';
import PaletteSection from './PaletteSection';
import { getContrastTextColor } from './colorUtils';

interface PaletteColor {
  name: string;
  hex: string;
  tag: string | null;
}

interface Palette {
  source: string;
  colors: PaletteColor[];
}

interface PalettesPageProps {
  palettes: Record<string, Palette>;
}

function getThemeColors(colors: PaletteColor[]) {
  const findByTag = (tag: string) => colors.find(c => c.tag === tag)?.hex || '#FFFFFF';
  return {
    background: findByTag('background'),
    secondary: findByTag('secondary'),
    text: findByTag('text'),
    highlight: findByTag('highlight'),
  };
}

export default function PalettesPage({ palettes }: PalettesPageProps) {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = document.getElementById('color-header');
    if (!header || !sectionsRef.current) return;

    const sections = sectionsRef.current.querySelectorAll('.palette-section');
    const paletteNames = Object.keys(palettes);
    
    // Get first palette colors for reset
    const firstPalette = palettes[paletteNames[0]];
    const firstTheme = firstPalette ? getThemeColors(firstPalette.colors) : null;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length === 0) return;

        // Get the topmost visible section
        const topEntry = visibleEntries.reduce((prev, curr) => 
          curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
        );

        const section = topEntry.target as HTMLElement;
        const highlight = section.dataset.highlight || '#1E66F5';
        const background = section.dataset.background || '#FFFFFF';

        header.style.backgroundColor = highlight;
        header.style.color = getContrastTextColor(highlight);
      },
      { threshold: 0.1, rootMargin: '-60px 0px 0px 0px' }
    );

    sections.forEach(section => observer.observe(section));

    // Handle scroll to top reset
    const handleScroll = () => {
      if (window.scrollY < 100 && firstTheme) {
        header.style.backgroundColor = firstTheme.highlight;
        header.style.color = getContrastTextColor(firstTheme.highlight);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [palettes]);

  return (
    <div ref={sectionsRef}>
      {Object.entries(palettes).map(([name, palette]) => (
        <PaletteSection
          key={name}
          name={name}
          source={palette.source}
          colors={palette.colors}
          themeColors={getThemeColors(palette.colors)}
        />
      ))}
      <div style={{ height: '50vh' }} />
    </div>
  );
}

