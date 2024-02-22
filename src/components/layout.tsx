/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */
import React, { type ReactNode } from 'react';
import '../sass/layout.scss';
import Footer from './footer';
import Header, { type HeaderLink } from './header';

type props = {
  currPage: string;
  children?: ReactNode;
  customPages?: HeaderLink[];
};
const Layout = ({ currPage, children, customPages }: props) => {
  return (
    <div className="body">
      <Header currPage={currPage} customPages={customPages} />
      <main className="container"> {children} </main>
      <Footer />
    </div>
  );
};

export default Layout;
