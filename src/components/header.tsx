import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import "../sass/layout.scss";
import "../sass/header.scss";
import { XLink } from "./links";

const links = [
  {
    name: "home",
    url: "/"
  },
  {
    name: "blog",
    url: "/blog"
  },
  {
    name: "about",
    url: "/about"
  },
]

const moreLinks = [
  {
    name: "projects",
    url: "/projects"
  },
  {
    name: "library",
    url: "/library"
  },
  {
    name: "recipes",
    url: "/recipes"
  },
  {
    name: "services",
    url: "https://status.tsh.sh"
  },
  {
    name: "games",
    url: "https://hexcaliber.dev"
  },
]

type props = {
  siteTitle: string,
  currPage: string
}

const Header = ({ siteTitle, currPage }: props) => {
  const [mobileNavVisible, setMobileNavVisible] = React.useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = React.useState(false);
  const mobileClick = () => {
    setMobileNavVisible(!mobileNavVisible);
  }

  return (
    <header>
      <div className={`nav-container ${(mobileNavVisible) ? "mobile-visible" : "mobile-hidden"}`}>
        <div className="nav-links">
          {
            links.map((link, i, row) => (
              <span className="nav-link" key={link.name}>
                <a className={(currPage === link.name) ? "link nav-link nav-current" : "link nav-link"} href={link.url}>{link.name}</a>
                {(i + 1 !== row.length) && (!mobileNavVisible) && (<span>&nbsp;/&nbsp;</span>)}
              </span>
            ))
          }
          {(mobileNavVisible) ? <hr /> : <></>}
          {
            (mobileNavVisible) ? moreLinks.map((link, i, row) => (
              <span className="nav-link" key={link.name}>
                <a className={(currPage === link.name) ? "link nav-link nav-current" : "link nav-link"} href={link.url}>{link.name}</a>
                {(i + 1 !== row.length) && (!mobileNavVisible) && (<span>&nbsp;/&nbsp;</span>)}
              </span>
            )) : <></>
          }
        </div>
        <a className="link nav-link nav-more" href="#" onClick={() => setMoreMenuVisible(!moreMenuVisible)}>
          more
        </a>
      </div>
      <ul className={`nav-more-menu ${(moreMenuVisible) ? 'nav-visible' : ''}`}>
        {
          moreLinks.map((link, i, row) => (
            <li className="nav-link" key={link.name}>
              <a className={(currPage === link.name) ? "link nav-link nav-current" : "link nav-link"} href={link.url}>{link.name}</a>
            </li>
          ))
        }
      </ul>
      <div className="nav-container-mobile">
        <button className={`hamburger hamburger--vortex ${(mobileNavVisible) ? 'is-active' : ''}`} type="button"
          aria-label="Menu" aria-controls="navigation" aria-expanded={mobileNavVisible} onClick={mobileClick}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </header >
  );
}

export default Header
