import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import XLink from "../components/xlink";
import '../sass/about.scss';
const AboutPage = () => (
  <Layout currPage='about'>
    <div className="container">
      <h1 className="title">about me</h1>
      <p>
        Welcome to my little corner of the internet!
      </p>

      <p>
        I’m Ben (he/him), currently finishing up undergrad at UC Berkeley. 
        Instead of going to class I hide at the 
        <XLink className="link blue-link" href="https://ocf.io" label="ocf"> Open Computing Facility</XLink>, 
        teach <XLink className="link blue-link" href="https://cs186berkeley.net" label="cs186">CS 186</XLink>, 
        play <XLink className="link blue-link" href="https://catan.bencuan.me" label="boardgames"> board games</XLink>, 
        make music, and go climbing. Let me know if you’d like to join me for any of these activities :)
      </p>

      <p>
        My goal is to make things that inspire others to make even better things. 
        Feel free to read up on my happenings at my <XLink className="link blue-link" href="https://blog.bencuan.me" label="blog">blog</XLink>, or on 
        <XLink className="link blue-link" href="https://hachyderm.io/@bencuan" label="mastodon"> Mastodon!</XLink>
      </p>
    </div>
  </Layout>
)

export const Head = () => <Seo />
export default AboutPage
