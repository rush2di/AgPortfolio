import React from "react"
import PropTypes from "prop-types"
import "../styles/styles.scss"

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <div className="">
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
