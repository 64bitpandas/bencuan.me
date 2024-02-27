import { faLinkedin, faMastodon, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type ReactNode, useRef } from 'react';
import '../sass/button.scss';
import '../sass/contact.scss';
import { MDLink } from './links';

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
          <b>twitter:</b> <MDLink href="https://twitter.com/bencuan_">@bencuan_</MDLink>
        </p>

        <p>
          <FontAwesomeIcon icon={faMastodon} className="contact-icon" />
          <b>mastodon:</b> <MDLink href="https://hachyderm.io/@bencuan">@bencuan@hachyderm.io</MDLink>
        </p>

        <p>
          <FontAwesomeIcon icon={faLinkedin} className="contact-icon" />
          <b>linkedin:</b> <MDLink href="https://linkedin.com/in/bencuan">linkedin.com/in/bencuan</MDLink>
        </p>
      </div>
    </div>
  );
};

export default ContactCard;
