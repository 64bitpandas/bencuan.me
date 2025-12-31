import { useEffect, useState } from 'react';

interface ColorHeaderProps {
  currentPage: 'palettes' | 'explorer' | 'about';
  initialBg?: string;
  initialText?: string;
}

const DEFAULT_BG = '#1e66f5';
const DEFAULT_TEXT = '#ffffff';

export default function ColorHeader({ currentPage, initialBg, initialText }: ColorHeaderProps) {
  const [bgColor, setBgColor] = useState(initialBg || DEFAULT_BG);
  const [textColor, setTextColor] = useState(initialText || DEFAULT_TEXT);

  useEffect(() => {
    const handleColorChange = (e: CustomEvent<{ bg: string; text: string }>) => {
      setBgColor(e.detail.bg);
      setTextColor(e.detail.text);
    };

    window.addEventListener('color-header-update', handleColorChange as EventListener);
    return () => {
      window.removeEventListener('color-header-update', handleColorChange as EventListener);
    };
  }, []);

  const pages = [
    { id: 'palettes', label: 'palettes', href: '/colors' },
    { id: 'explorer', label: 'explorer', href: '/colors/explorer' },
    { id: 'about', label: 'about', href: '/colors/about' },
  ];

  return (
    <header
      className="color-header"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <h1 className="color-header__title">colors</h1>
      <nav className="color-header__nav">
        {pages.map((page) => (
          <a
            key={page.id}
            href={page.href}
            className={`color-header__link ${currentPage === page.id ? 'color-header__link--active' : ''}`}
          >
            {page.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
