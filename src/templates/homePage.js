import React, { useEffect, useState } from "react"
import axios from "axios"

import Hero from "../components/hero"

const apiKey = "731f6d52097190e3d99faa37716978fd"
const userId = `&user_id=155026906%40N08&format=json&nojsoncallback=1`
const albumsBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}${userId}`
const photosBaseUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}`



const HomePage = () => {
  const [state, setState] = useState([])
  const [activeAlbumId, setActiveAlbumId] = useState("")
  const [error, setError] = useState(false)
  // const [idChanged, setChange] = useState(false)

  useEffect(() => {
    let subscribed = true
    const albumsFetcher = async () => {
      const res = await axios.get(albumsBaseUrl)
      const { photoset } = res.data.photosets
      const albumsMapper = photoset.map(item => {
        return { id: item.id, title: item.title._content, content: {} }
      })
      if (subscribed) {
        setState([...albumsMapper])
        if (activeAlbumId === "") {
          setActiveAlbumId(albumsMapper[0].id)
        }
        if (error) setError(false)
      }
    }
    const photosFetcher = async () => {
      const res = await axios.get(photosBaseUrl + activeAlbumId + userId)
      const { photo } = res.data.photoset
      console.log(res)
      const newState = state.map(item => {
        if (item.id === activeAlbumId && item.content.length === 0) {
          item.content = { ...photo }
          return item
        }
      })
      console.log(newState)
      if (subscribed) {
        setState(newState)
        if (error) setError(false)
      }
    }

    if (state.length === 0) {
      albumsFetcher().catch(() => {
        setError(true)
      })
    }

    if (idChanged) {
      photosFetcher().catch(() => {
        setError(true)
      })
    }

    return () => {
      subscribed = false
    }
  }, [activeAlbumId])

  console.log(state, activeAlbumId, error)
  return <div>test</div>
}

export default HomePage
