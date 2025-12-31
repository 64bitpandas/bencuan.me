import { Star } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { labToHex, getContrastColor, hexToRgbString } from './colorUtils';
import pantoneNames from '../../color-books/_pantone-color-names.json';
import presetFavorites from '../../color-books/_favorites.json';

interface ColorRecord {
  name: string;
  code: string;
  components: [number, number, number];
}

interface ColorBook {
  version: number;
  title: string;
  description: string;
  prefix: string;
  suffix: string;
  colorCount: number;
  pageSize: number;
  colorSpace: string;
  channels: number;
  isSpot: boolean;
  records: Record<string, ColorRecord>;
}

interface ProcessedColor {
  name: string;
  hex: string;
  friendlyName: string;
  prefix: string;
}

const COLOR_BOOKS: Record<string, string> = {
  'PANTONE F+H cotton TCX': 'PANTONE F+H cotton TCX.json',
  'PANTONE+ Solid Coated': 'PANTONE+ Solid Coated.json',
  'PANTONE+ Solid Uncoated': 'PANTONE+ Solid Uncoated.json',
  'HKS K': 'HKS K.json',
  'HKS N': 'HKS N.json',
  'DIC Color Guide': 'DIC Color Guide.json',
  'FOCOLTONE': 'FOCOLTONE.json',
  'TOYO COLOR FINDER': 'TOYO COLOR FINDER.json',
  'TRUMATCH': 'TRUMATCH.json',
};

const SIZE_STEPS = [4, 6, 8, 10, 12];
const STORAGE_KEY = 'color-explorer-favorites';

function extractColorCode(name: string): string | null {
  const match = name.match(/(\d{2}-\d{4})/);
  return match ? match[1] : null;
}

