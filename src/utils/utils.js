// function to preload fetched images
export const preloadImages = (arr) => {
  let newImages = []
  let loadedimages = 0
  let postAction = () => {}
  const arr = typeof arr != "object" ? [arr] : arr
  const imagePostLoad = () => {
    loadedimages++
    if (loadedimages === arr.length) postAction(newImages)
  }
  for (let i in arr) {
    newImages[i] = new Image()
    newImages[i].src = arr[i]
    newImages[i].onload = () => {
      imagePostLoad()
    }
    newImages[i].onerror = () => {
      imagePostLoad()
    }
  }
  return {
    done: (callback) => {
      postAction = callback || postAction
    },
  }
}
