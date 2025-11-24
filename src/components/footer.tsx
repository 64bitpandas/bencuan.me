// https://github.com/icons-pack/react-simple-icons/issues/208
// get rid of this one fontawesome adds substack...
// @ts-ignore
import React from 'react';
import '../sass/footer.scss';
import { ILink, XLink } from './links';

type FooterProps = {
  currPage?: string;
};

const Footer = ({ currPage }: FooterProps) => {
  const [showArchives, setShowArchives] = React.useState(false);

  // Get commit info from environment variables set during build
  const commitSha = import.meta.env.PUBLIC_COMMIT_SHA;
  const commitDate = import.meta.env.PUBLIC_COMMIT_DATE;

  // In development, show a development version with today's date
  const isDev = import.meta.env.DEV;
  const todayDate = new Date().toISOString().split('T')[0].replaceAll('-', '.');
  const versionTag = isDev ? `v7@DEV (${todayDate})` : commitSha && commitDate ? `v7@${commitSha} (${commitDate})` : '';

  return (
    <footer>
      <script
        data-goatcounter="https://goatcounter.bencuan.me/count"
        async
        src="//goatcounter.bencuan.me/count.js"
      ></script>

      {showArchives && (
        <>
          <span className="close-archives" onClick={() => setShowArchives(false)}>
            x
          </span>{' '}
          /
        </>
      )}
      {showArchives ? (
        [2018, 2019, 2020, 2021, 2022, 2024].map(val => (
          <React.Fragment key={val}>
            {' '}
            <a className="link" href={`/${val}`}>
              {val}
            </a>
            {' / '}
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
          {' / '}
        </>
      )}

      <ILink href="/colophon" className={currPage === 'colophon' ? 'footer-current' : ''}>
        colophon
      </ILink>

      {versionTag ? (
        <div>
          <XLink href="https://github.com/64bitpandas/bencuan.me" label="source">
            {versionTag}
          </XLink>
        </div>
      ) : (
        <></>
      )}
    </footer>
  );
};

export default Footer;
