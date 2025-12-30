import { Star } from '@phosphor-icons/react';
import { useEffect, useState, useMemo } from 'react';
import { labToRgb, rgbToHex, isLightColor } from './colorUtils';

interface ColorRecord {
  name: string;
  code: string;
  components: [number, number, number];
}

interface ColorBook {
  title: string;
  prefix: string;
  suffix: string;
  records: Record<string, ColorRecord>;
}

interface PantoneNames {
  [code: string]: { name: string; hex: string };
}

interface FavoritesPreset {
  [prefix: string]: string[];
}

interface Props {
  colorBooks: ColorBook[];
  pantoneNames: PantoneNames;
  favoritesPreset: FavoritesPreset;
}

type GroupedBooks = {
  [prefix: string]: {
    title: string;
    books: ColorBook[];
  };
};

function getPrefix(title: string): string {
  if (title.startsWith('PANTONE+') || title.startsWith('PANTONE ')) return 'PANTONE';
  if (title.startsWith('TOYO')) return 'TOYO';
  const match = title.match(/^([A-Z]+)/);
  return match ? match[1] : title.split(' ')[0];
}

function formatFriendlyName(fullName: string, pantoneNames: PantoneNames): string | null {
  const match = fullName.match(/(\d{2}-\d{4})/);
  if (match) {
    const code = match[1];
    const entry = pantoneNames[code];
    if (entry) {
      return entry.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return null;
}

function boldPrefix(name: string): React.ReactNode {
  const prefixes = ['PANTONE', 'HKS', 'TOYO', 'DIC', 'FOCOLTONE', 'ANPA', 'TRUMATCH'];
  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) {
      return (
        <>
          <strong>{prefix}</strong>{name.slice(prefix.length)}
        </>
      );
    }
  }
  const words = name.split(' ');
  return (
    <>
      <strong>{words[0]}</strong> {words.slice(1).join(' ')}
    </>
  );
}

const SIZE_STEPS = [3, 4, 5, 6, 8, 10];

export default function ExplorerView({ colorBooks, pantoneNames, favoritesPreset }: Props) {
  const [sizeIndex, setSizeIndex] = useState(2);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterActive, setFilterActive] = useState(false);
  const [copyingColor, setCopyingColor] = useState<string | null>(null);
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');

  const groupedBooks = useMemo<GroupedBooks>(() => {
    const groups: GroupedBooks = {};
    colorBooks.forEach(book => {
      const prefix = getPrefix(book.title);
      if (!groups[prefix]) {
        groups[prefix] = { title: prefix, books: [] };
      }
      groups[prefix].books.push(book);
    });
    return groups;
  }, [colorBooks]);

  const prefixes = useMemo(() => Object.keys(groupedBooks).sort(), [groupedBooks]);

  useEffect(() => {
    if (prefixes.length > 0 && !selectedPrefix) {
      setSelectedPrefix(prefixes[0]);
    }
  }, [prefixes, selectedPrefix]);

  useEffect(() => {
    const saved = localStorage.getItem('colorExplorerFavorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('colorExplorerFavorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const currentBooks = groupedBooks[selectedPrefix]?.books || [];

  const allColors = useMemo(() => {
    const colors: Array<{
      name: string;
      hex: string;
      friendlyName: string | null;
      bookTitle: string;
    }> = [];

    currentBooks.forEach(book => {
      Object.values(book.records).forEach(record => {
        const [L, a, b] = record.components;
        const [r, g, bl] = labToRgb(L, a, b);
        const hex = rgbToHex(r, g, bl);
        const friendlyName = formatFriendlyName(record.name, pantoneNames);
        colors.push({
          name: record.name,
          hex,
          friendlyName,
          bookTitle: book.title,
        });
      });
    });

    return colors;
  }, [currentBooks, pantoneNames]);

  const displayColors = filterActive
    ? allColors.filter(c => favorites.has(c.name))
    : allColors;

  const gridCols = SIZE_STEPS[sizeIndex];

  const toggleFavorite = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const copyColor = async (hex: string, name: string) => {
    await navigator.clipboard.writeText(`#${hex}`);
    setCopyingColor(name);
    const header = document.getElementById('color-header');
    if (header) {
      header.style.setProperty('--color-header-bg', `#${hex}`);
      header.style.setProperty('--color-header-text', isLightColor(hex) ? '#29282d' : '#ffffff');
    }
    setTimeout(() => setCopyingColor(null), 800);
  };

  const loadPreset = () => {
    const presetColors = new Set<string>();
    Object.values(favoritesPreset).flat().forEach(name => presetColors.add(name));
    setFavorites(presetColors);
  };

  const clearFavorites = () => {
    setFavorites(new Set());
    const header = document.getElementById('color-header');
    if (header) {
      header.style.setProperty('--color-header-bg', '#1E66F5');
      header.style.setProperty('--color-header-text', '#ffffff');
    }
  };

  const currentGroupTitle = useMemo(() => {
    if (!selectedPrefix) return '';
    const books = groupedBooks[selectedPrefix]?.books || [];
    if (books.length === 1) return books[0].title;
    return selectedPrefix;
  }, [selectedPrefix, groupedBooks]);

  return (
    <div className="explorer-page">
      <h1>{boldPrefix(currentGroupTitle.toUpperCase())}</h1>

      <div className="explorer-controls">
        <div className="size-control">
          <label>size</label>
          <input
            type="range"
            min={0}
            max={SIZE_STEPS.length - 1}
            value={sizeIndex}
            onChange={e => setSizeIndex(parseInt(e.target.value))}
            step={1}
          />
        </div>

        <div className="standard-selector">
          <label>standard</label>
          <select value={selectedPrefix} onChange={e => setSelectedPrefix(e.target.value)}>
            {prefixes.map(prefix => (
              <option key={prefix} value={prefix}>
                {prefix}
              </option>
            ))}
          </select>
        </div>

        <div className="favorites-panel">
          <span className="fav-label">★ favorites</span>
          <button onClick={() => setFilterActive(!filterActive)}>
            {filterActive ? <><strong>un</strong>filter</> : 'filter'}
          </button>
          <button onClick={loadPreset}>preset</button>
          <button onClick={clearFavorites}>clear</button>
        </div>
      </div>

      <div className="color-grid" style={{ '--grid-cols': gridCols } as React.CSSProperties}>
        {displayColors.map(color => {
          const isCopying = copyingColor === color.name;
          const isFav = favorites.has(color.name);
          const textColor = isLightColor(color.hex) ? '#29282d' : '#ffffff';

          return (
            <div
              key={color.name}
              className={`color-swatch ${isCopying ? 'copying copied' : ''}`}
              onClick={() => copyColor(color.hex, color.name)}
            >
              <div className="swatch-color" style={{ backgroundColor: `#${color.hex}` }} />
              <div className="copied-text" style={{ color: textColor }}>
                Copied!
              </div>
              <button
                className={`star-btn ${isFav ? 'favorited' : ''}`}
                onClick={e => toggleFavorite(color.name, e)}
              >
                {isFav ? <Star weight="fill" /> : <Star weight="regular" />}
              </button>
              <div className="swatch-info">
                <div className="swatch-name">{boldPrefix(color.name)}</div>
                {color.friendlyName && <div className="swatch-friendly">{color.friendlyName}</div>}
                <div className="swatch-hex">#{color.hex}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

