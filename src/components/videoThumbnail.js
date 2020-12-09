import React from 'react'
import Img from 'gatsby-image'

export default ({ fluid, className }) => (
    <div className={`${className}`}>
        <div className='relative overflow-hidden' style={{ paddingBottom: '56.25%' }}>
            <div className='absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <Img fluid={fluid} className='w-full'/>
            </div>
        </div>
    </div>
)