interface PageInfo {
  order: number;
  title: string;
  slug: string;
}

interface TurtleNetNavProps {
  pages: PageInfo[];
  currentSlug: string;
}

function formatOrder(order: number): string {
  return Number.isInteger(order) ? `${order}.0` : `${order}`;
}

function isOptional(order: number): boolean {
  return !Number.isInteger(order);
}

export default function TurtleNetNav({ pages, currentSlug }: TurtleNetNavProps) {
  const currentIndex = pages.findIndex((p) => p.slug === currentSlug);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  // Show up to 5 pages on each side of current
  const maxVisible = 5;

  return (
    <nav className="tn-nav" aria-label="TurtleNet pagination">
      {prevPage ? (
        <a
          className="tn-nav__arrow"
          href={prevPage.slug === pages[0].slug ? '/turtlenet' : `/turtlenet/${prevPage.slug}`}
          aria-label="Previous page"
        >
          ◀
        </a>
      ) : (
        <span className="tn-nav__arrow tn-nav__arrow--disabled" aria-hidden="true">
          ◀
        </span>
      )}

      {pages.map((page, i) => {
        const distance = Math.abs(i - currentIndex);
        const isCurrent = i === currentIndex;
        const isHidden = distance > maxVisible;
        const isFar = distance > 3 && !isCurrent;

        const href = i === 0 ? '/turtlenet' : `/turtlenet/${page.slug}`;
        const orderStr = formatOrder(page.order);
        const displayOrder = isOptional(page.order) ? `(${orderStr})` : orderStr;

        const classes = [
          'tn-nav__page',
          isCurrent && 'tn-nav__page--current',
          isHidden && 'tn-nav__page--hidden',
          isFar && 'tn-nav__page--far',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <a key={page.slug} className={classes} href={href} aria-current={isCurrent ? 'page' : undefined}>
            <span className="tn-nav__page-number">{displayOrder}</span>
            <span className="tn-nav__page-title">{page.title.replace(/^TurtleNet\s*\d*\.?\d*:\s*/, '')}</span>
          </a>
        );
      })}

      {nextPage ? (
        <a
          className="tn-nav__arrow"
          href={`/turtlenet/${nextPage.slug}`}
          aria-label="Next page"
        >
          ▶
        </a>
      ) : (
        <span className="tn-nav__arrow tn-nav__arrow--disabled" aria-hidden="true">
          ▶
        </span>
      )}
    </nav>
  );
}

