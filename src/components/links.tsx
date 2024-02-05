import { type ReactNode } from "react"
import { Tooltip } from 'react-tooltip'
import {v4 as uuid } from 'uuid';
import '../sass/links.scss';

type props = {
  href: string,
  label: string,
  children?: ReactNode,
  className?: string,
  hasArrow?: boolean,
}

/** Link to an external website. */
export const XLink = ({ href, label, children, className, hasArrow=true}: props) => {
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

/** Link to an internal page. */
export const ILink = ({ }) => {}
