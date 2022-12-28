import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import XLink from "../components/xlink";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faMastodon, faLinkedin } from "@fortawesome/free-brands-svg-icons";

import matrixIcon from "../fontcustom/matrix.svg";

import '../sass/contact.scss';

const ContactPage = () => (
  <Layout currPage='contact'>
    <div className="container">
      <h1 className="title">contact</h1>
      <p>
        let's be friends!
      </p>

      <p>
        <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
        <XLink href="mailto:contact@bencuan.me" label="email">email: contact@bencuan.me</XLink>
      </p>


      <p>
        <img src={matrixIcon} alt="matrix" className="contact-img" />
        <XLink href="https://matrix.to/#/@bencuan:ocf.berkeley.edu" label="matrix"> matrix: @bencuan:ocf.berkeley.edu</XLink>
      </p>

      <p>
        <FontAwesomeIcon icon={faMastodon} className="contact-icon" />
        <XLink href="https://hachyderm.io/@bencuan" label="mastodon">mastodon: @bencuan@hachyderm.io</XLink>
      </p>

      <p>
        <FontAwesomeIcon icon={faLinkedin} className="contact-icon" />
        <XLink href="https://linkedin.com/in/bencuan" label="linkedin">linkedin: linkedin.com/in/bencuan</XLink>
      </p>

    </div>
  </Layout>
)

export const Head = () => <Seo />
export default ContactPage
