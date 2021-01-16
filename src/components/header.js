import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import VtuberMusic from './svg/vtuberMusic'
// import Headroom from 'react-headroom'
// import './header.css'

const Header = () => {
  // const [isHidden, setIsHidden] = useState(false)
  // const [lastPos, setLastPos] = useState(0)
  // const [pos, setPos] = useState(0)
  
  // useEffect(() => {
  //   window.addEventListener('scroll', e => {
  //     setPos(window.scrollY)
  //     onScroll()
  //   })
  // })

  // const onScroll = () => {
  //   if (pos > 100 && pos > lastPos) {
  //     setIsHidden(true)
  //   } else if (pos < 100 || pos < lastPos) {
  //     setIsHidden(false)
  //   }
  //   setLastPos(pos)
  // }

  return (
    // <div className={`header-wrapper ${isHidden && 'unpinned'}`}>
    <div>
      <header className='fixed top-0 left-0 w-full h-10 z-50 shadow-sm bg-white'>
        <div className='py-2 px-5 md:px-5 h-full'>
          <Link to="/">
            <h1 className='absolute w-0.5 h-0.5 overflow-hidden'>Vtuber Music</h1>
            <VtuberMusic className='h-full'/>
          </Link>
        </div>
      </header>
      <div className='h-10'/>
    </div>
    // <Headroom>Head</Headroom>
  )
}

export default Header
