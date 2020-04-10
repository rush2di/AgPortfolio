import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import HomePage from "../templates/homePage"
import Hero from "../components/hero"

const IndexPage = () => (
  <Layout>
  	<Hero />
    <HomePage />
  </Layout>
)

export default IndexPage
