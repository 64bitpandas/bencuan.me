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
    name: 'garden',
    url: 'https://garden.bencuan.me',
  },
];

type props = {
  currPage: string;
  customPages?: HeaderLink[];
};

const Header = ({ currPage, customPages }: props) => {
  const allLinks = customPages ? links.concat(customPages) : links;

  return (
    <header>
      <div className="nav-container">
        <div className="nav-links">
          {allLinks.map((link, i, row) => (
            <span className="nav-link" key={link.name}>
              <a className={currPage === link.name ? 'link nav-link nav-current' : 'link nav-link'} href={link.url}>
                {link.name}
              </a>
              {i + 1 !== row.length && <span> / </span>}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
