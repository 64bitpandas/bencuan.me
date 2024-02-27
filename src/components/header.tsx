import * as React from 'react';
import bookLogo from '../fontcustom/book.svg';
import chalkboardLogo from '../fontcustom/chalkboard.svg';
import hexcaliberLogo from '../fontcustom/hexcaliber.svg';
import kitchenLogo from '../fontcustom/kitchen.svg';
import turtleLogo from '../fontcustom/turtlenet.svg';
import '../sass/header.scss';
import '../sass/layout.scss';

export type HeaderLink = {
  name: string;
  url: string;
};

const links: HeaderLink[] = [
  {
    name: 'home',
    url: '/',
  },
  {
    name: 'blog',
    url: '/blog',
  },
  {
    name: 'about',
    url: '/about',
  },
];

const moreLinks = [
  {
    name: 'projects',
    url: '/projects',
    icon: chalkboardLogo,
  },
  {
    name: 'library',
    url: '/library',
    icon: bookLogo,
  },
  {
    name: 'recipes',
    url: '/recipes',
    icon: kitchenLogo,
  },
  {
    name: 'services',
    url: 'https://status.tsh.sh',
    icon: turtleLogo,
  },
  {
    name: 'games',
    url: 'https://hexcaliber.dev',
    icon: hexcaliberLogo,
  },
];

type props = {
  currPage: string;
  customPages?: HeaderLink[];
};

const Header = ({ currPage, customPages }: props) => {
  const [mobileNavVisible, setMobileNavVisible] = React.useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = React.useState(false);
  const mobileClick = () => {
    setMobileNavVisible(!mobileNavVisible);
  };
  const allLinks = customPages && !mobileNavVisible ? links.concat(customPages) : links;

  return (
    <header>
      <div className={`nav-container ${mobileNavVisible ? 'mobile-visible' : 'mobile-hidden'}`}>
        <div className="nav-links">
          {allLinks.map((link, i, row) => (
            <span className="nav-link" key={link.name}>
              <a className={currPage === link.name ? 'link nav-link nav-current' : 'link nav-link'} href={link.url}>
                {link.name}
              </a>
              {i + 1 !== row.length && !mobileNavVisible && <span>&nbsp;/&nbsp;</span>}
            </span>
          ))}
          {mobileNavVisible ? <hr /> : <></>}
          {mobileNavVisible ? (
            moreLinks.map((link, i, row) => (
              <span className="nav-link" key={link.name}>
                <a className={currPage === link.name ? 'link nav-link nav-current' : 'link nav-link'} href={link.url}>
                  {link.name}
                </a>
                {i + 1 !== row.length && !mobileNavVisible && <span>&nbsp;/&nbsp;</span>}
              </span>
            ))
          ) : (
            <></>
          )}
        </div>
        <a className={`link nav-link nav-more`} href="#" onClick={() => setMoreMenuVisible(!moreMenuVisible)}>
          {moreMenuVisible ? <span className="nav-more-less">less</span> : <span className="nav-more-more">more</span>}
        </a>
      </div>
      <div className="nav-more-menu-container">
        <ul className={`nav-more-menu ${moreMenuVisible ? 'nav-visible' : 'nav-invisible'}`}>
          {moreLinks.map((link, i, row) => (
            <div className="more-link-container" key={link.name}>
              <a className="nav-link more-link" href={link.url}>
                {link.name} <img src={link.icon.src} alt={link.name} className="more-link-icon" />
              </a>
            </div>
          ))}
        </ul>
      </div>
      <div className="nav-container-mobile">
        <button
          className={`hamburger hamburger--vortex ${mobileNavVisible ? 'is-active' : ''}`}
          type="button"
          aria-label="Menu"
          aria-controls="navigation"
          aria-expanded={mobileNavVisible}
          onClick={mobileClick}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
