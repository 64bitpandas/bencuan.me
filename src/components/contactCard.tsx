import { faLinkedin, faMastodon, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ReactNode, useRef } from 'react';
import '../sass/button.scss';
import '../sass/contact.scss';
import { XLink } from './links';

const ContactCard = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  return (
    <div className="center">
      <div ref={inputRef} className="card button-simple ui-text">
        <p>
          <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
          <span>
            <b>email:</b> contact (at) bencuan.me
          </span>
        </p>

        <p>
          <FontAwesomeIcon icon={faTwitter} className="contact-icon" />
          <b>twitter:</b>
          <XLink href="https://twitter.com/bencuan_" label="twitter">
            {' '}
            @bencuan_
          </XLink>
        </p>

        <p>
          <FontAwesomeIcon icon={faMastodon} className="contact-icon" />
          <b>mastodon:</b>
          <XLink href="https://hachyderm.io/@bencuan" label="mastodon">
            {' '}
            @bencuan@hachyderm.io
          </XLink>
        </p>

        <p>
          <FontAwesomeIcon icon={faLinkedin} className="contact-icon" />
          <b>linkedin:</b>
          <XLink href="https://linkedin.com/in/bencuan" label="linkedin">
            {' '}
            linkedin.com/in/bencuan
          </XLink>
        </p>
      </div>
    </div>
  );
};

export default ContactCard;
