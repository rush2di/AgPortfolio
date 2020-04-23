import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

const Article = (props) => {
  console.log(props)
  return <div>test</div>
}

export default Article

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
        cover {
          childImageSharp {
            fluid {
              src
              srcSet
            }
          }
        }
        tags
      }
    }
  }
`
