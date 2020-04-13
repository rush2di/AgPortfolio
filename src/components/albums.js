import React, { useEffect, useState } from "react"
import axios from "axios"

const apiKey = "731f6d52097190e3d99faa37716978fd"
const userId = `&user_id=155026906@N08&format=json&nojsoncallback=1`
const albumsBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}${userId}`
const photosBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}`

const Albums = () => {
  const [state, setState] = useState([])
  const [activeAlbumId, setActiveAlbumId] = useState("")
  const [error, setError] = useState(false)

  const albumSelectionHandle = value => {
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

      const albumsMapper = photoset.map(item => {
        return { id: item.id, title: item.title._content, content: [] }
      })
      if (_SUBSCRIBED) newStateParser("albums", [...albumsMapper.swap(0, 1)])
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
      {!!activeAlbumId && (
        <AlbumsList
          data={state}
          activeAlbumId={activeAlbumId}
          albumSelectionHandle={albumSelectionHandle}
        />
      )}
    </React.Fragment>
  )
}

const AlbumsList = ({ data, albumSelectionHandle, activeAlbumId }) => {
  // assigning the selected album data to selectedAlbum variable
  const selectedAlbum = data.filter(item => item.id === activeAlbumId)
  const activeItem = React.useRef()
  const activeItemChildren = activeItem.current && activeItem.current.childNodes

  for (let node in activeItemChildren) {
    if (activeItemChildren[node].className) {
      activeItemChildren[node].className = ""
    }
    if (activeItemChildren[node].id === activeAlbumId) {
      activeItemChildren[node].className = "--active"
    }
    // else {
    // if (activeItemChildren[node].className) {
    //   activeItemChildren[node].className = ""
    // }
    // }
  }

  const categoriesMapper = data.map(item => {
    const { id, title } = item
    return (
      <li key={id} id={id} onClick={e => albumSelectionHandle(e.target.id)}>
        {title}
      </li>
    )
  })
  return (
    <div className="section-albums container">
      <div className="section-albums--catcontainer">
        <div className="section-albums--catcontainer-items">
          <ul ref={activeItem}>{categoriesMapper}</ul>
        </div>
      </div>
      <div className="section-albums--photo-grid">
        {selectedAlbum[0].content && (
          <PhotosGrid selectedAlbum={selectedAlbum[0]} />
        )}
      </div>
    </div>
  )
}

// Function that makes a check if there is data or no
// renders a tree columns gallery inspired by unsplash UI
const PhotosGrid = ({ selectedAlbum }) => {
  if (!!selectedAlbum.content.length) {
    const imagesPerGrid = (selectedAlbum.content.length / 3).toFixed()

    return (
      <React.Fragment>
        <div className="section-albums--grid-col">
          <AlbumColumn
            selectedAlbum={selectedAlbum}
            start={0}
            end={imagesPerGrid}
          />
        </div>
        <div className="section-albums--grid-col">
          <AlbumColumn
            selectedAlbum={selectedAlbum}
            start={imagesPerGrid}
            end={imagesPerGrid * 2}
          />
        </div>
        <div className="section-albums--grid-col">
          <AlbumColumn
            selectedAlbum={selectedAlbum}
            start={imagesPerGrid * 2}
            end={selectedAlbum.length}
          />
        </div>
      </React.Fragment>
    )
  } else {
    return <div>Loading...</div>
  }
}

// Function to map photosets into the parent column
const AlbumColumn = ({ selectedAlbum, start, end }) =>
  selectedAlbum.content.slice(start, end).map(photo => {
    const { server, secret, id } = photo
    return (
      <img
        key={id}
        src={`https://live.staticflickr.com/${server}/${id}_${secret}.jpg`}
        alt=""
      />
    )
  })

// Important for reordering categories of UI perposes
Array.prototype.swap = function(x, y) {
  var b = this[x]
  this[x] = this[y]
  this[y] = b
  return this
}

export default Albums
