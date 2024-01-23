/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "../sass/layout.scss"
import XLink from "./xlink"

const Layout = ({ currPage, children }) => {

  const [showArchives, setShowArchives] = React.useState(false);
  
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="body">
      <Header currPage={currPage} siteTitle={`${currPage} | ${data.site.siteMetadata?.title}`} />
      <main>{children}</main>
      <footer>
      {showArchives ? 
        ([2018, 2019, 2020, 2021, 2022].map((val => (<React.Fragment key={val}><a className="link" href={`/${val}`}>{val}</a>&nbsp;|&nbsp;</React.Fragment>))))
        : (<><span tabIndex="0" role="button" className="link showarchive" onClick={() => { setShowArchives(true) }}>archives</span>&nbsp;|&nbsp;</>)
      }

      <XLink href="https://github.com/64bitpandas/bencuan.me" label="source">source</XLink>
      </footer>
    </div>
  )
}

export default Layout
