import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithubAlt, faItchIo, faMastodon } from '@fortawesome/free-brands-svg-icons'
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons"

const icons = [
  {
    icon: faMastodon,
    name: 'mastodon',
    link: 'https://hachyderm.io/@bencuan'
  },
  {
    icon: faGithubAlt,
    name: 'github',
    link: 'https://github.com/64bitpandas'
  },
  {
    icon: faEnvelopeOpenText,
    name: 'email',
    link: 'mailto:contact@bencuan.me'
  },
  {
    icon: faItchIo,
    name: 'itch',
    link: 'https://64bitpandas.itch.io'
  }
]

const IndexPage = () => (
  <Layout>
    <h1 className="name">ben cuan</h1>
    <div className="name-icons">
      {icons.map((val) => 
        (<a href={val.link} key={val.name} className="name-icon" target="_blank" rel="noreferrer" aria-label={val.name}><FontAwesomeIcon icon={val.icon} /></a>)
      )}
    </div>
    <h2>under construction</h2>
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo />

export default IndexPage
