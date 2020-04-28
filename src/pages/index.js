import React from "react"

import HomePage from "../templates/homePage"
import Seo from "../components/seo"

const IndexPage = () => (
  <React.Fragment>
  	<Seo title="Home" />
    <HomePage />
  </React.Fragment>
)

export default IndexPage
