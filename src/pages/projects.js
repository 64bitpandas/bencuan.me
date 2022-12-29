import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import XLink from "../components/xlink";
import '../sass/projects.scss';

const statuses = ['planning', 'development', 'production', 'LTS'];

const activeProjects = [
  {
    name: 'blog',
    status: 'production',
    link: 'https://blog.bencuan.me',
    description: [
      'some thoughts, goals, and dreams.',
      'platform active, article production in progress.'
    ]
  },
  {
    name: 'turtlenet',
    status: 'development',
    link: 'https://turtlenet.bencuan.me',
    description: [
      'a beginner’s guide to homelabbing.',
      'infrastructure has been established; documentation in progress.'
    ]
  },
  {
    name: 'notes',
    status: 'development',
    link: 'https://notes.bencuan.me',
    description: [
      'deciphering Berkeley CS classes for general consumption on an Obsidian-friendly markdown rendering engine.',
      'currently compiling existing notes and consolidating into one location.'
    ]
  },
  // {
  //   name: 'azulea',
  //   status: 'planning',
  //   link: 'https://azulea.me',
  //   description: ['coming soon to a major music distributor near you']
  // },
];

const completedProjects = [
  {
    name: 'catan',
    link: 'https://catan.bencuan.me',
    description: 'roll without replacement for extra spicy strategy'
  },
  {
    name: 'simultaneous-scrabble',
    link: 'https://scrabbleserver.bencuan.me',
    description: 'multiplayer online scrabble where everyone plays at the same time'
  },
  {
    name: 'inboxier',
    link: 'https://github.com/64bitpandas/inboxier',
    description: 'a true Google Inbox extension for gmail, with built-in bundling'
  },
  {
    name: 'room-of-sounds',
    link: 'https://github.com/64bitpandas/RoomOfSounds',
    description: 'Unity to Max/MSP interoperability demo'
  },
  {
    name: 'piazza-archiver',
    link: 'https://github.com/64bitpandas/piazza-archiver',
    description: 'download all Piazza posts from a course in json format'
  },
  {
    name: 'launchhacks',
    link: 'https://launchhacks.bananium.com',
    description: 'just another high school hackathon'
  },
]

const ProjectsPage = () => (
  <Layout currPage='projects'>
    <div className="container">
      <h1 className="title">project status</h1>
        {activeProjects.map((proj) => (
          <div className="proj-container" key={proj.name}>
            <div className="proj-sidebar">
              <div className="center-desktop">
              {statuses.map((status) => 
                (<div className={`proj-status ${(status === proj.status) ? 'curr-status' : ''}`} key={status}>{status}</div>)
              )}
              </div>
            </div>
            <div className="proj-content">
              <XLink href={proj.link} label={proj.name} className="link proj-link">{proj.name}</XLink>
              <p>{proj.description.map(line => (<React.Fragment key={line}>{line}<br/></React.Fragment>))}</p>
            </div>
          </div>
        ))}

      <h2>completed projects</h2>
      {completedProjects.map((proj) => (
        <div className="completed-project" key={proj.name}>
          <XLink href={proj.link} label={proj.name} className="link proj-link">{proj.name}</XLink>
          <p>{proj.description}</p>
        </div>
      ))}
    </div>
  </Layout>
)

export const Head = () => <Seo />
export default ProjectsPage
