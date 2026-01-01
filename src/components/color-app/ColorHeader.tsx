import { useCallback, useEffect, useState } from 'react';

interface ColorHeaderProps {
  currentPage: 'palettes' | 'explorer' | 'about';
  initialBg?: string;
  initialText?: string;
}

const DEFAULT_BG = '#1e66f5';
const DEFAULT_TEXT = '#ffffff';

const RAINBOW_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export default function ColorHeader({ currentPage, initialBg, initialText }: ColorHeaderProps) {
  const [bgColor, setBgColor] = useState(initialBg || DEFAULT_BG);
  const [textColor, setTextColor] = useState(initialText || DEFAULT_TEXT);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleColorChange = (e: CustomEvent<{ bg: string; text: string }>) => {
      if (!isAnimating) {
        setBgColor(e.detail.bg);
        setTextColor(e.detail.text);
      }
    };

    window.addEventListener('color-header-update', handleColorChange as EventListener);
    return () => {
      window.removeEventListener('color-header-update', handleColorChange as EventListener);
    };
  }, [isAnimating]);

  const handleTitleClick = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    let colorIndex = 0;

    const interval = setInterval(() => {
      setBgColor(RAINBOW_COLORS[colorIndex % RAINBOW_COLORS.length]);
      setTextColor('#ffffff');
      colorIndex++;

      if (colorIndex >= RAINBOW_COLORS.length * 2) {
        clearInterval(interval);
        setBgColor(DEFAULT_BG);
        setTextColor(DEFAULT_TEXT);
        setIsAnimating(false);
      }
    }, 100);
  }, [isAnimating]);

  const pages = [
    { id: 'palettes', label: 'palettes', href: '/colors' },
    { id: 'explorer', label: 'explorer', href: '/colors/explorer' },
    { id: 'about', label: 'about', href: '/colors/about' },
  ];

  return (
    <header className="color-header" style={{ backgroundColor: bgColor, color: textColor }}>
      <h1
        className={`color-header__title ${isAnimating ? 'color-header__title--animating' : ''}`}
        onClick={handleTitleClick}
      >
        ben's <strong>colors</strong>
      </h1>
      <nav className="color-header__nav">
        {pages.map((page, index) => (
          <>
            {index > 0 && <span className="color-header__separator">//</span>}
            <a
              key={page.id}
              href={page.href}
              className={`color-header__link ${currentPage === page.id ? 'color-header__link--active' : ''}`}
            >
              {page.label}
            </a>
          </>
        ))}
      </nav>
    </header>
  );
}