function getFriendlyName(colorName: string): string {
  const code = extractColorCode(colorName);
  if (!code) return '';
  const info = (pantoneNames as Record<string, { name: string; hex: string }>)[code];
  if (!info) return '';
  return info.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function boldPrefix(name: string, prefix: string): JSX.Element {
  const trimmedPrefix = prefix.trim();
  if (name.startsWith(trimmedPrefix)) {
    return (
      <>
        <span>{trimmedPrefix}</span>
        {name.slice(trimmedPrefix.length)}
      </>
    );
  }
  return <>{name}</>;
}

interface SwatchProps {
  color: ProcessedColor;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
  onSelect: (color: ProcessedColor) => void;
}

function Swatch({ color, isFavorite, onToggleFavorite, onSelect }: SwatchProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textColor = getContrastColor(color.hex);

  const handleClick = async () => {
    await navigator.clipboard.writeText(`#${color.hex.toUpperCase()}`);
    setShowCopied(true);
    onSelect(color);
    setTimeout(() => setShowCopied(false), 1000);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(color.name);
  };

  return (
    <div
      className={`color-swatch ${showCopied ? 'color-swatch--selected' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="color-swatch__color"
        style={{ backgroundColor: `#${color.hex}` }}
      >
        <div className={`color-swatch__copied ${showCopied ? 'color-swatch__copied--show' : ''}`}>
          Copied!
        </div>
        <button
          className={`color-swatch__star ${isFavorite || isHovered ? '' : ''} ${isFavorite ? 'color-swatch__star--active' : ''}`}
          onClick={handleStarClick}
          style={{
            opacity: isFavorite || isHovered ? 1 : 0,
            color: isFavorite ? '#fbbf24' : `#${textColor}`,
          }}
        >
          {isFavorite ? <Star size={16} weight="fill" /> : <Star size={16} />}
        </button>
      </div>
      <div className="color-swatch__info">
        <div className="color-swatch__name">
          {boldPrefix(color.name, color.prefix)}
        </div>
        <div className="color-swatch__friendly">{color.friendlyName}</div>
      </div>
    </div>
  );
}

export default function ExplorerView() {
  const [selectedBook, setSelectedBook] = useState('PANTONE F+H cotton TCX');
  const [colors, setColors] = useState<ProcessedColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterActive, setFilterActive] = useState(false);
  const [gridSize, setGridSize] = useState(8);
  const [visibleCount, setVisibleCount] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefix, setPrefix] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    const loadColorBook = async () => {
      setLoading(true);
      setVisibleCount(100);
      try {
        const response = await fetch(`/color-books/${COLOR_BOOKS[selectedBook]}`);
        const data: ColorBook = await response.json();
        setPrefix(data.prefix);

        const processed: ProcessedColor[] = Object.values(data.records).map((record) => {
          const [l, a, b] = record.components;
          const hex = labToHex(l, a, b);
          const friendlyName = getFriendlyName(record.name);
          return {
            name: record.name,
            hex,
            friendlyName,
            prefix: data.prefix,
          };
        });

        setColors(processed);
      } catch (e) {
        console.error('Failed to load color book', e);
        setColors([]);
      }
      setLoading(false);
    };

    loadColorBook();
  }, [selectedBook]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        setVisibleCount((prev) => Math.min(prev + 50, colors.length));
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [colors.length]);

  const displayedColors = useMemo(() => {
    let filtered = colors;
    if (filterActive) {
      filtered = colors.filter((c) => favorites.has(c.name));
    }
    return filtered.slice(0, visibleCount);
  }, [colors, filterActive, favorites, visibleCount]);

  const handleToggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const handleSelectColor = useCallback((color: ProcessedColor) => {
    const textColor = getContrastColor(color.hex);
    window.dispatchEvent(
      new CustomEvent('color-header-update', {
        detail: {
          bg: `#${color.hex}`,
          text: `#${textColor}`,
        },
      })
    );
  }, []);

  const handlePreset = () => {
    const prefixKey = prefix.trim() as keyof typeof presetFavorites;
    const presets = presetFavorites[prefixKey] || [];
    const names = presets.map((p: { name: string }) => p.name);
    setFavorites(new Set(names));
  };

  const handleClear = () => {
    setFavorites(new Set());
    window.dispatchEvent(
      new CustomEvent('color-header-update', {
        detail: { bg: '#1e66f5', text: '#ffffff' },
      })
    );
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const closest = SIZE_STEPS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    setGridSize(closest);
  };

  return (
    <main className="explorer-page" ref={containerRef} style={{ overflowY: 'auto' }}>
      <div className="explorer-controls">
        <select
          className="explorer-controls__select"
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
        >
          {Object.keys(COLOR_BOOKS).map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>

        <div className="explorer-controls__favorites">
          <button className="explorer-controls__btn" onClick={handlePreset}>
            preset
          </button>
          <button
            className={`explorer-controls__btn ${filterActive ? 'explorer-controls__btn--active' : ''}`}
            onClick={() => setFilterActive(!filterActive)}
          >
            {filterActive ? <><strong>un</strong>filter</> : 'filter'}
          </button>
          <button className="explorer-controls__btn" onClick={handleClear}>
            clear
          </button>
        </div>

        <div className="explorer-controls__size">
          <span>size</span>
          <input
            type="range"
            min={SIZE_STEPS[0]}
            max={SIZE_STEPS[SIZE_STEPS.length - 1]}
            value={gridSize}
            onChange={handleSizeChange}
            step={1}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading colors...</div>
      ) : (
        <div
          className="explorer-grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {displayedColors.map((color) => (
            <Swatch
              key={color.name}
              color={color}
              isFavorite={favorites.has(color.name)}
              onToggleFavorite={handleToggleFavorite}
              onSelect={handleSelectColor}
            />
          ))}
        </div>
      )}

      {!loading && displayedColors.length < colors.length && !filterActive && (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          Showing {displayedColors.length} of {colors.length} colors. Scroll to load more.
        </div>
      )}
    </main>
  );
}
