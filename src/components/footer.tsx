import { faGithub, faLinkedin, faMastodon, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiSubstack } from '@icons-pack/react-simple-icons';
import React from 'react';
import '../sass/footer.scss';
import { ILink, XLink } from './links';

const icons = [
  {
    icon: faGithub,
    name: 'github',
    link: 'https://github.com/64bitpandas',
  },
  {
    icon: faLinkedin,
    name: 'linkedin',
    link: 'https://linkedin.com/in/bencuan',
  },
  {
    icon: faTwitter,
    name: 'twitter',
    link: 'https://twitter.com/bencuan_',
  },
  {
    icon: faMastodon,
    name: 'mastodon',
    link: 'https://hachyderm.io/@bencuan',
    me: true,
  },
  {
    simpleIcon: SiSubstack,
    name: 'substack',
    link: 'https://substack.com/@bencuan',
  },
];

const Footer = () => {
  const [showArchives, setShowArchives] = React.useState(false);
  const [latestCommit, setLatestCommit] = React.useState('');

  // fetch latest commit
  React.useEffect(() => {
    try {
      fetch('https://api.bencuan.me/latest-commit')
        .then(response => response.json())
        .then(data => {
          const sha: string = data.sha;
          const date: string = data.commit?.author?.date;
          if (sha && date) {
            const parsedDate = new Date(date);
            const sDate = `${parsedDate.getFullYear()}.${('0' + (parsedDate.getMonth() + 1)).slice(-2)}.${('0' + parsedDate.getDate()).slice(-2)}`;
            setLatestCommit(`v6@${sha.substring(0, 6)}_${sDate}`);
          }
        });
    } catch {} //don't display anything if api is down
  });

  return (
    <footer>
      <hr />

      <div className="footer-icons">
        {icons.map(val => (
          <a
            href={val.link}
            key={val.name}
            className="footer-icon"
            target="_blank"
            rel={val.me ? 'me noreferrer' : 'noreferrer'}
            aria-label={val.name}
          >
            {val.icon ? <FontAwesomeIcon icon={val.icon} /> : <val.simpleIcon className="simple-icon" />}
          </a>
        ))}
      </div>

      {showArchives && (
        <>
          <span className="close-archives" onClick={() => setShowArchives(false)}>
            x
          </span>{' '}
          /
        </>
      )}
      {showArchives ? (
        [2018, 2019, 2020, 2021, 2022].map(val => (
          <React.Fragment key={val}>
            {' '}
            <a className="link" href={`/${val}`}>
              {val}
            </a>
            &nbsp;/&nbsp;
          </React.Fragment>
        ))
      ) : (
        <>
          <span
            tabIndex={0}
            role="button"
            className="link show-archive"
            onClick={() => {
              setShowArchives(true);
            }}
          >
            archives
          </span>
          &nbsp;//&nbsp;
        </>
      )}

      <ILink href="/colophon">colophon</ILink>

      {latestCommit ? (
        <div>
          <XLink href="https://github.com/64bitpandas/bencuan.me" label="source">
            {latestCommit}
          </XLink>
        </div>
      ) : (
        <></>
      )}
    </footer>
  );
};

export default Footer;
