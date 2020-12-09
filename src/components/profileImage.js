import React from 'react'
import Img from 'gatsby-image'
import ProfileImg from './svg/profile'

export default ({ fluid, className }) => (
    <div className={`relative bg-white rounded-full shadow overflow-hidden ${className}`}>
        <ProfileImg color='#999' className='absolute top-0 left-0 right-0 bottom-0 m-auto w-3/5'/>
        { fluid && <Img fluid={fluid}/> }
        <div className='absolute top-0 left-0 w-full h-full opacity-20 hover:bg-white'/>
    </div>
)