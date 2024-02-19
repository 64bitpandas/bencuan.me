/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */
import React, { type ReactNode } from 'react';
import '../sass/layout.scss';
import Footer from './footer';
import Header from './header';
import { ILink, XLink } from './links';

type props = {
  currPage: string;
  children?: ReactNode;
  description?: string;
};
const Layout = ({ currPage, children, description }: props) => {
  console.log('current page: ', currPage);
  return (
    <div className="body">
      <Header currPage={currPage} siteTitle={`${currPage}`} />
      <main className="container"> {children} </main>
      <Footer />
    </div>
  );
};

export default Layout;
