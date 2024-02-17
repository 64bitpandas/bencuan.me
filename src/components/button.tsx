import type { MouseEventHandler, ReactNode } from "react"
import "../sass/button.scss"

type props = {
  href?: string
  onClick?: MouseEventHandler
  className?: string
  children?: ReactNode
}
const Button = ({ href, onClick, className = "", children }: props) => {
  if (href) {
    return (
      <button className={`button ${className}`}>
        <a href={href} target="_blank" rel="noopener">
          {children}
        </a>
      </button>
    )
  } else {
    return (
      <button className={`button ${className}`} onClick={onClick}>
        {children}
      </button>
    )
  }
}

export default Button
