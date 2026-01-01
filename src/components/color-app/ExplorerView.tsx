import { Star } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import presetFavorites from '../../../public/color-books/_favorites.json';
import pantoneNames from '../../../public/color-books/_pantone-color-names.json';
import { getContrastColor, hexToRgbString, labToHex } from './colorUtils';

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

const SIZE_STEPS = [2, 4, 6, 8, 10];
const STORAGE_KEY = 'color-explorer-favorites';
const BOOK_STORAGE_KEY = 'color-explorer-selected-book';
const DEFAULT_BOOK = 'PANTONE F+H cotton TCX.json';

function extractColorCode(name: string): string | null {
  const match = name.match(/(\d{2}-\d{4})/);
  return match ? match[1] : null;
}

function getFriendlyName(colorName: string): string {
  const code = extractColorCode(colorName);
  if (!code) return '';
  const info = (pantoneNames as Record<string, { name: string; hex: string }>)[code];
  if (!info) return '';
  return info.name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
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
      <div className="color-swatch__color" style={{ backgroundColor: `#${color.hex}` }}>
        <div className={`color-swatch__copied ${showCopied ? 'color-swatch__copied--show' : ''}`}>Copied!</div>
        <button
          className={`color-swatch__star ${isFavorite || isHovered ? '' : ''} ${isFavorite ? 'color-swatch__star--active' : ''}`}
          onClick={handleStarClick}
          style={{
            opacity: isFavorite || isHovered ? 1 : 0,
            color: `#${textColor}`,
          }}
        >
          {isFavorite ? <Star size={16} weight="fill" /> : <Star size={16} />}
        </button>
      </div>
      <div className="color-swatch__info">
        <div className="color-swatch__name">{boldPrefix(color.name, color.prefix)}</div>
        <div className="color-swatch__hex code">#{color.hex.toUpperCase()}</div>
        <div className="color-swatch__friendly">{color.friendlyName}</div>
      </div>
    </div>
  );
}

export default function ExplorerView() {
  const [colorBooks, setColorBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [colors, setColors] = useState<ProcessedColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterActive, setFilterActive] = useState(false);
  const [gridSize, setGridSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(100);
  const [prefix, setPrefix] = useState('');

  // Load available color books from index
  useEffect(() => {
    const loadColorBookIndex = async () => {
      try {
        const response = await fetch('/color-books/_index.json');
        const books: string[] = await response.json();
        setColorBooks(books);

        // Restore previously selected book or use default
        const storedBook = localStorage.getItem(BOOK_STORAGE_KEY);
        if (storedBook && books.includes(storedBook)) {
          setSelectedBook(storedBook);
        } else {
          setSelectedBook(books.includes(DEFAULT_BOOK) ? DEFAULT_BOOK : books[0]);
        }
      } catch (e) {
        console.error('Failed to load color book index', e);
      }
    };

    loadColorBookIndex();
  }, []);

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

  // Save selected book to localStorage
  useEffect(() => {
    if (selectedBook) {
      localStorage.setItem(BOOK_STORAGE_KEY, selectedBook);
    }
  }, [selectedBook]);

  useEffect(() => {
    if (!selectedBook) return;

    const loadColorBook = async () => {
      setLoading(true);
      setVisibleCount(100);
      try {
        const response = await fetch(`/color-books/${selectedBook}`);
        const data: ColorBook = await response.json();
        setPrefix(data.prefix);

        const processed: ProcessedColor[] = Object.values(data.records).map(record => {
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
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      if (scrollTop + clientHeight >= scrollHeight - 500) {
        setVisibleCount(prev => Math.min(prev + 50, colors.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [colors.length]);

  const displayedColors = useMemo(() => {
    let filtered = colors;
    if (filterActive) {
      filtered = colors.filter(c => favorites.has(c.name));
    }
    return filtered.slice(0, visibleCount);
  }, [colors, filterActive, favorites, visibleCount]);

  const handleToggleFavorite = useCallback((name: string) => {
    setFavorites(prev => {
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
      }),
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
      }),
    );
  };

  const [exportCopied, setExportCopied] = useState(false);

  const handleExport = async () => {
    const favoritesArray = Array.from(favorites).map(name => ({
      name,
      notes: '',
    }));
    const exportData = {
      PANTONE: favoritesArray,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 1500);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const closest = SIZE_STEPS.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev));
    setGridSize(closest);
  };

  return (
    <main className="explorer-page">
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading colors...</div>
      ) : (
        <div
          className="explorer-grid"
          style={
            {
              '--grid-columns': gridSize,
            } as React.CSSProperties
          }
        >
          {displayedColors.map(color => (
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
        <div className="explorer-load-more">
          Showing {displayedColors.length} of {colors.length} colors. Scroll to load more.
        </div>
      )}

      {/* Floating bottom toolbar */}
      <div className="explorer-toolbar">
        <div className="explorer-toolbar__size">
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

        <select
          className="explorer-toolbar__select"
          value={selectedBook}
          onChange={e => setSelectedBook(e.target.value)}
        >
          {colorBooks.map(book => (
            <option key={book} value={book}>
              {book.replace('.json', '')}
            </option>
          ))}
        </select>

        <div className="explorer-toolbar__actions">
          <button className="explorer-toolbar__btn" onClick={handlePreset}>
            preset
          </button>
          <button
            className={`explorer-toolbar__btn ${filterActive ? 'explorer-toolbar__btn--active' : ''}`}
            onClick={() => setFilterActive(!filterActive)}
          >
            {filterActive ? (
              <>
                <strong>un</strong>filter
              </>
            ) : (
              'filter'
            )}
          </button>
          <button className="explorer-toolbar__btn" onClick={handleExport}>
            {exportCopied ? 'copied!' : 'export'}
          </button>
          <button className="explorer-toolbar__btn" onClick={handleClear}>
            clear
          </button>
        </div>
      </div>
    </main>
  );
}
