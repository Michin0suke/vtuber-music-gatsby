import React from 'react'
import Img from 'gatsby-image'
import { Link } from 'gatsby'
import './videoThumbnail.css'

export default ({ fluid, to, withHoverLink, className }) => (
    <div className={`${className}`}>
        <div className='relative'>
            <div className='relative overflow-hidden' style={{ paddingBottom: '56.25%' }}>
                <div className='absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <Img fluid={fluid} className='w-full'/>
                </div>
            </div>
            {withHoverLink && 
                <Link to={to} className='absolute top-0 right-0 bottom-0 left-0 opacity-0 hover:opacity-100 w-full h-full'>
                    <div className='relative flex items-center justify-center w-full h-full'>
                        <span className='absolute bg-black opacity-20 w-full h-full'></span>
                        <span className='rightArrow opacity-90'></span>
                    </div>
                </Link>
            }
        </div>
    </div>
)