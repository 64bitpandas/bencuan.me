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

const Layout = ({ children }) => {

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
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>{children}</main>
        <footer>
        {showArchives ? 
          ([2018, 2019, 2020, 2021].map((val => (<React.Fragment key={val}><a className="link" href={`/${val}`}>{val}</a>&nbsp;|&nbsp;</React.Fragment>))))
          : (<><span tabIndex="0" role="button" className="link showarchive" onClick={() => { setShowArchives(true) }}>archives</span>&nbsp;|&nbsp;</>)
        }

        <a href="https://github.com/64bitpandas/bencuan.me" className="link" target="_blank" rel="noreferrer">source</a>
        </footer>
    </div>
  )
}

export default Layout
