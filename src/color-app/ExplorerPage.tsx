import { Star } from '@phosphor-icons/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { labToHex, labToRgb, isLightColor, formatFriendlyName } from './colorUtils';

type ColorRecord = {
  name: string;
  code: string;
  components: [number, number, number];
};

type ColorBook = {
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
};

type FriendlyNames = Record<string, { name: string; hex: string }>;

type FavoritesPreset = Record<string, { name: string; notes?: string }[]>;

const COLOR_BOOKS: { id: string; name: string; file: string }[] = [
  { id: 'pantone-tcx', name: 'PANTONE F+H cotton TCX', file: 'PANTONE F+H cotton TCX.json' },
  { id: 'pantone-solid-coated', name: 'PANTONE+ Solid Coated', file: 'PANTONE+ Solid Coated.json' },
  { id: 'pantone-solid-uncoated', name: 'PANTONE+ Solid Uncoated', file: 'PANTONE+ Solid Uncoated.json' },
  { id: 'pantone-cmyk-coated', name: 'PANTONE+ CMYK Coated', file: 'PANTONE+ CMYK Coated.json' },
  { id: 'hks-k', name: 'HKS K', file: 'HKS K.json' },
  { id: 'hks-n', name: 'HKS N', file: 'HKS N.json' },
  { id: 'dic', name: 'DIC Color Guide', file: 'DIC Color Guide.json' },
  { id: 'toyo', name: 'TOYO COLOR FINDER', file: 'TOYO COLOR FINDER.json' },
  { id: 'focoltone', name: 'FOCOLTONE', file: 'FOCOLTONE.json' },
  { id: 'trumatch', name: 'TRUMATCH', file: 'TRUMATCH.json' },
];

const SWATCH_SIZES = [100, 120, 140, 160, 180, 200];
const ITEMS_PER_PAGE = 100;

function extractPantoneCode(name: string): string {
  const match = name.match(/(\d{2}-\d{4})/);
  return match ? match[1] : '';
}

function formatName(name: string): { prefix: string; rest: string } {
  const prefixes = ['PANTONE', 'HKS', 'DIC', 'TOYO', 'FOCOLTONE', 'TRUMATCH', 'ANPA'];
  for (const p of prefixes) {
    if (name.startsWith(p)) {
      return { prefix: p, rest: name.slice(p.length) };
    }
  }
  return { prefix: '', rest: name };
}

