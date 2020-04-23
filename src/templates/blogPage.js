import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import Image from "gatsby-image"
import Layout from "../components/layout"

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
                  fluid(maxWidth: 1000, quality: 100) {
                    ...GatsbyImageSharpFluid_tracedSVG
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

  console.log(allMarkdownRemark)

  return (
    <Layout>
      <div className="section-blog">
        <div className="section-blog--title">
          <h1>Blog</h1>
        </div>
        <div className="section-blog--mainGrid">
          <div className="section-blog--gridft">
            <ArticleCards data={allMarkdownRemark} />
          </div>
          <div className="section-blog--gridsec">
            <p>Welcome to page 2</p>
          </div>
        </div>
      </div>
    </Layout>
  )

  // return (
  // <div className="section-blog">
  //   <div className="section-blog--title">
  //     <h1>Blog</h1>
  //   </div>
  // {
  // // </div>
  // // <div className="section-blog--mainGrid">
  // //   <div className="section-blog--gridft">
  // //     <ArticleCard data={allMarkdownRemark} />
  // //   </div>
  // //   <div className="section-blog--gridsec">
  // //     <Aside data={allMarkdownRemark} />
  // //   </div>
  //   }
  // </div>
  //   )
}

const ArticleCards = ({ data }) =>
  data.edges.map((post) => {
    const { slug } = post.node.fields
    const { fluid } = post.node.frontmatter.cover.childImageSharp
    const { description, tags, date, title } = post.node.frontmatter
    const tagsArray = tags[0].split(" ")
    console.log(tagsArray)

    return (
      <div key={slug + "key"} className="article-card--wrapper">
        <div className="article-card--tags">
          {tagsArray.map((tag) => (
            <span>{tag}</span>
          ))}
        </div>
        <Image fluid={fluid} />
        <h1>{title}</h1>
        <span>{date}</span>
        <p>{description}</p>
        <button>
          <Link to={`article${slug}`}>Read More</Link>
        </button>
      </div>
    )
  })

const Aside = ({ data, tags }) => {
  return (
    <aside className="aside--container">
      <div className="aside--searchbox">
        <form>
          <input types="text" placeholder="search..." />
        </form>
      </div>
      <div className="aside--categories">tags sit here</div>
      <div className="aisde--latest">four latest blog posts goes here</div>
    </aside>
  )
}

export default BlogPage
