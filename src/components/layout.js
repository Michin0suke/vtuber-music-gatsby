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
  // const [playerClassName, setPlayerClassName] = useState(playerClassNameStyle.videoPage)

  // default: `z-50 fixed sm:absolute mx-auto sm:left-0 sm:right-0 w-full max-w-4xl mb-2`

  // others: `z-50 fixed left-0 bottom-12 sm:bottom-0 w-1/2 sm:w-full max-w-sm`

  // const childrenWithProps = React.Children.map(
  //   children,
  //   (child) => {
  //     console.info(typeof child, child)

  //     switch (typeof child) {
  //       case 'string':
  //         // 子要素がテキストノードだった場合はそのまま return
  //         return child

  //       case 'object':
  //         // React要素だった場合は newProps を渡す
  //         return React.cloneElement(child, { setVideo })

  //       default:
  //         // それ以外の場合はとりあえず null 返しとく
  //         return null
  //     }
  //   }
  // )

  const childrenWithProps = cloneElement(children, { setVideoPlayer })

  return (
    <div className='relative min-h-screen'>
      <Header/>
      <div className='flex w-full'>
        <PCMenuLeft path={path}/>
        <main className={`z-10 relative w-full gb-white sm:bg-gray-50 ${path?.split('/')[1] === 'video' ? 'video-page' : 'not-video-page'}`}>
          {videoPlayer}
          {childrenWithProps}
        </main>
        {/* <nav className='hidden xl:block w-1/4 z-10 bg-white' style={{minHeight: '100vh'}}></nav> */}
      </div>
      <SMMenu path={path}/>
      {/* <Footer/> */}
    </div>
  )
}
