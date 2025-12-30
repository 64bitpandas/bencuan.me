import { useState, useEffect, useMemo, useCallback } from 'react';
import { labToHex, isLightColor, formatPantoneName } from './colorUtils';

interface ColorRecord {
  name: string;
  code: string;
  components: number[];
}

interface ColorBook {
  title: string;
  prefix: string;
  colorCount: number;
  records: Record<string, ColorRecord>;
}

interface ColorBookGroup {
  prefix: string;
  displayName: string;
  books: { title: string; colors: ColorRecord[] }[];
}

interface FavoritesPreset {
  [prefix: string]: { name: string; notes?: string }[];
}

interface Props {
  colorBooks: ColorBook[];
  pantoneNames: Record<string, { name: string; hex: string }>;
  favoritesPreset: FavoritesPreset;
}

const STORAGE_KEY = 'color-explorer-favorites';
const SIZE_STORAGE_KEY = 'color-explorer-size';

function getStandardPrefix(prefix: string): string {
  if (prefix.startsWith('PANTONE')) return 'PANTONE';
  if (prefix.startsWith('HKS')) return 'HKS';
  if (prefix.startsWith('TOYO')) return 'TOYO';
  return prefix.trim();
}

function getDisplayTitle(book: ColorBook): string {
  const title = book.title.replace(/\.acb$/i, '').replace(/[A-F0-9-]{36}/i, '').trim();
  if (title) return title;
  const prefix = book.prefix.trim();
  return prefix || 'Unknown';
}

