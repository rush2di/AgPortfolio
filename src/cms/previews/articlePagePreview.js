import React, { Component } from "react"

import { ArticleTemplate } from "../../templates/articlePage"

class ArticlePreview extends Component {
	constructor(props) {
		super(props)
		this.state = {
			src: "",
		}
	}
	subscribed = true

	fetchAsset = () => {
		const path = this.props.entry.getIn(["data", "cover"])
		path &&
			this.props.getAsset(path).then(res => {
				if (this.subscribed) {
					this.setState({ src: res.toString() })
				}
			})
	}

	componentDidMount() {
		this.fetchAsset()
	}

	componentWillUnmount() {
		this.subscribed = false
	}

	componentDidUpdate(prevProps) {
		const prevPath = prevProps.entry.getIn(["data", "cover"])
		const path = this.props.entry.getIn(["data", "cover"])
		if (prevPath !== path || prevProps.getAsset !== this.props.getAsset) {
			this.fetchAsset()
		}
	}

	render() {
		const title = this.props.entry.getIn(["data", "title"])
		const date = this.props.entry.getIn(["data", "date"])
		const tags = this.props.entry.getIn(["data", "tags"])
		const html = this.props.widgetFor("body")
		const bgImage = this.state.src
		console.log(title, date, tags)
		return (
			<React.Fragment>
				<ArticleTemplate {...{title, date, tags, bgImage}} isPreview={true} >
					<div className="article_body">{html}</div>
				</ArticleTemplate>
			</React.Fragment>
		)
	}
}

export default ArticlePreview