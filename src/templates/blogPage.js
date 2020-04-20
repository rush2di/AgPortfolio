import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Image from "gatsby-image"

const BlogPage = (props) => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
{
  allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
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
  {
  // </div>
  // <div className="section-blog--mainGrid">
  //   <div className="section-blog--gridft">
  //     <ArticleCard data={allMarkdownRemark} />
  //   </div>
  //   <div className="section-blog--gridsec">
  //     <Aside data={allMarkdownRemark} />
  //   </div>
    }
  </div>
    )
}

const ArticleCard = ({data}) => (
  data.edges.map((post) => {
  const { slug } = post.node.fields
  const { fluid } = post.node.frontmatter.cover.childImageSharp
  const { description, tags, date, title } = post.node.frontmatter
  const tagsArray = tags.slice(' ')

  return (
    <div className="article-card--wrapper">
      <Image src={cover} />
      <div className="article-card--tags">
        {tagsArray.map()}
      </div>
      <h1>{title}</h1>
      <span>{date}</span>
      <p>{description}</p>
      <button><Link to={slug}>Read More</Link></button>
    </div>
    )
  })
)

const Aside = ({ data }) => {
  return (
    <aside className="aside--container">
      <div className="aside--searchbox">
        <form>
          <input types="text" placeholder="search..." />
        </form>
      </div>
      <div className="aside--categories">
        tags sit here
      </div>
      <div className="aisde--latest">
        four latest blog posts goes here
      </div>
    </aside>
    )
}