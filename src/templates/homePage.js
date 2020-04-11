import React, { useEffect, useState } from "react"
import axios from "axios"

import Hero from "../components/hero"
import Albums from "../components/albums"

const HomePage = () => {
  return (
    <React.Fragment>
      <Hero />
      <Albums />
    </React.Fragment>
    )
}

export default HomePage