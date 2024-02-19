import type { ReactNode } from "react"

type blockquoteProps = {
  children?: ReactNode
}

export const Blockquote = () => (
  <blockquote className="quote">
    test quote <slot />
  </blockquote>
)

export const components = { blockquote: Blockquote }
