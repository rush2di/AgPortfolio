import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Hero from "../components/hero"
import { useScreenSpy } from "../utils/utils"
import Albums from "../components/albums"

// Home page template wrapper ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const HomePage = () => {
  const { post, homeContent, socials } = useStaticQuery(graphql`
    {
      post: allMarkdownRemark(
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
              cover {
                childImageSharp {
                  fluid {
                    src
                    srcSet
                  }
                }
              }
              description
            }
          }
        }
      }
      homeContent: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "home-page-customizer" } } }
      ) {
        edges {
          node {
            frontmatter {
              introTxt
              profileImg {
                childImageSharp {
                  fluid {
                    src
                    srcSet
                  }
                }
              }
            }
          }
        }
      }
      socials: allMarkdownRemark(
        filter: { frontmatter: { templateKey: { eq: "social-links-editor" } } }
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
  `)

  const { introTxt } = homeContent.edges[0].node.frontmatter
  const { instagram, facebook } = socials.edges[0].node.frontmatter

  const { width } = useScreenSpy()

  return (
    <React.Fragment>
      <Hero
        lastBlogPost={post && post.edges[0].node}
        homeContent={homeContent}
        socials={socials}
      />
      <Albums />
      {width <= 665 && (
        <div className="section-about container">
          <h3>About Me</h3>
          <p>{introTxt}</p>
          <div className="section-about-socials">
            <div className="--line"></div>
            <a href={instagram}>instagram</a>
            <a href={facebook}>facebook</a>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default HomePage
