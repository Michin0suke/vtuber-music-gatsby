import React, { cloneElement, useState } from "react"
// import { Link } from "gatsby"
// import VtuberMusic from './svg/vtuberMusic'
import Header from "./header"
import Footer from "./footer"
import SMMenu from './smMenu'
import PCMenuLeft from './pcMenuLeft'
// import Headroom from 'react-headroom'

// const playerClassNameStyle={
//   videoPage: `z-50 fixed sm:absolute mx-auto sm:left-0 sm:right-0 w-full max-w-4xl mb-2`,
//   otherPage: `z-50 fixed left-0 bottom-12 sm:bottom-0 w-1/2 sm:w-full max-w-sm`
// }

export default ({ children, path }) => {
  const [videoPlayer, setVideoPlayer] = useState(null)

  const childrenWithProps = cloneElement(children, { setVideoPlayer })

  return (
    <div className='relative min-h-screen'>
      <Header/>
      <div className='flex w-full'>
        <PCMenuLeft path={path}/>
        <div className='w-full' style={{ minHeight: '100vh' }}>
          <main className={`relative flex w-full h-full bg-white sm:bg-gray-50 ${path?.split('/')[1] === 'video' ? 'video-page' : 'not-video-page'}`}>
            {videoPlayer}
            {childrenWithProps}
          </main>
          <Footer/>
        </div>
      </div>
      <SMMenu path={path}/>
    </div>
  )
}
