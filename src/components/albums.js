import React, { useEffect, useLayoutEffect, useState } from "react"
import Masonry from "react-masonry-component"
import ScrollMagic from "ScrollMagic"
import axios from "axios"
import gsap from "gsap"

import { preloadImages, arrayItemsSwap } from "../utils/utils"
import Loader from "./loader"

const apiKey = "731f6d52097190e3d99faa37716978fd"
const userId = `&user_id=155026906@N08&format=json&nojsoncallback=1`
const albumsBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}${userId}`
const photosBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}`

const Albums = () => {
  const [state, setState] = useState([])
  const [activeAlbumId, setActiveAlbumId] = useState("")
  const [error, setError] = useState(false)
  const [loadedImages, setLoadedImages] = useState(0)

  const albumSelectionHandle = (value) => {
    if (value !== activeAlbumId) setActiveAlbumId(value)
  }

  // Function to setstate after fetching new data
  const newStateParser = (type, newData) => {
    if (error) setError(false)
    switch (type) {
      case "albums":
        setState(newData)
        if (activeAlbumId === "") {
          setActiveAlbumId(newData[0].id)
        }
        break
      case "photoset":
        setState(newData)
        break
      default:
        return null
    }
  }

  useLayoutEffect(() => {    
  const controller = new ScrollMagic.Controller()
  
    if (loadedImages === 3 && !error) {
      const onEnterAnimation = gsap
        .timeline({ defaults: { ease: "power3.out", duration: 1 } })
        .from(".catList", { y: -10, opacity: 0, stagger: 0.2 })
        .from(".section-albums--masonry-wrapper", { opacity: 0 }, "+=0.1")

      onEnterAnimation.pause()

      new ScrollMagic.Scene({
        triggerElement: ".catList",
        duration: 0,
        triggerHook: 0.85,
        offset: 200,
      })
        .on("enter", (e) => {
          onEnterAnimation.play()
        })
        .addTo(controller)
    }
  }, [loadedImages, error])

  useEffect(() => {
    let _SUBSCRIBED = true
    let localData = sessionStorage.getItem("state")
    let parsedLocalData = JSON.parse(localData)

    // Fetch all albums initial info and titles
    const albumsFetcher = async () => {
      const res = await axios.get(albumsBaseUrl)
      const { photoset } = res.data.photosets
      const albumsMapper = photoset.map((item) => {
        return { id: item.id, title: item.title._content, content: [] }
      })
      const orderedAlbums = arrayItemsSwap(albumsMapper, 0, 1)

      if (_SUBSCRIBED) newStateParser("albums", [...orderedAlbums])
    }

    // Fetch all photosets of an album by it's ID
    const photosFetcher = async () => {
      const res = await Promise.all(
        state.map(async ({ id }, i) => {
          const url = photosBaseUrl + "&photoset_id=" + id + userId
          const albumPhotoset = await axios.get(url)
          const { photo } = albumPhotoset.data.photoset
          const imagesSrc = photo.map(({ server, secret, id }) => {
            return `https://live.staticflickr.com/${server}/${id}_${secret}.jpg`
          })
          preloadImages(imagesSrc).done(() => {
            setLoadedImages((prevCount) => prevCount + 1)
          })
          return { ...state[i], content: [...imagesSrc] }
        })
      )

      if (_SUBSCRIBED) {
        sessionStorage.setItem("state", JSON.stringify(res))
        newStateParser("photoset", res)
      }
    }

    // checking if sessionStorage is empty to fetch needed data
    if (!parsedLocalData) {
      if (state.length === 0) {
        albumsFetcher().catch(() => setError(true))
      } else if (state.length && state[0].content.length === 0) {
        photosFetcher().catch(() => setError(true))
      }
    }
    // checking if state is empty to set it to data saved on sessionStorage
    if (!!parsedLocalData && !state.length) {
      const imagesSrc = parsedLocalData.map((item) => item.content)
      preloadImages(imagesSrc).done(() => {
        setState(parsedLocalData)
        if (activeAlbumId === "") setActiveAlbumId(parsedLocalData[0].id)
        setLoadedImages(3)
      })
    }
    // Unsubscribe when component is unmounting
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
      <MasonryBox imagesSrc={selectedAlbum[0].content} />
    </div>
  )
}

// Function that renders a Masonry gallery
const MasonryBox = ({ imagesSrc }) => {
  return (
    <React.Fragment>
      <Masonry className={"section-albums--masonry-wrapper"}>
        <Gallery imagesSrc={imagesSrc} start={0} end={imagesSrc.length} />
      </Masonry>
    </React.Fragment>
  )
}

// Function to map photosets into the Masonry gallery
const Gallery = ({ imagesSrc, start, end }) =>
  imagesSrc.slice(start, end).map((photo) => {
    return (
      <img className="imgy" key={photo.substring(35, 45)} src={photo} alt="" />
    )
  })

// Function to map categories title
const Titles = ({ data, albumSelectionHandle }) =>
  data.map(({ id, title }, i) => (
    <li
      key={id}
      id={id}
      className={i === 0 ? "catList --active" : "catList"}
      onClick={(e) => albumSelectionHandle(e.target.id)}
    >
      {title}
    </li>
  ))

const ErrorMessage = () => (
  <div>
    <p>Opps! something went wrong, please check your network and try again</p>
  </div>
)

export default Albums
