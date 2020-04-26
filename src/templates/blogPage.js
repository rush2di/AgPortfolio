import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"
import Masonry from "react-masonry-component"

import Layout from "../components/layout"

const BlogPage = (props) => {
  const { group } = props.pageContext


  console.log(props)

  return (
    <Layout>
      <div className="section-blog">
        <div className="section-blog--title">
          <h1>Blog</h1>
        </div>
        <div className="section-blog--main">
          <MasonryBox data={group} />
        </div>
      </div>
    </Layout>
  )
}

const MasonryBox = ({data}) => {
  const slicedPosts = () => {
    return data.length > 6 ? [...data].splice(0,6) : [...data]
  }

  return (
    <Masonry>
      <ArticleCards data={[...data].splice(0,2)} />
      <aside className="aside--container">
        <div className="aside--card-wrapper">
          <h1>Latest</h1>
          <LatestPosts data={slicedPosts()} />
        </div>
      </aside>
      {data.length > 2 && <ArticleCards data={[...data].splice(2)} />}
    </Masonry>
    )

}

const ArticleCards = ({ data }) =>
  data.map((post) => {
    const { slug } = post.node.fields
    const { fluid } = post.node.frontmatter.cover.childImageSharp
    const { description, tags, date, title } = post.node.frontmatter
    const tagsArray = tags[0].split(" ")

    return (
      <Link key={slug + "key"} className="article-card--link" to={`article${slug}`}>
        <div className="article-card--wrapper">        
          <Image fluid={fluid} />
          <div className="article-card--info">
            <div className="article-card--tags">
              {tagsArray.map((tag, index) => (
                <span key={`${title}_tag_${index}`}>
                  {tag}
                </span>
              ))}
            </div>          
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="article-card--footer">
            <span>{date}</span>
            <button>
              <span>Read More</span>
            </button>
          </div>
        </div>
      </Link>
    )
  })

const LatestPosts = ({ data, tags }) => 
  data.map((post,index) => {
    const styles = {height: 70, width: 75, margin: 3}
    const { fluid } = post.node.frontmatter.cover.childImageSharp
    const { date, title } = post.node.frontmatter
    const { slug } = post.node.fields
    return (
    <Link key={`lastest${index}`} to={`article${slug}`}>
      <div className="aside--post-box">        
        <Image fluid={fluid} style={styles} />
        <div className="aside--inside-box">
          <span>{title}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
    )
  })

export default BlogPage
