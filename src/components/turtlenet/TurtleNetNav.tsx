import { useEffect, useRef, useState } from 'react';
import { pageUrl, type TurtleNetVersion } from '../../utils/turtlenet-versions';

interface PageInfo {
  order: number;
  title: string;
  slug: string;
}

interface TurtleNetNavProps {
  pages: PageInfo[];
  currentSlug: string;
  version: TurtleNetVersion;
}

function formatOrder(order: number): string {
  return Number.isInteger(order) ? `${order}.0` : `${order}`;
}

function isOptional(order: number): boolean {
  return !Number.isInteger(order);
}

const SCROLL_DELTA = 240;

export default function TurtleNetNav({ pages, currentSlug, version }: TurtleNetNavProps) {
  const currentIndex = pages.findIndex((p) => p.slug === currentSlug);
  const listRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLAnchorElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = listRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ inline: 'center', block: 'nearest' });
    }
    updateEdges();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollBy = (delta: number) => {
    listRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <nav className="tn-nav" aria-label="TurtleNet pagination">
      <button
        type="button"
        className={`tn-nav__arrow${atStart ? ' tn-nav__arrow--disabled' : ''}`}
        onClick={() => scrollBy(-SCROLL_DELTA)}
        aria-label="Scroll pages left"
        disabled={atStart}
      >
        ◀
      </button>

      <div className="tn-nav__list" ref={listRef}>
        {pages.map((page, i) => {
          const isCurrent = i === currentIndex;
          const href = pageUrl(version, page.order, page.slug);
          const orderStr = formatOrder(page.order);
          const displayOrder = isOptional(page.order) ? `(${orderStr})` : orderStr;
          const classes = ['tn-nav__page', isCurrent && 'tn-nav__page--current']
            .filter(Boolean)
            .join(' ');

          return (
            <a
              key={page.slug}
              ref={isCurrent ? currentRef : undefined}
              className={classes}
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <span className="tn-nav__page-number">{displayOrder}</span>
              <span className="tn-nav__page-title">
                {page.title.replace(/^TurtleNet\s*\d*\.?\d*:\s*/, '')}
              </span>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        className={`tn-nav__arrow${atEnd ? ' tn-nav__arrow--disabled' : ''}`}
        onClick={() => scrollBy(SCROLL_DELTA)}
        aria-label="Scroll pages right"
        disabled={atEnd}
      >
        ▶
      </button>
    </nav>
  );
}
