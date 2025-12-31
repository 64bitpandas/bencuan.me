import { useState, useEffect, useMemo, useCallback } from 'react';
import { labToHex, hexToRgb, getContrastTextColor, formatRgb } from './colorUtils';

interface ColorRecord {
  name: string;
  code: string;
  components: [number, number, number];
}

interface ColorBook {
  title: string;
  prefix: string;
  suffix: string;
  colorSpace: string;
  records: Record<string, ColorRecord>;
}

interface FavoritePreset {
  name: string;
  notes?: string;
}

interface ExplorerPageProps {
  colorBooks: Record<string, ColorBook>;
  pantoneNames: Record<string, { name: string; hex: string }>;
  favoritePresets: Record<string, FavoritePreset[]>;
}

const SWATCH_SIZES = [60, 80, 100, 120, 140];

export default function ExplorerPage({ colorBooks, pantoneNames, favoritePresets }: ExplorerPageProps) {
  const bookNames = Object.keys(colorBooks);
  const [selectedBook, setSelectedBook] = useState(bookNames.find(b => b.includes('Solid Coated')) || bookNames[0]);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colorFavorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [swatchSize, setSwatchSize] = useState(100);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const book = colorBooks[selectedBook];
  const records = book?.records || {};

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('colorFavorites', JSON.stringify([...favorites]));
    }
  }, [favorites]);

  const colors = useMemo(() => {
    return Object.entries(records).map(([key, record]) => {
      const [L, a, b] = record.components;
      const hex = labToHex(L, a, b);
      const codeMatch = record.name.match(/(\d{2}-\d{4})/);
      const pantoneCode = codeMatch ? codeMatch[1] : null;
      const friendlyName = pantoneCode ? pantoneNames[pantoneCode]?.name : null;
      return { key, ...record, hex, friendlyName };
    });
  }, [records, pantoneNames]);

  const filteredColors = useMemo(() => {
    if (!showOnlyFavorites) return colors;
    return colors.filter(c => favorites.has(c.key));
  }, [colors, favorites, showOnlyFavorites]);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const copyColor = async (hex: string, name: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedColor(name);
    const header = document.getElementById('color-header');
    if (header) {
      header.style.backgroundColor = hex;
      header.style.color = getContrastTextColor(hex);
    }
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const loadPresets = () => {
    const presets = favoritePresets['PANTONE'] || [];
    const newFavs = new Set<string>();
    presets.forEach(p => {
      const found = colors.find(c => c.name === p.name);
      if (found) newFavs.add(found.key);
    });
    setFavorites(newFavs);
  };

  const clearFavorites = () => {
    setFavorites(new Set());
    const header = document.getElementById('color-header');
    if (header) {
      header.style.backgroundColor = '#1E66F5';
      header.style.color = '#FFFFFF';
    }
  };

  return (
    <div className="explorer-page">
      <h1><strong>PANTONE</strong> SOLID COATED</h1>
      <div className="explorer-controls">
        <div className="control-group">
          <label>size</label>
          <input 
            type="range" 
            min={0} 
            max={SWATCH_SIZES.length - 1} 
            value={SWATCH_SIZES.indexOf(swatchSize)}
            onChange={(e) => setSwatchSize(SWATCH_SIZES[parseInt(e.target.value)])}
          />
        </div>
        <div className="control-group">
          <label>standard</label>
          <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
            {bookNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="favorites-controls">
          <button onClick={loadPresets}>preset</button>
          <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}>
            {showOnlyFavorites ? <><strong>un</strong>filter</> : 'filter'}
          </button>
          <button onClick={clearFavorites}>clear</button>
        </div>
      </div>
      <div className="swatch-grid" style={{ '--swatch-size': `${swatchSize}px` } as React.CSSProperties}>
        {filteredColors.slice(0, 200).map((color) => (
          <div 
            key={color.key}
            className={`swatch ${copiedColor === color.name ? 'copied' : ''} ${favorites.has(color.key) ? 'favorited' : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => copyColor(color.hex, color.name)}
          >
            <button 
              className="star-btn"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(color.key); }}
            >
              {favorites.has(color.key) ? '★' : '☆'}
            </button>
            {copiedColor === color.name && <span className="copied-label">Copied!</span>}
            <div className="swatch-info" style={{ color: getContrastTextColor(color.hex) }}>
              <div className="swatch-code">{color.name.replace('PANTONE ', '')}</div>
              {color.friendlyName && <div className="swatch-name">{color.friendlyName}</div>}
              <div className="swatch-hex mono">{color.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

