import React, { useEffect, useLayoutEffect, useState } from "react"
import Masonry from "react-masonry-component"
import ScrollMagic from "ScrollMagic"
import axios from "axios"
import gsap from "gsap"

import { preloadImages, arrayItemsSwap, usePrevious } from "../utils/utils"
import Loader from "./loader"

const apiKey = "731f6d52097190e3d99faa37716978fd"
const userId = `&user_id=155026906@N08&format=json&nojsoncallback=1`
const albumsBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}${userId}`
const photosBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}`
const sourceBaseUrl = "https://live.staticflickr.com/"

const Albums = () => {
  const [state, setState] = useState([])
  const [activeAlbumId, setActiveAlbumId] = useState("")
  const [error, setError] = useState(false)
  const [loadedImages, setLoadedImages] = useState(0)

  const albumSelectionHandle = (value) => {
    if (value !== activeAlbumId) setActiveAlbumId(value)
  }

  const newStateParser = (type, newData) => {
    switch (type) {
      case "albums":
        if (error) setError(false)
        setState(newData)
        if (!activeAlbumId) setActiveAlbumId(newData[0].id)
        break
      case "photoset":
        if (error) setError(false)
        setState(newData)
        break
      default:
        return null
    }
  }

  useLayoutEffect(() => {
    if (loadedImages === 3 && !error) {
      const controller = new ScrollMagic.Controller()
      const animation = gsap
        .timeline({ defaults: { ease: "power3.out", duration: 1 } })
        .from(".catList", { y: -10, opacity: 0, stagger: 0.2 })
        .from(".masonry", { opacity: 0 }, "+=0.1")

      animation.pause()

      new ScrollMagic.Scene({
        triggerElement: ".catList",
        duration: 0,
        triggerHook: 0.85,
        offset: 200,
      })
        .on("enter", (e) => {
          animation.play()
        })
        .addTo(controller)
    }
  }, [loadedImages, error])

  useEffect(() => {
    let _SUBSCRIBED = true
    let localData = JSON.parse(sessionStorage.getItem("state"))
    // Fetch all albums initial info and titles
    const albumsFetcher = async () => {
      const response = await axios.get(albumsBaseUrl)
      const { photoset } = response.data.photosets
      const photosets = photoset.map((item) => {
        return { id: item.id, title: item.title._content, content: [] }
      })
      const newPhotosets = arrayItemsSwap(photosets, 0, 1)

      if (_SUBSCRIBED) newStateParser("albums", [...newPhotosets])
    }
    // Fetch all photosets of an album by it's ID
    const photosFetcher = async () => {
      const data = await Promise.all(
        state.map(async ({ id }, i) => {
          const response = await axios.get(
            `${photosBaseUrl}&photoset_id=${id + userId}`
          )
          const { photo } = response.data.photoset
          const images = photo.map(({ server, secret, id }) => {
            return `${sourceBaseUrl + server}/${id}_${secret}.jpg`
          })
          preloadImages(images).done(() => {
            setLoadedImages((prevCount) => prevCount + 1)
          })
          return { ...state[i], content: [...images] }
        })
      )
      if (_SUBSCRIBED) {
        sessionStorage.setItem("state", JSON.stringify(data))
        newStateParser("photoset", data)
      }
    }

    const getDataFromFetchers = () => {
      if (!state.length) {
        albumsFetcher().catch(() => setError(true))
      } else if (state.length && !state[0].content.length) {
        photosFetcher().catch(() => setError(true))
      }
    }

    const getDatafromSessionStorage = () => {
      const images = localData.map((item) => item.content)
      preloadImages(images).done(() => {
        setState(localData)
        if (!activeAlbumId) setActiveAlbumId(localData[0].id)
        setLoadedImages(3)
      })
    }

    if (!!localData && !state.length) getDatafromSessionStorage()
    if (!localData) getDataFromFetchers()

    return () => {
      _SUBSCRIBED = false
    }
  }, [state, error])

  return (
    <React.Fragment>
      {error === false ? (
        loadedImages === 3 ? (
          <AlbumsList
            data={state}
            activeAlbumId={activeAlbumId}
            albumSelectionHandle={albumSelectionHandle}
          />
        ) : (
          <Loader />
        )
      ) : (
        <ErrorMessage />
      )}
    </React.Fragment>
  )
}

