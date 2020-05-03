import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react"

// function to preload fetched images ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const preloadImages = (arr) => {
  let newImages = []
  let loadedimages = 0
  let postAction = () => {}
  arr = typeof arr != "object" ? [arr] : arr
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

// Important function for re-ordering categories of albums ///////////////////
/////////////////////////////////////////////////////////////////////////////

export const arrayItemsSwap = (array, firstIndex, secondIndex) => {
  let firstItem = array[firstIndex]
  array[firstIndex] = array[secondIndex]
  array[secondIndex] = firstItem
  return array
}

/*//////////////////////////////////////////////////////////////////////////////
////////////////////////////:: CUSTOM HOOKS :://///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
*/

/* 
Costum hook to save a giving value before an update
happens on the component
*/

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

/*
 useSwibableList hook checks the screen width size
and apply swipable scroll behaviour on smaller screens
*/

export const useSwipableList = (slider) => {
  const { width } = useScreenSpy(950)
  let isDown = false
  let startX
  let scrollLeft

  const handleMouseDown = (e) => {
    isDown = true
    slider.current.classList.add("--slider-active")
    startX = e.pageX - slider.current.offsetLeft
    scrollLeft = slider.current.scrollLeft
  }

  const handleMouseUp = () => {
    isDown = false
    slider.current.classList.remove("--slider-active")
  }

  const handleMouseLeave = () => {
    isDown = false
    slider.current.classList.remove("--slider-active")
  }

  const handleMouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - slider.current.offsetLeft
    const walk = (x - startX) * 1.5
    slider.current.scrollLeft = scrollLeft - walk
  }

  if (width <= 950) {
    return {
      onMouseDown: (e) => {
        handleMouseDown(e)
      },
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onMouseMove: (e) => {
        handleMouseMove(e)
      },
    }
  }
  return
}

/*
 useScreenSpy hook checks the window screen width on first 
 mount and after every window resize event and returns it value
*/

const ScreenSpy = createContext(500)

export const ScreenSpyProvider = ({ children }) => {
  const [dimensions, setDimensions] = useState({ width: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
      })
    }
    if (dimensions.width === 0) handleResize()

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <ScreenSpy.Provider value={dimensions}>{children}</ScreenSpy.Provider>
}

export const useScreenSpy = () => useContext(ScreenSpy)


//  useIsMounted hook checks if a component is mounted 
// export const useIsMounted = () => {
//   const isMounted = useRef(false);
//   useEffect(() => {
//     isMounted.current = true;
//     return () => isMounted.current = false;
//   }, []);
//   return isMounted;
// };
