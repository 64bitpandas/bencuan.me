/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import '../sass/layout.scss';

function XLink({ href, label, children, className, hasArrow=true}) {

  return (
    <a className={(className) ? className: "link"} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}{hasArrow && (<>&nbsp;↗</>)}
    </a>
  )
}

export default XLink
