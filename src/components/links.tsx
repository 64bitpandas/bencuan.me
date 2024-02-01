import { type ReactNode } from "react"
import { Tooltip } from 'react-tooltip'
import '../sass/layout.scss';

type props = {
  href: string,
  label: string,
  children?: ReactNode,
  className?: string,
  hasArrow?: boolean,
}

/** Link to an external website. */
export const XLink = ({ href, label, children, className, hasArrow=true}: props) => {
  return (
    <>
      <a
        className={(className) ? className: "link"}
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        id={`#xlink-${label}`}
      >
        {children}{hasArrow && (<>&nbsp;↗</>)}
      </a>
      <Tooltip anchorSelect={`#xlink-${label}`} clickable>
        <a href={href} target="_blank" rel="noreferrer" aria-label={label}>{href}</a>
      </Tooltip>
    </>
  )
}

/** Link to an internal page. */
export const ILink = ({ }) => {}
