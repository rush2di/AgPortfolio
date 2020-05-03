import CMS from "netlify-cms-app"

import "../styles/styles.scss"
import ArticlePreview from "./previews/articlePagePreview"

CMS.registerPreviewTemplate("articles", ArticlePreview)
