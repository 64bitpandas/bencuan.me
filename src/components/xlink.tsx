import { type ReactNode } from "react"
import '../sass/layout.scss';

type props = {
  href: string,
  label: string,
  children?: ReactNode,
  className?: string,
  hasArrow?: boolean,
}

const XLink = ({ href, label, children, className, hasArrow=true}: props) => {
  return (
    <a className={(className) ? className: "link"} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}{hasArrow && (<>&nbsp;↗</>)}
    </a>
  )
}

export default XLink
