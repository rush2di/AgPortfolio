import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"

const IndexPage = () => (
  <Layout>
    <div className="section-hero">
      <div className="section-hero--grid">
        <div className="hero-grid-one">
          <div className="hero-title-container">
            <div className="hero-title">
              <h1>
                <span>Abderrahmane</span>
              </h1>
              <h1>
                <span>Grana</span>
              </h1>
            </div>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod temaliqua, enim ad minim veniam
          </p>
        </div>
        <div className="hero-grid-two">
          <div className="hero-image-container">
            <div className="hero-image-mask">
              <div className="testImg"></div>
              <div className="testMask"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
