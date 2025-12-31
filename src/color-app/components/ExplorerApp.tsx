import React from 'react';
import { Star } from '@phosphor-icons/react';
import pantoneNames from '../../color-books/_pantone-color-names.json';
import favoritesPreset from '../../color-books/_favorites.json';
import { labToRgb, relativeLuminance, rgbToHex, titleCaseFromSlug } from '../utils/color';
import { useInView } from 'react-intersection-observer';

type RecordValue = {
  name: string;
  code: string;
  components: [number, number, number];
};

type Props = {
  bookSlug: string;
  bookLabel: string;
  bookPrefix: string;
  records: Record<string, RecordValue>;
};

type FavoriteStore = {
  [bookSlug: string]: string[];
};

function splitPrefix(name: string): { prefix: string; rest: string } {
  const trimmed = name.trim();
  const idx = trimmed.indexOf(' ');
  if (idx === -1) return { prefix: trimmed, rest: '' };
  return { prefix: trimmed.slice(0, idx), rest: trimmed.slice(idx) };
}

function getPantoneFriendlyName(fullName: string): string {
  const match = fullName.match(/\b(\d{2}-\d{4})\b/);
  if (!match) return '';
  const key = match[1];
  const rec = (pantoneNames as any)[key];
  if (!rec?.name) return '';
  return titleCaseFromSlug(rec.name);
}

function loadFavorites(): FavoriteStore {
  try {
    const raw = localStorage.getItem('colorapp:favorites');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveFavorites(store: FavoriteStore) {
  try {
    localStorage.setItem('colorapp:favorites', JSON.stringify(store));
  } catch {
    // ignore
  }
}

const SIZE_STEPS = [80, 100, 120, 150, 180] as const;

export default function ExplorerApp({ bookSlug, bookLabel, bookPrefix, records }: Props) {
  const entries = React.useMemo(() => Object.values(records), [records]);

  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [filterOnlyFavs, setFilterOnlyFavs] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(220);
  const [sizeIndex, setSizeIndex] = React.useState(2);

  React.useEffect(() => {
    const store = loadFavorites();
    setFavorites(store[bookSlug] ?? []);
  }, [bookSlug]);

  React.useEffect(() => {
    const store = loadFavorites();
    store[bookSlug] = favorites;
    saveFavorites(store);
  }, [bookSlug, favorites]);

  const visibleEntries = React.useMemo(() => {
    const list = filterOnlyFavs ? entries.filter(e => favorites.includes(e.name)) : entries;
    return list.slice(0, visibleCount);
  }, [entries, favorites, filterOnlyFavs, visibleCount]);

  const { ref: loadMoreRef, inView } = useInView({ rootMargin: '800px 0px' });

  React.useEffect(() => {
    if (!inView) return;
    setVisibleCount(v => v + 260);
  }, [inView]);

  React.useEffect(() => {
    const min = SIZE_STEPS[Math.max(0, Math.min(SIZE_STEPS.length - 1, sizeIndex))];
    document.documentElement.style.setProperty('--swatch-min', `${min}px`);
  }, [sizeIndex]);

  const onSelect = async (name: string, hex: string) => {
    setSelectedName(name);
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // ignore
    }

    const rgb = {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };

    const lum = relativeLuminance(rgb);
    const fg = lum >= 0.55 ? '#111111' : '#FFFFFF';
    window.dispatchEvent(new CustomEvent('colorapp:header', { detail: { bg: hex, fg } }));

    window.setTimeout(() => {
      setSelectedName(cur => (cur === name ? null : cur));
    }, 700);
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prev => (prev.includes(name) ? prev.filter(n => n !== name) : prev.concat(name)));
  };

  const applyPreset = () => {
    const key = bookPrefix.split(' ')[0].trim();
    const preset = (favoritesPreset as any)[key] as Array<{ name: string }> | undefined;
    if (!preset) return;
    setFavorites(preset.map(p => p.name));
  };

  const clear = () => {
    setFavorites([]);
    setFilterOnlyFavs(false);
    window.dispatchEvent(new CustomEvent('colorapp:header-reset'));
  };

  return (
    <div>
      <div className="explorer-panels">
        <div className="explorer-panel">
          <h3>Grid</h3>
          <div className="explorer-buttons">
            <label className="explorer-btn explorer-mobile-hidden" style={{ padding: '8px 12px' }}>
              size
              <input
                style={{ marginLeft: 10 }}
                type="range"
                min={0}
                max={SIZE_STEPS.length - 1}
                step={1}
                value={sizeIndex}
                onChange={e => setSizeIndex(parseInt(e.target.value, 10))}
              />
            </label>
          </div>
        </div>

        <div className="explorer-panel explorer-mobile-hidden">
          <h3>Favorites</h3>
          <div className="explorer-buttons">
            <button className="explorer-btn" type="button" onClick={applyPreset}>
              preset
            </button>
            <button
              className="explorer-btn"
              type="button"
              onClick={() => {
                setFilterOnlyFavs(v => !v);
                setVisibleCount(500);
              }}
            >
              {filterOnlyFavs ? (
                <>
                  <strong>un</strong>filter
                </>
              ) : (
                'filter'
              )}
            </button>
            <button className="explorer-btn" type="button" onClick={clear}>
              clear
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }} className="swatch-grid">
        {visibleEntries.map(entry => {
          const [l, a, b] = entry.components;
          const rgb = labToRgb(l, a, b);
          const hex = rgbToHex(rgb);
          const friendly = getPantoneFriendlyName(entry.name);
          const split = splitPrefix(entry.name);

          const isFav = favorites.includes(entry.name);
          const isSelected = selectedName === entry.name;

          return (
            <div
              key={entry.name}
              className={isSelected ? 'swatch selected' : 'swatch'}
              onClick={() => {
                void onSelect(entry.name, hex);
              }}
            >
              <div className="swatch-star" onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                  onClick={() => toggleFavorite(entry.name)}
                >
                  <Star size={18} weight={isFav ? 'fill' : 'regular'} />
                </button>
              </div>

              <div className="swatch-color" style={{ backgroundColor: hex }}>
                <div className="swatch-copied">Copied!</div>
              </div>

              <div className="swatch-names">
                <div className="swatch-name">
                  <strong>{split.prefix}</strong>
                  {split.rest}
                </div>
                <div className="swatch-friendly">{friendly}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={loadMoreRef} style={{ height: 1 }} />

      <div style={{ marginTop: 14, opacity: 0.7, fontSize: 12 }}>
        Showing {Math.min(visibleCount, filterOnlyFavs ? favorites.length : entries.length)} /{' '}
        {filterOnlyFavs ? favorites.length : entries.length} ({bookLabel})
      </div>
    </div>
  );
}
