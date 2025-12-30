import { Copy, Check } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

interface PaletteColor {
  name: string;
  hex: string;
  tag?: 'background' | 'secondary' | 'text' | 'highlight';
}

interface Palette {
  name: string;
  source: string;
  colors: PaletteColor[];
}

interface PalettesData {
  palettes: Palette[];
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function boldFirstWord(name: string): React.ReactNode {
  const words = name.split(' ');
  if (words.length === 1) return <strong>{name}</strong>;
  return (
    <>
      <strong>{words[0]}</strong> {words.slice(1).join(' ')}
    </>
  );
}

function getPaletteColors(palette: Palette) {
  const bg = palette.colors.find(c => c.tag === 'background')?.hex || 'eff1f5';
  const text = palette.colors.find(c => c.tag === 'text')?.hex || '4c4f69';
  const secondary = palette.colors.find(c => c.tag === 'secondary')?.hex || 'ccd0da';
  const highlight = palette.colors.find(c => c.tag === 'highlight')?.hex || '8839ef';
  return { bg, text, secondary, highlight };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
      {copied ? <Check weight="bold" /> : <Copy weight="regular" />}
    </button>
  );
}

function PaletteSection({ palette, isLast }: { palette: Palette; isLast: boolean }) {
  const { bg, text, secondary, highlight } = getPaletteColors(palette);

  const style = {
    '--color-palette-bg': `#${bg}`,
    '--color-palette-text': `#${text}`,
    '--color-palette-secondary': `#${secondary}`,
    '--color-palette-highlight': `#${highlight}`,
  } as React.CSSProperties;

  return (
    <section
      className="palette-section"
      style={style}
      data-bg={bg}
      data-text={text}
      data-highlight={highlight}
    >
      <div className="palette-header">
        <h2>{boldFirstWord(palette.name)}</h2>
        <a href={palette.source} className="source-link" target="_blank" rel="noopener noreferrer">
          source
        </a>
      </div>
      <table className="palette-table">
        <thead>
          <tr>
            <th></th>
            <th>name</th>
            <th>hex</th>
            <th>rgb</th>
          </tr>
        </thead>
        <tbody>
          {palette.colors.map(color => (
            <tr key={color.name}>
              <td>
                <span className="color-preview" style={{ backgroundColor: `#${color.hex}` }} />
              </td>
              <td>
                <div className="color-name">
                  {color.name}
                  {color.tag && <span className="tag">{color.tag}</span>}
                </div>
              </td>
              <td>
                <div className="code-cell">
                  <code>#{color.hex.toUpperCase()}</code>
                  <CopyButton text={`#${color.hex.toUpperCase()}`} />
                </div>
              </td>
              <td>
                <div className="code-cell">
                  <code>{hexToRgb(color.hex)}</code>
                  <CopyButton text={hexToRgb(color.hex)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLast && <div className="palette-spacer" />}
    </section>
  );
}

export default function PalettesView({ data }: { data: PalettesData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const section = entry.target as HTMLElement;
            const highlight = section.dataset.highlight;
            const bg = section.dataset.bg;
            const header = document.getElementById('color-header');
            if (header && highlight && bg) {
              header.style.setProperty('--color-header-bg', `#${highlight}`);
              header.style.setProperty('--color-header-text', `#${bg}`);
            }
          }
        });
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    const sections = containerRef.current?.querySelectorAll('.palette-section');
    sections?.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="palettes-page" ref={containerRef}>
      {data.palettes.map((palette, i) => (
        <PaletteSection
          key={palette.name}
          palette={palette}
          isLast={i === data.palettes.length - 1}
        />
      ))}
    </div>
  );
}

