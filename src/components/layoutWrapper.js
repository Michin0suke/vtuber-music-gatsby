import React, { useState, cloneElement } from 'react'

export default ({ children }) => {
  const [videoPlayer, setVideoPlayer] = useState(null)

  const childrenWithProps = cloneElement(children, { setVideoPlayer })

  return (
        <div>
            {childrenWithProps}
            {videoPlayer}
        </div>
  )
}
