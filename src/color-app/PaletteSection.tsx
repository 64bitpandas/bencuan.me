import { useState } from 'react';
import { hexToRgb, formatRgb, getContrastTextColor } from './colorUtils';

interface PaletteColor {
  name: string;
  hex: string;
  tag: string | null;
}

interface PaletteSectionProps {
  name: string;
  source: string;
  colors: PaletteColor[];
  themeColors: { background: string; secondary: string; text: string; highlight: string };
}

export default function PaletteSection({ name, source, colors, themeColors }: PaletteSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedType, setCopiedType] = useState<'hex' | 'rgb' | null>(null);

  const copyToClipboard = async (text: string, index: number, type: 'hex' | 'rgb') => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedIndex(null);
      setCopiedType(null);
    }, 1500);
  };

  const nameParts = name.split(' ');
  const firstWord = nameParts[0];
  const restOfName = nameParts.slice(1).join(' ');

  const sectionStyle = {
    backgroundColor: themeColors.background,
    color: themeColors.text,
    '--hover-bg': themeColors.secondary,
  } as React.CSSProperties;

  return (
    <section 
      className="palette-section" 
      style={sectionStyle}
      data-highlight={themeColors.highlight}
      data-background={themeColors.background}
    >
      <div className="palette-header">
        <h2>
          <span>{firstWord}</span>
          {restOfName && <span> {restOfName}</span>}
        </h2>
        <a href={source} target="_blank" rel="noopener noreferrer" className="source-link">
          source
        </a>
      </div>
      <div className="color-table">
        {colors.map((color, index) => {
          const rgb = hexToRgb(color.hex);
          const rgbStr = formatRgb(rgb);
          return (
            <div className="color-row" key={index}>
              <div className="color-dot" style={{ backgroundColor: color.hex }} />
              <span className="color-name">{color.name}</span>
              {color.tag && (
                <span 
                  className="color-tag" 
                  style={{ 
                    backgroundColor: themeColors.highlight,
                    color: getContrastTextColor(themeColors.highlight)
                  }}
                >
                  {color.tag}
                </span>
              )}
              {!color.tag && <span />}
              <span className="color-hex mono">{color.hex}</span>
              <span className="color-rgb mono">{rgbStr}</span>
              <button 
                className="copy-btn" 
                onClick={() => copyToClipboard(color.hex, index, 'hex')}
                title="Copy hex"
              >
                {copiedIndex === index && copiedType === 'hex' ? '✓' : '⧉'}
              </button>
              <button 
                className="copy-btn" 
                onClick={() => copyToClipboard(rgbStr, index, 'rgb')}
                title="Copy RGB"
              >
                {copiedIndex === index && copiedType === 'rgb' ? '✓' : '⧉'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

