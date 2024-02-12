import { type ReactNode } from "react"
import { Tooltip } from 'react-tooltip'
import {v4 as uuid } from 'uuid';
import '../sass/links.scss';

type xProps = {
  href: string,
  label: string,
  children?: ReactNode,
  className?: string,
  hasArrow?: boolean,
}

/** Link to an external website. */
export const XLink = ({ href, label, children, className, hasArrow=true}: xProps) => {
  const id = uuid().toString().substring(0, 6);
  return (
    <>
      <a
        className={(className) ? className: "link"}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        id={`link-${id}`}
      >
        {children}{hasArrow && (<>&nbsp;↗</>)}
      </a>
      <Tooltip anchorSelect={`#link-${id}`} className="custom-tooltip" clickable>
        <a href={href} target="_blank" rel="noreferrer" aria-label={label}>{href}</a>
      </Tooltip>
    </>
  )
}

type iProps = {
  href: string,
  children?: ReactNode,
  className?: string,
}

/** Link to an internal page. */
export const ILink = ({ href, children, className }: iProps) => (
  <a href={href} className={(className) ? className : "internal-link"}>
    {children}
  </a>
)
