import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import XLink from "../components/xlink";
import '../sass/projects.scss';

const statuses = ['planning', 'development', 'production', 'LTS'];

const activeProjects = [
  {
    name: 'turtlenet',
    status: 'production',
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
]

const ProjectsPage = () => (
  <Layout currPage='projects'>
    <div className="container">
      <h1 className="title">project status</h1>
        {activeProjects.map((proj) => (
          <div className="proj-container">
            <div className="proj-sidebar">
              {statuses.map((status) => 
                (<div className={`proj-status ${(status === proj.status) ? 'curr-status' : ''}`} key={status}>{status}</div>)
              )}
            </div>
            <div className="proj-content">
              <XLink href={proj.link} label={proj.name} className="link proj-link">{proj.name}</XLink>
              <p>{proj.description.map(line => (<>{line}<br/></>))}</p>
            </div>
          </div>
        ))}

      <h2>completed projects</h2>
      {completedProjects.map((proj) => (
        <div className="completed-project">
          <XLink href={proj.link} label={proj.name} className="link proj-link">{proj.name}</XLink>
          <p>{proj.description}</p>
        </div>
      ))}
    </div>
  </Layout>
)

export const Head = () => <Seo />
export default ProjectsPage
