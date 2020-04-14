import React from "react"

import Hero from "../components/hero"
import Albums from "../components/albums"
import { useStaticQuery, graphql } from "gatsby"

const HomePage = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              templateKey
              title
              tags
              date(formatString: "Do MMMM YYYY")
              cover
              description
            }
          }
        }
      }
    }
  `)

  return (
    <React.Fragment>
      <Hero
        lastBlogPost={allMarkdownRemark && allMarkdownRemark.edges[0].node}
      />
      <Albums />
    </React.Fragment>
  )
}

export default HomePage
