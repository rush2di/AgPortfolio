import PropTypes from "prop-types"
import React, { useState, useLayoutEffect } from "react"
import { Link } from "gatsby"
import ImagePalette from "react-image-palette"
import gsap from "gsap"

import arrow from "../assets/arrowmd.svg"
import { useScreenSpy } from "../utils/utils"

// Hero section wrapper component ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const Hero = ({ lastBlogPost = false, homeContent, socials }) => {
  const { instagram, facebook } = socials.edges[0].node.frontmatter
  const { introTxt } = homeContent.edges[0].node.frontmatter
  const { profileImg } = homeContent.edges[0].node.frontmatter

  return (
    <React.Fragment>
      <HeroContent
        txt={introTxt}
        img={profileImg}
        payload={lastBlogPost}
        instagram={instagram}
        facebook={facebook}
      />
    </React.Fragment>
  )
}

// Hero section content component ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const HeroContent = ({ txt, img, payload, instagram, facebook }) => {
  const [shadows, setShadows] = useState(false)
  const { width } = useScreenSpy()

  const grid = React.useRef()
  const title = React.useRef()
  const subTitle = React.useRef()
  const imageMask = React.useRef()
  const image = React.useRef()
  const introduction = React.useRef()

  useLayoutEffect(() => {
    let _SUBSCRIBED = true
    const animation = gsap
      .timeline({
        onComplete: () => {
          if (_SUBSCRIBED) setShadows(true)
        },
        delay: 1,
        defaults: { ease: "power3.out" },
      })
      .to(grid.current, { duration: 0.2, opacity: 1 })
      .from(title.current, {
        duration: 1,
        y: "100%",
      })
      .from(
        subTitle.current,
        {
          duration: 1,
          y: "100%",
        },
        "-=0.7"
      )
      .fromTo(
        imageMask.current,
        { x: "0%" },
        {
          duration: 1.5,
          x: "-100%",
          ease: "power3.inOut",
        }
      )
      .from(
        image.current,
        {
          duration: 1.5,
          scale: 1.3,
        },
        "-=1"
      )
      .from(".ft-grid-box", {
        duration: 1,
        y: -10,
        ease: "power3.out",
        opacity: 0,
        stagger: 0.2,
      })
    animation.play()
    return () => {
      _SUBSCRIBED = false
    }
  }, [])

  return (
    <div className="section-hero">
      <div ref={grid} className="section-hero--grid">
        <div className="hero-grid-one">
          <div className="hero-title-container">
            <div className="hero-title">
              <h1>
                <span ref={title}>Abderrahmane</span>
              </h1>
              <h1>
                <span ref={subTitle}>Grana</span>
              </h1>
            </div>
          </div>
          <p className="intro-text ft-grid-box" ref={introduction}>
            {txt}
          </p>
          {payload && <LastBlogPostCard payload={payload} />}
        </div>
        <div className={`hero-grid-two ${shadows ? "shadows-md" : ""}`}>
          <div className="hero-image-container">
            <div className="hero-image-mask">
              <img
                ref={image}
                src={img.childImageSharp ? img.childImageSharp.fluid.src : img}
                srcSet={img.childImageSharp ? img.childImageSharp.fluid.srcSet : ""}
                alt=""
              />
              <div className="hero-image-socials">
                {!!instagram && <a href={instagram}>instagram</a>}
                {!!facebook && <a href={facebook}>facebook</a>}
              </div>
              <div ref={imageMask} className="mask"></div>
            </div>
          </div>
        </div>
        <div className="hero-lastbp--sm">
          {width <= 665 && payload && <LastBlogPostCard payload={payload} />}
        </div>
      </div>
    </div>
  )
}

// LastBlogPostCard component ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const LastBlogPostCard = ({ payload }) => {
  const { title, description } = payload.frontmatter
  const { cover } = payload.frontmatter
  const { slug } = payload.fields

  const linkStyles = { width: "100%", display: "block", height: "100%" }

  return (
    <div className="hero-lastbp--container ft-grid-box">
      <h1>
        <span>
          Last Blog Post <img src={arrow} alt="" />
        </span>
      </h1>
      <ImagePalette image={src}>
        {({ backgroundColor, color, alternativeColor }) => {
          const bgImage = { backgroundImage: `url(${src})` }
          return (
            <div style={bgImage} className="hero-lastbp--card shadows-md">
              <Link style={linkStyles} to={`article/${cover.childImageSharp ? cover.childImageSharp.fluid.src : cover}`}>
                <div
                  style={{ backgroundColor: color }}
                  className="card-overlay"
                ></div>
                <div className="card-overlay-dark"></div>
                <div className="card-overlay-content">
                  <h3 style={{ color: backgroundColor }}>Latest blog post</h3>
                  <h3 style={{ color: backgroundColor }}>{title}</h3>
                  <p style={{ color: backgroundColor }}>{description}</p>
                </div>
              </Link>
            </div>
          )
        }}
      </ImagePalette>
    </div>
  )
}

export default Hero

// Prop-Types ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

Hero.propTypes = {
  siteTitle: PropTypes.string,
}

Hero.defaultProps = {
  siteTitle: ``,
}
