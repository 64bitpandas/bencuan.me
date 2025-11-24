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
            setLatestCommit(`v7@${sha.substring(0, 6)} (${sDate})`);
          }
        });
    } catch {} //don't display anything if api is down
  });

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
