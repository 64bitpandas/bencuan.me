import { type ReactNode } from 'react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';
import '../sass/links.scss';

type xProps = {
  href: string;
  label: string;
  children?: ReactNode;
  className?: string;
  hasArrow?: boolean;
  tooltipContent?: string;
};

const hrefToId = (href: string) => href.replaceAll(/\/|\:/g, '');

/** Link to an external website. */
export const XLink = ({ href, label, children, className, hasArrow = true, tooltipContent }: xProps) => {
  const id = uuid().toString().substring(0, 6);
  return (
    <>
      <a
        className={className ? className : 'link'}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        id={`link-${id}`}
        data-tooltip-content={tooltipContent}
        data-tooltip-id="tooltip"
      >
        {children}
        {hasArrow && <span className="arrow">&nbsp;↗</span>}
      </a>
    </>
  );
};

type iProps = {
  href: string;
  children?: ReactNode;
  className?: string;
};

type mdProps = {
  href: string;
  children?: ReactNode;
};

/** Link to an internal page. */
export const ILink = ({ href, children, className }: iProps) => (
  <a href={href} className={className ? className : 'internal-link'}>
    {children}
  </a>
);

/** Used as a component pass-in to MDX. */
export const MDLink = ({ href, children }: mdProps) => {
  if (href.startsWith('https://bencuan.me')) {
    return <ILink href={href}>{children}</ILink>;
  }
  return (
    <XLink href={href} label={href} tooltipContent={href} className="blue-link">
      {children}
    </XLink>
  );
};
