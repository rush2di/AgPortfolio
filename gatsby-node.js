const { fmImagesToRelative } = require("gatsby-remark-relative-images")
const { createFilePath } = require("gatsby-source-filesystem")
const createPaginatedPages = require("gatsby-paginate")
const path = require("path")

const makeRequest = (graphql, request) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(request).then((result) => {
        if (result.errors) {
          reject(result.errors)
        }
        return result
      })
    )
  })
}

exports.createPages = ({ graphql, actions: { createPage } }) => {
  const getBlogPosts = makeRequest(
    graphql,
    `
{
  allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "blog-post"}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        id
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
  `
  ).then((res) => {
    const posts = res.data.allMarkdownRemark.edges
    createPaginatedPages({
      edges: posts,
      createPage: createPage,
      pageTemplate: "src/templates/blogPage.js",
      pageLength: 4,
      pathPrefix: "/blog",
      context: {posts}
    })
    posts.forEach((edge) => {
      const { id, fields } = edge.node
      createPage({
        path: `/article${fields.slug}`,
        component: path.resolve("src/templates/articlePage.js"),
        context: { id },
      })
    })
  })

  return getBlogPosts
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node)

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, rules, loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules:
        stage === "build-html"
          ? [
              {
                test: /ScrollMagic/,
                use: loaders.null(),
              },
            ]
          : [],
    },
    resolve: {
      alias: {
        ScrollMagic: path.resolve(
          "node_modules",
          "scrollmagic/scrollmagic/uncompressed/ScrollMagic.js"
        ),
      },
    },
  })
}
