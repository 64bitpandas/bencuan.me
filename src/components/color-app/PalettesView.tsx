import { Copy, Check } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import palettesData from '../../color-books/_palettes.json';

interface PaletteColor {
  name: string;
  hex: string;
  tag?: 'background' | 'secondary' | 'text' | 'highlight';
}

interface Palette {
  source: string;
  colors: PaletteColor[];
}

type PalettesData = Record<string, Palette>;

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function getTaggedColors(colors: PaletteColor[]) {
  const tagged: Record<string, string> = {};
  colors.forEach((c) => {
    if (c.tag) tagged[c.tag] = c.hex;
  });
  return tagged;
}

function boldFirstWord(text: string) {
  const parts = text.split(' ');
  if (parts.length === 1) return <span>{text}</span>;
  return (
    <>
      <span>{parts[0]}</span> {parts.slice(1).join(' ')}
    </>
  );
}

function CopyButton({ text, color }: { text: string; color: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      className="color-table__copy-btn"
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{ color }}
    >
      {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
    </button>
  );
}

interface PaletteSectionProps {
  name: string;
  palette: Palette;
  onVisible: (colors: Record<string, string>) => void;
}

function PaletteSection({ name, palette, onVisible }: PaletteSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const tagged = getTaggedColors(palette.colors);
  const bg = tagged.background || 'ffffff';
  const secondary = tagged.secondary || 'eeeeee';
  const text = tagged.text || '000000';
  const highlight = tagged.highlight || '1e66f5';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          onVisible({ background: bg, secondary, text, highlight });
        }
      },
      { threshold: [0.3] }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [bg, secondary, text, highlight, onVisible]);

  return (
    <section
      ref={ref}
      className="palette-section"
      style={{
        backgroundColor: `#${bg}`,
        color: `#${text}`,
      }}
    >
      <div className="palette-section__header">
        <h2 className="palette-section__title">{boldFirstWord(name)}</h2>
        <a
          href={palette.source}
          target="_blank"
          rel="noopener noreferrer"
          className="palette-section__source"
          style={{ color: `#${highlight}` }}
        >
          source
        </a>
      </div>

      <table className="color-table">
        <thead>
          <tr>
            <th>Color</th>
            <th>Name</th>
            <th>Hex</th>
            <th>RGB</th>
          </tr>
        </thead>
        <tbody>
          {palette.colors.map((color) => (
            <tr
              key={color.name}
              className="color-table__row"
              style={
                {
                  '--hover-bg': `#${secondary}`,
                } as React.CSSProperties
              }
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = `#${secondary}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <td>
                <span
                  className="color-table__swatch"
                  style={{ backgroundColor: `#${color.hex}` }}
                />
              </td>
              <td>
                <div className="color-table__name">
                  {color.name}
                  {color.tag && (
                    <span
                      className="color-table__tag"
                      style={{
                        backgroundColor: `#${highlight}`,
                        color: `#${bg}`,
                      }}
                    >
                      {color.tag}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <span
                  className="color-table__code"
                  style={{ backgroundColor: `#${secondary}` }}
                >
                  #{color.hex.toUpperCase()}
                  <CopyButton text={`#${color.hex.toUpperCase()}`} color={`#${text}`} />
                </span>
              </td>
              <td>
                <span
                  className="color-table__code"
                  style={{ backgroundColor: `#${secondary}` }}
                >
                  {hexToRgb(color.hex)}
                  <CopyButton text={hexToRgb(color.hex)} color={`#${text}`} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function PalettesView() {
  const palettes = palettesData as PalettesData;
  const paletteNames = Object.keys(palettes);

  const handlePaletteVisible = (colors: Record<string, string>) => {
    window.dispatchEvent(
      new CustomEvent('color-header-update', {
        detail: {
          bg: `#${colors.highlight}`,
          text: `#${colors.background}`,
        },
      })
    );
  };

  useEffect(() => {
    const first = palettes[paletteNames[0]];
    const tagged = getTaggedColors(first.colors);
    handlePaletteVisible({
      background: tagged.background || 'ffffff',
      highlight: tagged.highlight || '1e66f5',
    });
  }, []);

  return (
    <main className="palettes-page">
      {paletteNames.map((name) => (
        <PaletteSection
          key={name}
          name={name}
          palette={palettes[name]}
          onVisible={handlePaletteVisible}
        />
      ))}
    </main>
  );
}
