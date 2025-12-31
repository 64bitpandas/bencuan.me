import { Copy, Check } from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';
import palettesData from '../color-books/_palettes.json';

type PaletteColor = {
  name: string;
  hex: string;
  tag?: 'background' | 'secondary' | 'text' | 'highlight';
};

type Palette = {
  name: string;
  source: string;
  colors: PaletteColor[];
};

function getTaggedColor(colors: PaletteColor[], tag: string): string {
  const color = colors.find(c => c.tag === tag);
  return color ? `#${color.hex}` : '#000000';
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function formatTitle(name: string): { bold: string; rest: string } {
  const parts = name.split(' ');
  return { bold: parts[0], rest: parts.slice(1).join(' ') };
}

export default function PalettesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activePalette, setActivePalette] = useState<number>(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const palettes = palettesData.palettes as Palette[];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) {
              setActivePalette(index);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const header = document.getElementById('color-header');
    if (header && palettes[activePalette]) {
      const palette = palettes[activePalette];
      const highlight = getTaggedColor(palette.colors, 'highlight');
      const background = getTaggedColor(palette.colors, 'background');
      header.style.backgroundColor = highlight;
      header.style.color = background;
    }
  }, [activePalette, palettes]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="palettes-page">
      {palettes.map((palette, paletteIndex) => {
        const title = formatTitle(palette.name);
        const bgColor = getTaggedColor(palette.colors, 'background');
        const textColor = getTaggedColor(palette.colors, 'text');
        const secondaryColor = getTaggedColor(palette.colors, 'secondary');
        const highlightColor = getTaggedColor(palette.colors, 'highlight');

        return (
          <section
            key={palette.name}
            ref={el => { sectionRefs.current[paletteIndex] = el; }}
            className="palette-section"
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            <div className="palette-content">
              <h2 className="palette-title">
                <span className="bold">{title.bold}</span> {title.rest}
              </h2>

              <table className="palette-table">
                <thead>
                  <tr>
                    <th>Color</th>
                    <th>Name</th>
                    <th>Hex</th>
                    <th>RGB</th>
                  </tr>
                </thead>
                <tbody>
                  {palette.colors.map((color, colorIndex) => {
                    const hexId = `${paletteIndex}-${colorIndex}-hex`;
                    const rgbId = `${paletteIndex}-${colorIndex}-rgb`;
                    const hexValue = `#${color.hex.toUpperCase()}`;
                    const rgbValue = hexToRgb(color.hex);

                    return (
                      <tr
                        key={color.name}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = secondaryColor;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        <td>
                          <div
                            className="color-swatch"
                            style={{ backgroundColor: `#${color.hex}` }}
                          />
                        </td>
                        <td>
                          <div className="color-name">
                            {color.name}
                            {color.tag && (
                              <span
                                className="color-tag"
                                style={{ backgroundColor: highlightColor, color: bgColor }}
                              >
                                {color.tag}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="color-code">
                            <span className="code-value" style={{ backgroundColor: secondaryColor }}>
                              {hexValue}
                            </span>
                            <button
                              className="copy-btn"
                              onClick={() => copyToClipboard(hexValue, hexId)}
                              title="Copy hex"
                            >
                              {copiedId === hexId ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="color-code">
                            <span className="code-value" style={{ backgroundColor: secondaryColor }}>
                              {rgbValue}
                            </span>
                            <button
                              className="copy-btn"
                              onClick={() => copyToClipboard(rgbValue, rgbId)}
                              title="Copy RGB"
                            >
                              {copiedId === rgbId ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="palette-source">
                <a href={palette.source} target="_blank" rel="noopener noreferrer">
                  Source
                </a>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

