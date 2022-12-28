import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithubAlt, faItchIo, faMastodon } from '@fortawesome/free-brands-svg-icons'
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons"
import azuleaLogo from "../fontcustom/azulea.svg";
import ghostLogo from "../fontcustom/ghost.svg";
import bookLogo from "../fontcustom/book.svg";
import hexcaliberLogo from "../fontcustom/hexcaliber.svg";
import turtleLogo from "../fontcustom/turtlenet.svg";
import XLink from "../components/xlink";

import "../sass/home.scss";

const icons = [
  {
    icon: faMastodon,
    name: 'mastodon',
    link: 'https://hachyderm.io/@bencuan',
    me: true
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

const links = [
  {
    name: 'blog',
    icon: ghostLogo,
    link: 'https://blog.bencuan.me'
  },
  {
    name: 'turtlenet',
    icon: turtleLogo,
    link: 'https://turtlenet.bencuan.me'
  },
  {
    name: 'notes',
    icon: bookLogo,
    link: 'https://notes.bencuan.me'
  },
  {
    name: 'games',
    icon: hexcaliberLogo,
    link: 'https://hexcaliber.dev'
  },
  // {
  //   name: 'music',
  //   icon:  azuleaLogo,
  //   link: 'https://azulea.me'
  // },
]

const IndexPage = () => (
  <Layout currPage='home'>
    <h1 className="name">ben cuan</h1>
    <div className="name-icons">
      {icons.map((val) =>
        (<a href={val.link} key={val.name} className="name-icon" target="_blank" rel={(val.me) ? "me noreferrer" : "noreferrer"} aria-label={val.name}><FontAwesomeIcon icon={val.icon} /></a>)
      )}
    </div>
    <div className="home-links">
      {links.map((val) =>
        (<div style={{ display: "flex" }} key={val.name}>
          <XLink className="home-link" href={val.link} label={val.name} hasArrow={false}>
            <img src={val.icon} alt={val.name} className="home-link-icon" /> {val.name} 
          </XLink>
        </div>)
      )}
    </div>
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo />

export default IndexPage
