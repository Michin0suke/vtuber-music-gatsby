import React, { cloneElement, useState, useEffect } from "react"
import { useStaticQuery, graphql } from 'gatsby'
import Header from "./header"
import Footer from "./footer"
import SMMenu from './smMenu'
import PCMenuLeft from './pcMenuLeft'

export default (props) => {
  const { children } = props
  const path = props.location.pathname
  const [videoPlayer, setVideoPlayer] = useState(null)

  const allSinger = useStaticQuery(graphql`
      {
        allSinger:allArtist(filter: {is_singer: {eq: true}}) {
          nodes {
              singer_videos {
                  id
                  singers {
                      id
                  }
              }
          }
        }
      }
    `).allSinger.nodes

  const childrenWithProps = cloneElement(children, { setVideoPlayer, allSinger })

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