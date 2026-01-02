import { useCallback, useEffect, useRef, useState } from 'react';
import './toc.scss';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

// Selectors for elements whose headings should be excluded from TOC
const EXCLUDED_SELECTORS = [
  '.vibecode-banner',
  '.collapsible-box',
  '.collapsible-content',
  '[class*="banner"]',
  '[data-toc-exclude]',
];

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const tocRef = useRef<HTMLElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  // Check if a heading is inside an excluded container
  const isHeadingExcluded = useCallback((heading: Element): boolean => {
    for (const selector of EXCLUDED_SELECTORS) {
      if (heading.closest(selector)) {
        return true;
      }
    }
    return false;
  }, []);

  // Extract headings from the page (excluding banners and collapsibles)
  useEffect(() => {
    const contentArea = document.querySelector('.blog-content');
    if (!contentArea) return;

    const headingElements = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings: TocHeading[] = [];

    headingElements.forEach(heading => {
      // Skip headings inside excluded containers
      if (isHeadingExcluded(heading)) {
        return;
      }

      // Generate an ID if the heading doesn't have one
      if (!heading.id) {
        heading.id =
          heading.textContent
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '') || '';
      }

      extractedHeadings.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setHeadings(extractedHeadings);
  }, [isHeadingExcluded]);

  // Handle scroll-based visibility (show after 100vh scroll)
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight; // 100vh
      const shouldBeVisible = window.scrollY > scrollThreshold;
      setIsVisible(shouldBeVisible);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      },
    );

    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Auto-scroll TOC to keep active item visible
  useEffect(() => {
    if (!activeId || !tocRef.current || !activeItemRef.current) return;

    const tocContainer = tocRef.current;
    const activeItem = activeItemRef.current;

    // Calculate the position to scroll to (center the active item in the TOC)
    const containerHeight = tocContainer.clientHeight;
    const itemTop = activeItem.offsetTop;
    const itemHeight = activeItem.clientHeight;
    const scrollTarget = itemTop - containerHeight / 2 + itemHeight / 2;

    tocContainer.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth',
    });
  }, [activeId]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      // Update URL hash without scrolling
      window.history.pushState(null, '', `#${id}`);
    }
  }, []);

  if (headings.length === 0) {
    return null;
  }

  // Find the minimum heading level to normalize indentation
  const minLevel = Math.min(...headings.map(h => h.level));

  return (
    <nav className={`toc-sidebar ${isVisible ? 'toc-visible' : ''}`} ref={tocRef} aria-label="Table of Contents">
      <div className="toc-title">Contents</div>
      <ul className="toc-list">
        {headings.map(heading => (
          <li
            key={heading.id}
            ref={activeId === heading.id ? activeItemRef : null}
            className={`toc-item toc-level-${heading.level - minLevel} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a href={`#${heading.id}`} onClick={e => handleClick(e, heading.id)}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
