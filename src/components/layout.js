import React, { cloneElement, useState } from "react"
import Header from "./header"
import Footer from "./footer"
import SMMenu from './smMenu'
import PCMenuLeft from './pcMenuLeft'

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