import React from "react"
import { WhisperSpinner } from "react-spinners-kit"

const Loader = () => {
  return (
    <div className="container--loader">
      <WhisperSpinner
        size={50}
        backColor="#4d4d4d"
        color="#4d4d4d"
        frontColor="#4d4d4d"
        loading={true}
      />
    </div>
  )
}

export default Loader
