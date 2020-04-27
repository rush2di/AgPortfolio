import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import ShareButtons from "../components/shareButtons"

const Article = ({ data }) => {
  let urlOrigin = "https://grana-ab.netlify.app"
  const { src: bgImage } = data.markdownRemark.frontmatter.cover.childImageSharp.fluid
  const { title, date, tags, description } = data.markdownRemark.frontmatter
  const { slug } = data.markdownRemark.fields
  const { html } = data.markdownRemark
  const tagsArray = tags[0].split(" ")
  const {
    src: bgImage,
  } = data.markdownRemark.frontmatter.cover.childImageSharp.fluid

  useEffect(()=>{
    urlOrigin = (!!window.location && window.location.origine) || "https://grana-ab.netlify.app"
  })

  return (
    <React.Fragment>
      <Helmet>
        <title>{title} | Grana.ab</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${title} | Theke`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${urlOrigin}${bgImage}`} />
        <meta property="og:url" content={`${urlOrigin}/article${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="fr_FR" />
        <link rel="canonical" href={`${urlOrigin}/article${slug}`} />
      </Helmet>
      <Layout>
        <div className="article_wrapper">
          <div className="article_head">
            <div
              className="article_head--bg"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <div className="article_head--over">              
                <h3>{title}</h3>
                <div className="article_head--over-tags">
                  {tagsArray.map((tag, i) => <span key={'tag-'+i}>{tag}</span>)}
                </div>
                <span className="article_head--over-dates">{date}</span>
              </div>
            </div>
          </div>
          <div
            className="article_body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="article_share">
            <span>Share the article</span>
            <ShareButtons slug={slug} title={title} />
          </div>
        </div>
      </Layout>
    </React.Fragment>
  )
}

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
            }
          }
        }
        tags
      }
    }
  }
`


export default Article

// Prop-Types
Article.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}