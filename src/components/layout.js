import React from "react"
import PropTypes from "prop-types"
import Header from "./header"
import Footer from "./footer"
import SMMenu from './smMenu'
import PCMenuLeft from './pcMenuLeft'

const Layout = ({ children, currentPage }) => (
  <div className='relative bg-gray-100' style={{minHeight: '100vh'}}>
    <Header/>
    <div className='flex'>
      <PCMenuLeft currentPage={currentPage}/>
      <div className='w-full'>
        <main className='max-w-screen-md mx-auto pb-24'>{children}</main>
      </div>
      <nav className='hidden xl:block w-1/4 z-10 bg-white' style={{minHeight: '100vh'}}></nav>
    </div>
    <Footer/>
    <SMMenu currentPage={currentPage}/>
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
