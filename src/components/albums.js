import React, { useEffect, useState } from "react"
import axios from "axios"
import { preloadImages, arrayItemsSwap } from "../utils/utils"

const apiKey = "731f6d52097190e3d99faa37716978fd"
const userId = `&user_id=155026906@N08&format=json&nojsoncallback=1`
const albumsBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}${userId}`
const photosBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}`

const Albums = () => {
  const [state, setState] = useState([])
  const [activeAlbumId, setActiveAlbumId] = useState("")
  const [error, setError] = useState(false)

  const albumSelectionHandle = (value) => {
    if (value !== activeAlbumId) {
      setActiveAlbumId(value)
    }
  }

  useEffect(() => {
    // Set state subscription
    let _SUBSCRIBED = true
    // Function to set new data to state
    let newStateParser = (type, newData) => {
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
      const res = await axios.get(
        photosBaseUrl + "&photoset_id=" + activeAlbumId + userId
      )
      const { photo } = res.data.photoset
      const newState = state.map((item, i) => {
        if (item.id === activeAlbumId && item.content !== []) {
          return { ...state[i], content: [...photo] }
        }
        return item
      })
      if (_SUBSCRIBED) newStateParser("photoset", newState)
    }

    // Checking if state is empty to start feching data
    if (state.length === 0) {
      albumsFetcher().catch(() => setError(true))
    }
    // Checking if the first update is done to fetch data
    if (activeAlbumId) {
      photosFetcher().catch(() => setError(true))
    }

    // Unsubscribe when component is unmounting
    return () => {
      _SUBSCRIBED = false
    }
  }, [activeAlbumId])

  return (
    <React.Fragment>
      {error === false ? (
        !!activeAlbumId && (
          <AlbumsList
            data={state}
            activeAlbumId={activeAlbumId}
            albumSelectionHandle={albumSelectionHandle}
          />
        )
      ) : (
        <div>
          <p>
            Opps! something went wrong, please check your network and try again
          </p>
        </div>
      )}
    </React.Fragment>
  )
}

const AlbumsList = ({ data, albumSelectionHandle, activeAlbumId }) => {
  const [loading, setLoading] = useState(true)
  const selectedAlbum = data.filter((item) => item.id === activeAlbumId)
  const activeItem = React.useRef()
  const activeItemChildren = activeItem.current && activeItem.current.childNodes
  let imagesSrc = []

  for (let node in activeItemChildren) {
    if (activeItemChildren[node].className) {
      activeItemChildren[node].className = ""
    }
    if (activeItemChildren[node].id === activeAlbumId) {
      activeItemChildren[node].className = "--active"
    }
  }

  useState(() => {
    if (!!selectedAlbum[0].content.length) {
      imagesSrc = selectedAlbum[0].content.map(({ server, secret, id }) => {
        return `https://live.staticflickr.com/${server}/${id}_${secret}.jpg`
      })
      preloadImages(imagesSrc).done(() => {
        setLoading(false)
      })
    }

    return () => {
      setLoading(true)
    }
  }, [loading])

  return (
    <div className="section-albums container">
      <div className="section-albums--catcontainer">
        <div className="section-albums--catcontainer-items">
          <ul ref={activeItem}>
            <CategoriesMapper
              data={data}
              albumSelectionHandle={albumSelectionHandle}
            />
          </ul>
        </div>
      </div>
      <div className="section-albums--photo-grid">
        {loading ? <div>Loading...</div> : <PhotosGrid imagesSrc={imagesSrc} />}
      </div>
    </div>
  )
}

// Function that renders a three columns gallery inspired by unsplash UI
const PhotosGrid = ({ imagesSrc }) => {
  const imagesPerGrid = (imagesSrc.length / 3).toFixed()

  return (
    <React.Fragment>
      <div className="section-albums--grid-col">
        <AlbumColumn imagesSrc={imagesSrc} start={0} end={imagesPerGrid} />
      </div>
      <div className="section-albums--grid-col">
        <AlbumColumn
          imagesSrc={imagesSrc}
          start={imagesPerGrid}
          end={imagesPerGrid * 2}
        />
      </div>
      <div className="section-albums--grid-col">
        <AlbumColumn
          imagesSrc={imagesSrc}
          start={imagesPerGrid * 2}
          end={selectedAlbum.length}
        />
      </div>
    </React.Fragment>
  )
}

// Function to map photosets into the parent column
const AlbumColumn = ({ imagesSrc, start, end }) =>
  imagesSrc.slice(start, end).map((photo) => {
    return <img key={photo.substring(35, 45)} src={photo} alt="" />
  })

// Function to map albums categories
const CategoriesMapper = ({ data, albumSelectionHandle }) =>
  data.map(({ id, title }) => (
    <li key={id} id={id} onClick={(e) => albumSelectionHandle(e.target.id)}>
      {title}
    </li>
  ))

export default Albums
