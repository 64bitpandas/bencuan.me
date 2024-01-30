import { type ReactNode } from "react"
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
    <a className={(className) ? className: "link"} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}{hasArrow && (<>&nbsp;↗</>)}
    </a>
  )
}

/** Link to an internal page. */