/*
 Albums component filters the albums depending user selection
 and pass it down to children masonry component
*/
const AlbumsList = ({ data, albumSelectionHandle, activeAlbumId }) => {
  const selectedAlbum = data.filter((item) => item.id === activeAlbumId)
  const activeItem = React.useRef()
  const activeItemChildren = activeItem.current && activeItem.current.childNodes

  for (let node in activeItemChildren) {
    if (activeItemChildren[node].className) {
      activeItemChildren[node].className = "catList"
    }
    if (activeItemChildren[node].id === activeAlbumId) {
      activeItemChildren[node].className = "catList --active"
    }
  }

  return (
    <div className="section-albums container">
      <div className="section-albums--catcontainer">
        <div className="section-albums--catcontainer-items">
          <ul ref={activeItem}>
            <Titles data={data} albumSelectionHandle={albumSelectionHandle} />
          </ul>
        </div>
      </div>
      <MasonryBox images={selectedAlbum[0].content} />
    </div>
  )
}

// Masonry style gallery component
const MasonryBox = ({ images }) => {
  const [showCarousel, setShowCarousel] = useState(false)
  const [imgCount, setImgCount] = useState(0)
  const [imgIndex, setImgIndex] = useState(0)
  const previousImages = usePrevious(images)

  const handleImageClick = (index) => {
    setImgIndex(index)
    setShowCarousel(true)
  }

  const handleHideCarousel = () => {
    setShowCarousel(false)
  }

  const handlePreviousBtn = () => {
    if (imgIndex !== 0) setImgIndex(imgIndex - 1)
    if (imgIndex === 0) setImgIndex(imgCount - 1)
  }

  const handleNextBtn = () => {
    if (imgIndex !== imgCount) setImgIndex(imgIndex + 1)
    if (imgIndex === imgCount - 1) setImgIndex(0)
  }

  const loadMoreImages = () => {
    if (imgCount + 8 > images.length) {
      setImgCount(images.length)
    } else {
      setImgCount((prevCount) => prevCount + 8)
    }
  }

  useEffect(() => {
    const sum = images.length > 10 ? (images.length / 3).toFixed() : 10
    if (!imgCount) setImgCount(parseInt(sum))
    if (previousImages !== images) {
      setImgCount(parseInt(sum))
    }
  })

  return (
    <React.Fragment>
      <PhotoCarousel
        images={images}
        imgIndex={imgIndex}
        showCarousel={showCarousel}
        handleHideCarousel={handleHideCarousel}
        handlePreviousBtn={handlePreviousBtn}
        handleNextBtn={handleNextBtn}
      />
      <Masonry className={"section-albums--masonry-wrapper masonry"}>
        <Gallery
          images={images}
          limit={imgCount}
          handleImageClick={handleImageClick}
        />
      </Masonry>
      {imgCount !== images.length && (
        <button className="btn--gray" onClick={loadMoreImages}>
          load more pictures
        </button>
      )}
    </React.Fragment>
  )
}

// PhotoCarousel component
const PhotoCarousel = ({
  images,
  imgIndex,
  showCarousel,
  handleHideCarousel,
  handlePreviousBtn,
  handleNextBtn,
}) => {
  return (
    showCarousel && (
      <div className="section-albums--carousel-wrapper">
        <div
          onClick={() => handleHideCarousel()}
          className="section-albums--carousel-bg"
        ></div>
        <div className="section-albums--carousel-image">
          <button onClick={() => handlePreviousBtn()}>prev</button>
          <img src={images[imgIndex]} alt="" />
          <button onClick={() => handleNextBtn()}>next</button>
        </div>
      </div>
    )
  )
}

// Gallery component maps images into the parenr Masonry component
const Gallery = ({ images, limit, handleImageClick }) =>
  images.slice(0, limit).map((photo, index) => {
    return (
      <img
        onClick={() => handleImageClick(index)}
        className="section-albums--masonry-image"
        key={photo.substring(35, 45)}
        src={photo}
        alt=""
      />
    )
  })

// Titles component maps categories titles
const Titles = ({ data, albumSelectionHandle }) =>
  data.map(({ id, title }, index) => (
    <li
      key={id}
      id={id}
      className={!index ? "catList --active" : "catList"}
      onClick={(e) => albumSelectionHandle(e.target.id)}
    >
      {title}
    </li>
  ))

// Error message component in case data fetching failed
const ErrorMessage = () => (
  <div className="container--error-message">
    <p>Opps! something went wrong, please check your network and try again</p>
  </div>
)

export default Albums
