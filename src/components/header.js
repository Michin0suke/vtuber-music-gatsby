import React from "react"
import { Link } from "gatsby"
import VtuberMusic from './svg/vtuberMusic'

const Header = () => (
  <div>
    <header className='fixed top-0 left-0 w-full h-12 z-50 shadow-sm bg-white'>
      <div className='py-3 px-5 md:px-5 h-full'>
        <Link to="/">
          <VtuberMusic className='h-full'/>
        </Link>
      </div>
    </header>
    <div className='h-12'/>
  </div>
)

export default Header
