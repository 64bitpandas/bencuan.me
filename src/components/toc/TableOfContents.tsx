import { useCallback, useEffect, useState } from 'react';
import './toc.scss';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from the page
  useEffect(() => {
    const contentArea = document.querySelector('.blog-content');
    if (!contentArea) return;

    const headingElements = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings: TocHeading[] = [];

    headingElements.forEach(heading => {
      // Generate an ID if the heading doesn't have one
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
      }

      extractedHeadings.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      });
    });

    setHeadings(extractedHeadings);
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
      }
    );

    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

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
    <nav className="toc-sidebar" aria-label="Table of Contents">
      <div className="toc-title">Contents</div>
      <ul className="toc-list">
        {headings.map(heading => (
          <li
            key={heading.id}
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