export default function ColorExplorer({ colorBooks, pantoneNames, favoritesPreset }: Props) {
  const [selectedPrefix, setSelectedPrefix] = useState<string>('PANTONE');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isFiltering, setIsFiltering] = useState(false);
  const [swatchSize, setSwatchSize] = useState(6);
  const [copyingColor, setCopyingColor] = useState<string | null>(null);

  const groupedBooks = useMemo(() => {
    const groups: Record<string, ColorBookGroup> = {};

    for (const book of colorBooks) {
      const prefix = getStandardPrefix(book.prefix);
      if (!groups[prefix]) {
        groups[prefix] = {
          prefix,
          displayName: prefix,
          books: []
        };
      }

      const colors = Object.values(book.records);
      const displayTitle = getDisplayTitle(book);

      groups[prefix].books.push({
        title: displayTitle,
        colors
      });
    }

    return groups;
  }, [colorBooks]);

  const prefixList = useMemo(() => Object.keys(groupedBooks).sort(), [groupedBooks]);

  const currentGroup = groupedBooks[selectedPrefix];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved)));
      } catch {}
    }

    const savedSize = localStorage.getItem(SIZE_STORAGE_KEY);
    if (savedSize) {
      setSwatchSize(parseInt(savedSize, 10) || 6);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(SIZE_STORAGE_KEY, String(swatchSize));
  }, [swatchSize]);

  const toggleFavorite = useCallback((colorName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(colorName)) {
        next.delete(colorName);
      } else {
        next.add(colorName);
      }
      return next;
    });
  }, []);

  const handleCopy = useCallback(async (colorName: string, hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopyingColor(colorName);

    const header = document.getElementById('color-header');
    if (header) {
      const textColor = isLightColor(hex) ? '#000000' : '#ffffff';
      header.style.setProperty('--header-bg', hex);
      header.style.setProperty('--header-text', textColor);
    }

    setTimeout(() => setCopyingColor(null), 1000);
  }, []);

  const loadPreset = useCallback(() => {
    const newFavorites = new Set<string>();
    for (const [prefix, colors] of Object.entries(favoritesPreset)) {
      for (const color of colors) {
        newFavorites.add(color.name);
      }
    }
    setFavorites(newFavorites);
  }, [favoritesPreset]);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
    setIsFiltering(false);
    const header = document.getElementById('color-header');
    if (header) {
      header.style.setProperty('--header-bg', '#1E66F5');
      header.style.setProperty('--header-text', '#ffffff');
    }
  }, []);

  const currentPrefixIndex = prefixList.indexOf(selectedPrefix);

  const getFriendlyName = useCallback((colorName: string): string | null => {
    return formatPantoneName(colorName, pantoneNames);
  }, [pantoneNames]);

  const formatColorName = useCallback((name: string, prefix: string): JSX.Element => {
    if (name.startsWith(prefix)) {
      return (
        <>
          <span className="bold">{prefix}</span>
          {name.slice(prefix.length)}
        </>
      );
    }
    const words = name.split(' ');
    return (
      <>
        <span className="bold">{words[0]}</span>
        {words.length > 1 ? ' ' + words.slice(1).join(' ') : ''}
      </>
    );
  }, []);

  return (
    <div className="explorer-page">
      <div className="explorer-header">
        <h1 className="explorer-title">
          <span className="bold">{selectedPrefix}</span>
          {currentGroup?.books[0]?.title && currentGroup.books[0].title !== selectedPrefix && (
            <> {currentGroup.books[0].title.replace(selectedPrefix, '').trim()}</>
          )}
        </h1>

        <div className="explorer-controls">
          <div className="control-group size-control">
            <label>size</label>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={swatchSize}
              onChange={(e) => setSwatchSize(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="control-group">
            <label>standard</label>
            <div className="standard-nav">
              <button
                className="nav-arrow"
                onClick={() => setSelectedPrefix(prefixList[currentPrefixIndex - 1])}
                disabled={currentPrefixIndex === 0}
                aria-label="Previous standard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
                </svg>
              </button>
              <select
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
              >
                {prefixList.map(prefix => (
                  <option key={prefix} value={prefix}>{prefix}</option>
                ))}
              </select>
              <button
                className="nav-arrow"
                onClick={() => setSelectedPrefix(prefixList[currentPrefixIndex + 1])}
                disabled={currentPrefixIndex === prefixList.length - 1}
                aria-label="Next standard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {currentGroup?.books.map((book, bookIndex) => (
        <div key={bookIndex}>
          {currentGroup.books.length > 1 && (
            <h2 className="explorer-title" style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>
              {book.title}
            </h2>
          )}
          <div
            className="swatches-grid"
            style={{ '--swatch-columns': swatchSize } as React.CSSProperties}
          >
            {book.colors.map((color) => {
              const hex = labToHex(color.components);
              const isFavorite = favorites.has(color.name);
              const isHidden = isFiltering && !isFavorite;
              const friendlyName = getFriendlyName(color.name);

              return (
                <div
                  key={color.name}
                  className={`swatch ${copyingColor === color.name ? 'copying' : ''} ${isHidden ? 'hidden' : ''}`}
                  onClick={() => handleCopy(color.name, hex)}
                >
                  <div
                    className="swatch-color"
                    style={{ backgroundColor: hex }}
                  >
                    <div className="copied-overlay">Copied!</div>
                  </div>
                  <button
                    className={`swatch-favorite ${isFavorite ? 'is-favorite' : ''}`}
                    onClick={(e) => toggleFavorite(color.name, e)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                      {isFavorite ? (
                        <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"/>
                      ) : (
                        <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.38,16.38,0,0,0,239.18,97.26Zm-15.34,12.89-45,38.83a8,8,0,0,0-2.56,7.91l13.76,58.07a.37.37,0,0,1-.17.48.22.22,0,0,1-.25,0l-50.53-31.08a8,8,0,0,0-8.22,0L80.34,215.42a.22.22,0,0,1-.25,0,.37.37,0,0,1-.17-.48l13.76-58.07a8,8,0,0,0-2.56-7.91l-45-38.83a.37.37,0,0,1-.12-.48.39.39,0,0,1,.46-.17l59,4.76a8,8,0,0,0,6.75-4.12l22.75-55.08a.4.4,0,0,1,.58,0l22.75,55.08a8,8,0,0,0,6.75,4.12l59,4.76a.39.39,0,0,1,.46.17A.37.37,0,0,1,223.84,110.15Z"/>
                      )}
                    </svg>
                  </button>
                  <div className="swatch-info">
                    <div className="swatch-name">{formatColorName(color.name, selectedPrefix)}</div>
                    {friendlyName && <div className="swatch-friendly-name">{friendlyName}</div>}
                    <div className="swatch-hex">{hex}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="favorites-panel">
        <div className="favorites-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
            <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"/>
          </svg>
          favorites
        </div>
        <div className="favorites-actions">
          <button className="favorites-btn" onClick={() => setIsFiltering(!isFiltering)}>
            {isFiltering ? <><span className="bold">un</span>filter</> : 'filter'}
          </button>
          <button className="favorites-btn" onClick={loadPreset}>preset</button>
          <button className="favorites-btn" onClick={clearFavorites}>clear</button>
        </div>
      </div>
    </div>
  );
}
