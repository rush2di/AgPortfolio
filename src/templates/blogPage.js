import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Image from "gatsby-image"

const BlogPage = (props) => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              cover {
                childImageSharp {
                  fluid {
                    src
                  }
                }
              }
              date(formatString: "Do MMMM YYYY")
              description
              title
              tags
            }
          }
        }
      }
    }
  `)
  return (
  <div className="section-blog">
    <div className="section-blog--title">
      <h1>Blog</h1>
    </div>
  </div>
  <div className="section-blog--mainGrid">
  </div>
    )
}

const ArticleCard = () => {
  return (
    <div className="article-card--wrapper">
      <h1>{ title }</h1>
      <span>{date}</span>
      <Image src={cover} />c
      <p>{description}</p>
      <button><Link to={slug}>Read More</Link></button>
    </div>
    )
}