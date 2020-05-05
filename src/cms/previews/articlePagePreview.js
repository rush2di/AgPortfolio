import React from "react"

import { ArticleTemplate } from "../../templates/articlePage"

const ArticlePreview = (props) => {
  const date = "day month year"
  const title = props.entry.getIn(["data", "title"])
  const tagsCheck = props.entry.getIn(["data", "tags"])
  const tags = tagsCheck ? tagsCheck.toJS() : ["tags go here"]
  const bgImage = props.entry.getIn(["data", "cover"])

  return (
    <React.Fragment>
      <div className="section">
        <ArticleTemplate {...{ title, tags, date, bgImage }} isPreview={true}>
          <div className="article_body">{props.widgetFor("body")}</div>
        </ArticleTemplate>
      </div>
    </React.Fragment>
  )
}

export default ArticlePreview
