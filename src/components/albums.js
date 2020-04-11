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
    setActiveAlbumId(value)
  }

  useEffect(() => {
    // Set state subscription
    let _SUBSCRIBED = true
    // Function to set new data to state
    let newStateParser = (type, newData) => {
      if (error) setError(false)
      switch (type) {
        case "albums":
          setState([...newData])
          if (activeAlbumId === "") {
            setActiveAlbumId(newData[0].id)
          }
          break
        case "photoset":
          setState(newData)
          break
      }
    }

    // Fetch all albums initial info and titles
    const albumsFetcher = async () => {
      const res = await axios.get(albumsBaseUrl)
      const { photoset } = res.data.photosets
      const albumsMapper = photoset.map(item => {
        return { id: item.id, title: item.title._content, content: {} }
      })
      if (_SUBSCRIBED) newStateParser("albums", albumsMapper)
    }
    // Fetch all photosets of an album by it's ID
    const photosFetcher = async () => {
      const res = await axios.get(
        photosBaseUrl + "&photoset_id=" + activeAlbumId + userId
      )
      const { photo } = res.data.photoset
      const newState = state.map((item, i) => {
        if (item.id === activeAlbumId && item.content !== {}) {
          return { ...state[i], content: { ...photo } }
        }
        return item
      })
      if (_SUBSCRIBED) newStateParser("photoset", newState)
    }

    // Checking if state is empty to start feching data
    if (state.length === 0) {
      albumsFetcher().catch(() => setError(true))
    }
    if (activeAlbumId) {
      photosFetcher().catch(() => setError(true))
    }

    // Unsubscribe after component unmounts
    return () => (_SUBSCRIBED = false)
  }, [activeAlbumId])

  return (
    <React.Fragment>
      <AlbumsList
        data={state}
        activeAlbumId={activeAlbumId}
        albumSelectionHandle={albumSelectionHandle}
      />
    </React.Fragment>
  )
}

const AlbumsList = ({ data, albumSelectionHandle, activeAlbumId }) => {
  const selectionFilter = data.filter(item => item.id === activeAlbumId)
  //   console.log(selectionFilter)
  const categoriesMapper = data.map(item => {
    return (
      <li
        key={item.id}
        id={item.id}
        onClick={e => albumSelectionHandle(e.target.id)}
      >
        {item.title}
      </li>
    )
  })
  return (
    <div className="section-albums">
      <div className="section-albums--catcontainer">
        <div className="section-albums--catcontainer-items">
          <ul>{categoriesMapper}</ul>
        </div>
      </div>
      <div className="section-albums--photo-grid"></div>
    </div>
  )
}

export default Albums
