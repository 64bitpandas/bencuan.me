import { faArrowTurnUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ReactNode } from 'react';
import '../sass/blog.scss';
import { MDLink } from './links';

type footnoteProps = {
  n: number; // footnote number
  // default scrolls to FootnoteRef, reveal makes it appear below the footnote.
  style?: 'default' | 'reveal';
  children?: ReactNode;
};

export const Blockquote = () => (
  <blockquote className="quote">
    test quote <slot />
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
  <span>
    <span id={numToId(n, true)}>{children}</span>
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
  </span>
);

export const components = {
  a: MDLink,
  blockquote: Blockquote,
};
