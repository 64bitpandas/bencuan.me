/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React, { type ReactNode } from "react";

import Header from "./header"
import "../sass/layout.scss"
import { XLink } from "./links"

type props = {
  currPage: string,
  children?: ReactNode,
  description?: string,
}
const Layout = ({ currPage, children, description }: props) => {

  const [showArchives, setShowArchives] = React.useState(false);
  const [latestCommit, setLatestCommit] = React.useState("");
  // fetch latest commit
  React.useEffect(() => {
    try {
      fetch("https://api.bencuan.me/latest-commit").then((response) => response.json()).then((data) => {
        const sha: string = data.sha;
        const date: string = data.commit?.author?.date;
        if (sha && date) {
          const parsedDate = new Date(date);
          const sDate = `${parsedDate.getFullYear()}.${('0' + (parsedDate.getMonth() + 1)).slice(-2) }.${('0' + parsedDate.getDate()).slice(-2)}`
          setLatestCommit(`v6@${sha.substring(0,6)}_${sDate}`);
        }
      });
    } catch { } //don't display anything if api is down
  })

  return (
    <div className="body">
      <Header currPage={currPage} siteTitle={`${currPage}`} />
      <main className="container"> {children} </main>
      <footer>
        <hr/>
        {
          showArchives ?
            ([2018, 2019, 2020, 2021, 2022].map((val => (<React.Fragment key={val} > <a className="link" href={`/${val}`}> {val} </a>&nbsp;/&nbsp;</React.Fragment >))))
            : (<><span tabIndex={0} role="button" className="link showarchive" onClick={() => { setShowArchives(true) }}> archives </span>&nbsp;//&nbsp;</>)
        }

        <XLink href="https://github.com/64bitpandas/bencuan.me" label="source" > source </XLink>

        {
          latestCommit ?
            <div><XLink href="https://github.com/64bitpandas/bencuan.me" label="source">{latestCommit}</XLink></div>
          : <></>
        }
      </footer>
    </div>
  )
}

export default Layout
