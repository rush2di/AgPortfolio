import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"
import gsap from "gsap"

import Transition from "./transition"
import { ScreenSpyProvider, useScreenSpy } from "../utils/utils"
import "../styles/styles.scss"


// Constant Layout wrapper component /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const Layout = ({ children, location }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClick = () => {
    const closeAnimation = gsap
      .timeline({ onStart: () => { setIsOpen(false) },
        defaults: { ease: "power3.out", duration: 0.8, delay: 0.2 },
      })
      .to("#link-item", { y: 20, opacity: 0 })
      .to("#nav-wrapper", { x: "100vw" })
    closeAnimation.pause()
    if (isOpen) closeAnimation.play()
    if (!isOpen) setIsOpen(true)
  }

  return (
    <ScreenSpyProvider>
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
          <MobileNav isOpen={isOpen} handleMenuClick={handleMenuClick} />
        </nav>
        <MobileNavMenu handleMenuClick={handleMenuClick} />
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
    </ScreenSpyProvider>
  )
}

// Mobile UI navBar  /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const MobileNav = ({ isOpen, handleMenuClick }) => {
  const classToggle = isOpen ? "--open" : ""
  const { width } = useScreenSpy()

  useEffect(() => {
    const openAnimation = gsap
      .timeline({ defaults: { ease: "power3.out", duration: 1 } })
      .to("#nav-wrapper", { x: "0vw" })
      .to("#link-item", { y: 0, opacity: 1, stagger: 0.3 })
    openAnimation.pause()

    if (isOpen) openAnimation.play()
  }, [isOpen])

  return (
    width <= 775 && (
      <div className="mobile-nav">
        <div
          onClick={() => { handleMenuClick() }}
          className={`mobile-nav-btn ${classToggle}`}
        >
          <div className="mobile-nav-btn-lines"></div>
        </div>
      </div>
    )
  )
}

// Mobile side nav menu //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const MobileNavMenu = ({ handleMenuClick }) => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      {
        allMarkdownRemark(
          filter: {
            frontmatter: { templateKey: { eq: "social-links-editor" } }
          }
        ) {
          edges {
            node {
              frontmatter {
                instagram
                facebook
              }
            }
          }
        }
      }
    `
  )
  const { instagram, facebook } = allMarkdownRemark.edges[0].node.frontmatter
  const { width } = useScreenSpy()

  return (
    width <= 775 && (
      <div id="nav-wrapper" className="mobile-nav-wrapper">
        <ul className="mobile-nav-items">
          <li onClick={() => { handleMenuClick() }} >
            <Link id="link-item" activeClassName="active-link" to="/">
              Home
            </Link>
          </li>
          <li onClick={() => { handleMenuClick() }} >
            <Link id="link-item" activeClassName="active-link" to="/blog">
              Blog
            </Link>
          </li>
          <li onClick={() => { handleMenuClick() }} >
            <a id="link-item" href="mailto:">
              Contact me
            </a>
          </li>
          <li onClick={() => { handleMenuClick() }} >
            <a id="link-item" href={instagram}>
              Instagram
            </a>
          </li>
          <li onClick={() => { handleMenuClick() }} >
            <a id="link-item" href={facebook}>
              Facebook
            </a>
          </li>
        </ul>
      </div>
    )
  )
}

export default Layout

// Prop-Types ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
