/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React, { type ReactNode } from "react";

import Header from "./header"
import "../sass/layout.scss"
import XLink from "./xlink"

type props = {
  currPage: string,
  children?: ReactNode,
  description?: string,
}
const Layout = ({ currPage, children, description }: props) => {

  const [showArchives, setShowArchives] = React.useState(false);

  return (
      <div className="body">
      <Header currPage={currPage} siteTitle={`${currPage}`} />
      <main> {children} </main>
      <footer>
        {
          showArchives ?
          ([2018, 2019, 2020, 2021, 2022].map((val => (<React.Fragment key={val} > <a className="link" href={`/${val}`}> {val} </a>&nbsp;|&nbsp;</React.Fragment >))))
          : (<><span tabIndex={0} role="button" className="link showarchive" onClick={() => { setShowArchives(true) }}> archives </span>&nbsp;|&nbsp;</>)
        }

        <XLink href="https://github.com/64bitpandas/bencuan.me" label="source" > source </XLink>
      </footer>
    </div>
  )
}

export default Layout