export default function ExplorerPage() {
  const [colorBook, setColorBook] = useState<ColorBook | null>(null);
  const [selectedBookId, setSelectedBookId] = useState('pantone-tcx');
  const [friendlyNames, setFriendlyNames] = useState<FriendlyNames>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesPreset, setFavoritesPreset] = useState<FavoritesPreset>({});
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [swatchSize, setSwatchSize] = useState(140);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('color-explorer-favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('color-explorer-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    const loadFriendlyNames = async () => {
      try {
        const res = await fetch('/color-books/_pantone-color-names.json');
        const data = await res.json();
        setFriendlyNames(data);
      } catch {
        console.error('Failed to load friendly names');
      }
    };

    const loadFavoritesPreset = async () => {
      try {
        const res = await fetch('/color-books/_favorites.json');
        const data = await res.json();
        setFavoritesPreset(data);
      } catch {
        console.error('Failed to load favorites preset');
      }
    };

    loadFriendlyNames();
    loadFavoritesPreset();
  }, []);

  useEffect(() => {
    const loadColorBook = async () => {
      const book = COLOR_BOOKS.find(b => b.id === selectedBookId);
      if (!book) return;

      try {
        const res = await fetch(`/color-books/${book.file}`);
        const data = await res.json();
        setColorBook(data);
        setPage(1);
      } catch {
        console.error('Failed to load color book');
      }
    };

    loadColorBook();
  }, [selectedBookId]);

  const colors = useMemo(() => {
    if (!colorBook) return [];

    return Object.values(colorBook.records).map(record => {
      const [L, a, b] = record.components;
      const hex = labToHex(L, a, b);
      const [r, g, bVal] = labToRgb(L, a, b);
      const rgb = `${r}, ${g}, ${bVal}`;
      const pantoneCode = extractPantoneCode(record.name);
      const friendly = friendlyNames[pantoneCode];

      return {
        ...record,
        hex,
        rgb,
        pantoneCode,
        friendlyName: friendly ? formatFriendlyName(friendly.name) : '',
      };
    });
  }, [colorBook, friendlyNames]);

  const filteredColors = useMemo(() => {
    if (!filterFavorites) return colors;
    return colors.filter(c => favorites.has(c.name));
  }, [colors, favorites, filterFavorites]);

  const totalPages = Math.ceil(filteredColors.length / ITEMS_PER_PAGE);
  const paginatedColors = filteredColors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleFavorite = useCallback((name: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const loadPreset = () => {
    if (!colorBook) return;
    const prefix = colorBook.prefix.trim();
    const presetColors = favoritesPreset[prefix] || [];
    const names = new Set(presetColors.map(c => c.name));
    setFavorites(names);
  };

  const clearFavorites = () => {
    setFavorites(new Set());
    setFilterFavorites(false);
    resetHeader();
  };

  const resetHeader = () => {
    const header = document.getElementById('color-header');
    if (header) {
      header.style.backgroundColor = '#1E66F5';
      header.style.color = '#ffffff';
    }
  };

  const copyColor = async (hex: string, name: string) => {
    await navigator.clipboard.writeText(`#${hex}`);
    setCopiedId(name);

    const header = document.getElementById('color-header');
    if (header) {
      header.style.backgroundColor = `#${hex}`;
      header.style.color = isLightColor(hex) ? '#000000' : '#ffffff';
    }

    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="explorer-page">
      <div className="explorer-controls">
        <select
          value={selectedBookId}
          onChange={e => setSelectedBookId(e.target.value)}
        >
          {COLOR_BOOKS.map(book => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>

        <div className="explorer-panel">
          <span>Favorites ({favorites.size})</span>
          <button onClick={loadPreset}>preset</button>
          <button onClick={() => setFilterFavorites(!filterFavorites)}>
            {filterFavorites ? <><span className="bold">un</span>filter</> : 'filter'}
          </button>
          <button onClick={clearFavorites}>clear</button>
        </div>

        <div className="size-control">
          <label>Size</label>
          <input
            type="range"
            min={0}
            max={SWATCH_SIZES.length - 1}
            step={1}
            value={SWATCH_SIZES.indexOf(swatchSize)}
            onChange={e => setSwatchSize(SWATCH_SIZES[parseInt(e.target.value)])}
          />
        </div>
      </div>

      <div className="color-grid" style={{ '--swatch-size': `${swatchSize}px` } as React.CSSProperties}>
        {paginatedColors.map(color => {
          const { prefix, rest } = formatName(color.name);
          const isCopied = copiedId === color.name;
          const isFavorite = favorites.has(color.name);
          const textColor = isLightColor(color.hex) ? '#000000' : '#ffffff';

          return (
            <div
              key={color.name}
              className={`color-swatch-card ${isCopied ? 'copied swatch-click-animation' : ''}`}
              onClick={() => copyColor(color.hex, color.name)}
            >
              <div
                className="swatch-color"
                style={{
                  backgroundColor: `#${color.hex}`,
                  filter: isCopied ? 'brightness(0.8)' : undefined,
                }}
              >
                {isCopied && (
                  <div className="copied-overlay" style={{ color: textColor, opacity: 1 }}>
                    Copied!
                  </div>
                )}
              </div>
              <button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={e => toggleFavorite(color.name, e)}
              >
                {isFavorite ? <Star size={16} weight="fill" /> : <Star size={16} />}
              </button>
              <div className="swatch-info">
                <div className="swatch-name">
                  {prefix && <span className="bold">{prefix}</span>}
                  {rest}
                </div>
                <div className="swatch-friendly-name">{color.friendlyName}</div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(1)} disabled={page === 1}>
            First
          </button>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Next
          </button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
            Last
          </button>
        </div>
      )}
    </div>
  );
}
