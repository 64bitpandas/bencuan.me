import type { MouseEventHandler, ReactNode } from "react"
import "../sass/button.scss";

type props = {
    href?: string,
    onClick?: MouseEventHandler,
    className?: string,
    children?: ReactNode,
}
const Button = ({href, onClick, className, children}: props) => {

    if (href) {
        return <a href={href} className={`button ${className}`} target="_blank" rel="noopener">{children}</a>
    } else {
        return (<span className={`button ${className}`} onClick={onClick}>{children}</span>)
    }
}

export default Button