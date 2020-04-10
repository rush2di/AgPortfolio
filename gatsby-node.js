const { fmImagesToRelative } = require("gatsby-remark-relative-images")
const { createFilePath } = require("gatsby-source-filesystem")
// const axios = require("axios")

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

// const url =
//   "https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=731f6d52097190e3d99faa37716978fd&photoset_id=72157713767713111&user_id=155026906%40N08&format=json&nojsoncallback=1"
// const albumUrl =
//   "https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=731f6d52097190e3d99faa37716978fd&user_id=155026906%40N08&format=json&nojsoncallback=1"

// let albumsFetcher = async () => {
//   const res = await axios.get(albumUrl)
//   console.log("albums", res.data.photosets.photoset)
// }
// let photosetFetcher = async () => {
//   const res = await axios.get(url)
//   console.log(res.data.photoset.photo)
// }
// albumsFetcher()
// photosetFetcher()

// imgSrc = https://live.staticflickr.com/${server}/${id}_${secret}.jpg
