import { faBluesky, faLinkedin, faMastodon, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import '../sass/button.scss';
import '../sass/contact.scss';
import { MDLink } from './links';

const ContactCard = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={inputRef} className="card button-simple ui-text">
      <p>
        <FontAwesomeIcon icon={faLocationDot} className="contact-icon" />
        <span>
          <b>irl:</b> sf bay area (dm for meetup)
        </span>
      </p>

      <p>
        <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
        <span>
          <b>email:</b> contact (at) bencuan.me
        </span>
      </p>

      <p>
        <FontAwesomeIcon icon={faBluesky} className="contact-icon" />
        <b>bluesky:</b> <MDLink href="https://bsky.app/profile/bencuan.me">@bencuan.me</MDLink>
      </p>

      <p>
        <FontAwesomeIcon icon={faTwitter} className="contact-icon" />
        <b>twitter:</b> <MDLink href="https://twitter.com/bencuan_">@bencuan_</MDLink>
      </p>

      <p>
        <FontAwesomeIcon icon={faLinkedin} className="contact-icon" />
        <b>linkedin:</b> <MDLink href="https://linkedin.com/in/bencuan">linkedin.com/in/bencuan</MDLink>
      </p>
    </div>
  );
};

export default ContactCard;
