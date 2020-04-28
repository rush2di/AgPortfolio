import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Transition from "./transition"

import "../styles/styles.scss"

const Layout = ({ children, location }) => (
  <React.Fragment>
    <div className="app--wrapper">
      <nav className="app--nav container">
        <div className="navlogo">
          <Link activeClassName="active-link" to="/">
            <span>Grana.ab</span>
          </Link>
        </div>
        <ul className="navitems">
          <li>
            <Link activeClassName="active-link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link activeClassName="active-link" to="/blog">
              Blog
            </Link>
          </li>
        </ul>
      </nav>
      <Transition location={location}>
        <main className="container--main section">{children}</main>
      </Transition>
      <footer className="container--footer">
        © {new Date().getFullYear()}, developed by
        {` `}
        <a href="https://www.github.com/rush2di">rush2di</a>
      </footer>
      <div className="borders">
        <div className="top thickness-hight"></div>
        <div className="bottom thickness-hight"></div>
        <div className="left thickness-width"></div>
        <div className="right thickness-width"></div>
      </div>
    </div>
  </React.Fragment>
)

export default Layout

// Prop-Types
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
