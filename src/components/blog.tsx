import { faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ReactNode } from 'react';
import { MDLink } from './links';

type footnoteProps = {
  n: number; // footnote number
  // default scrolls to FootnoteRef, reveal makes it appear below the footnote.
  style?: 'default' | 'reveal';
  children?: ReactNode;
};

type CustomMDProps = {
  children?: ReactNode;
};

export const Blockquote = ({ children }: CustomMDProps) => (
  <blockquote className="quote">
    {children} <slot />
  </blockquote>
);

const numToId = (n: number, ref?: boolean) => `#footnote-${n.toString()}${ref ? '-ref' : ''}`;

export const Footnote = ({ n, style, children }: footnoteProps) => (
  <a
    className="footnote"
    href={numToId(n, true)}
    id={numToId(n)}
    onClick={() => {
      const element = document.getElementById(numToId(n, true));
      if (element) {
        if (style === 'reveal') {
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // https://css-tricks.com/restart-css-animation/
          element.classList.remove('highlight-ref-selected');
          void element.offsetWidth;
          element.classList.add('highlight-ref-selected');
        }
      }
    }}
  >
    {children ?? n.toString()}
  </a>
);

export const FootnoteRef = ({ n, style, children }: footnoteProps) => (
  <div className="footnote-ref-wrapper">
    <span id={numToId(n, true)} className="footnote-ref">
      {n}. {children}
    </span>
    <a
      className="footnote-ref-number footnote-ref"
      href={numToId(n)}
      onClick={() => {
        const element = document.getElementById(numToId(n));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.remove('highlight-ref-selected');
          void element.offsetWidth;
          element.classList.add('highlight-ref-selected');
        }
      }}
    >
      <FontAwesomeIcon icon={faArrowTurnUp} className="footnote-icon" />
    </a>
  </div>
);

export const Caption = ({ children }: CustomMDProps) => <div className="blog-caption">{children}</div>;

export const Endcard = () => <img src="/img/opengraph/endcard.png" width="200" />;

// Custom components (like Footnotes and Captions) can be found in astro.config.mjs
export const components = {
  a: MDLink,
  blockquote: Blockquote,
};
