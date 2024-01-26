import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import "../sass/layout.scss";
import "../sass/header.scss";
import XLink from "./xlink";

const links = [
  {
    name: "home",
    url: "/"
  },
  {
    name: "about",
    url: "/about"
  },
  {
    name: "projects",
    url: "/projects"
  },
  {
    name: "contact",
    url: "/contact"
  }
]

type props = {
  siteTitle: string,
  currPage: string
}

const Header = ({ siteTitle, currPage }: props) => {
  const [mobileNavVisible, setMobileNavVisible] = React.useState(false);
  const [operational, setOperational] = React.useState(true);

  const mobileClick = () => {
    setMobileNavVisible(!mobileNavVisible);
  }

  React.useEffect(() => {
    // fetch status
    try {
      fetch("https://api.bencuan.me/status").then((response) => response.text()).then((data) => { setOperational(data === 'OK') });
    } catch {
      setOperational(false);
    }
  })

  return (
    <header>
      <div className={`nav-container ${(mobileNavVisible) ? "mobile-visible" : "mobile-hidden"}`}>
        <div className="nav-links">
          {
            links.map((link, i, row) => (
              <span className="nav-link" key={link.name}>
                <a className={(currPage === link.name) ? "link nav-link nav-current" : "link nav-link"} href={link.url}>{link.name}</a>
                {(i + 1 !== row.length) && (!mobileNavVisible) && (<span>&nbsp;|&nbsp;</span>)}
              </span>
            ))
          }
        </div>
        <div className="nav-status">
          <XLink
            href="https://status.bencuan.me"
            label="status"
          >
            {(operational) ? "all systems operational" : "service outage - click for details"}
          </XLink>
          <FontAwesomeIcon icon={faCircle} className={`status-circle ${(operational) ? "status-green" : "status-red"}`} />
        </div>
      </div>
      <div className="nav-container-mobile">
        <button className={`hamburger hamburger--vortex ${(mobileNavVisible) ? 'is-active' : ''}`} type="button"
          aria-label="Menu" aria-controls="navigation" aria-expanded={mobileNavVisible} onClick={mobileClick}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header
