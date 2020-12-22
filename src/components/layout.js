import React from "react"
import PropTypes from "prop-types"
import Header from "./header"
import Footer from "./footer"
import SMMenu from './smMenu'
import PCMenuLeft from './pcMenuLeft'

const Layout = ({ children, currentPage }) => (
  <div className='relative min-h-screen'>
    <Header/>
    <div className='flex w-full'>
      <PCMenuLeft currentPage={currentPage}/>
      <main className='w-full pb-16 z-20 gb-white lg:bg-gray-50'>
        {children}
        <Footer/>
      </main>
      {/* <nav className='hidden xl:block w-1/4 z-10 bg-white' style={{minHeight: '100vh'}}></nav> */}
    </div>
    <SMMenu currentPage={currentPage}/>
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
