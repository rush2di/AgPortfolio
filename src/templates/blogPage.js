import React, { useState } from "react"
import Masonry from "react-masonry-component"
import Autosuggest from "react-autosuggest"
import { Link, navigate } from "gatsby"
import PropTypes from "prop-types"
import Image from "gatsby-image"

import Pagination from "../components/pagination"

// Blog Page wrapper component
const BlogPage = ({ pageContext }) => {
  const { group, first, last, index, pageCount, posts } = pageContext
  return (
    <React.Fragment>
      <div className="section-blog">
        <div className="section-blog--main">
          <MasonryBox data={group} posts={posts} />
          <Pagination
            first={first}
            last={last}
            index={index}
            pageCount={pageCount}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

// Masonry main section content wrapper
const MasonryBox = ({ data, posts }) => {
  const slicedPosts = () => {
    return data.length > 6 ? [...data].splice(0, 6) : [...data]
  }
  return (
    <Masonry>
      <ArticleCards data={[...data].splice(0, 2)} />
      <Aside slicedPosts={slicedPosts()} data={posts} />
      {data.length > 2 && <ArticleCards data={[...data].splice(2)} />}
    </Masonry>
  )
}

// Blog article cards mapper
const ArticleCards = ({ data }) =>
  data.map((post) => {
    const { slug } = post.node.fields
    const { fluid } = post.node.frontmatter.cover.childImageSharp
    const { description, tags, date, title } = post.node.frontmatter
    const tagsArray = tags[0].split(" ")

    return (
      <Link
        key={slug + "key"}
        className="article-card--link"
        to={`article${slug}`}
      >
        <div className="article-card--wrapper">
          <Image fluid={fluid} style={{ height: 215 }} />
          <div className="article-card--info">
            <div className="article-card--tags">
              {tagsArray.map((tag, index) => (
                <span key={`${title}_tag_${index}`}>{tag}</span>
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

// Aside section warapper component
const Aside = ({ slicedPosts, data }) => {
  return (
    <aside className="aside--container">
      <div className="aside--card-wrapper">
        <h1>Latest</h1>
        <LatestPosts data={slicedPosts} />
      </div>
      <div className="aside--search-box">
        <h1>Search</h1>
        <div className="aside--search-input">
          <SearchBox data={data} />
        </div>
      </div>
    </aside>
  )
}

// Aside lastest posts component
const LatestPosts = ({ data }) =>
  data.map((post, index) => {
    const styles = { height: 70, width: 75, margin: 3 }
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

// Aside search box component
const SearchBox = ({ data }) => {
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const postsData = data.map((post) => {
    const { tags, title } = post.node.frontmatter
    const { slug } = post.node.fields
    const tagsArray = tags[0].split(" ")

    return {
      name: title,
      slug: slug,
      tags: tagsArray,
    }
  })

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0
      ? []
      : postsData.filter((post) => {
          return (
            post.name.search(inputValue) !== -1 ||
            post.tags.includes(inputValue)
          )
        })
  }

  const getSuggestionValue = (suggestion) => {
    return suggestion.name
  }

  const renderSuggestion = (suggestion) => {
    return suggestion.name
  }

  const handleChange = (_, { newValue }) => {
    setValue(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    setValue(value)
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const onSuggestionSelected = (_, { suggestion }) => {
    navigate(`article${suggestion.slug}`)
  }

  const inputProps = {
    placeholder: "search",
    value,
    onChange: handleChange,
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      onSuggestionSelected={onSuggestionSelected}
      multiSection={false}
    />
  )
}

export default BlogPage

// Prop-Types
BlogPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
}

MasonryBox.propTypes = {
  data: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
}

ArticleCards.propTypes = {
  data: PropTypes.array.isRequired,
}

Aside.propTypes = {
  data: PropTypes.array.isRequired,
  slicedPosts: PropTypes.array.isRequired,
}

LatestPosts.propTypes = {
  data: PropTypes.array.isRequired,
}

SearchBox.propTypes = {
  data: PropTypes.array.isRequired,
}
