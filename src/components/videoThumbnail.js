import React from 'react'
import Img from 'gatsby-image'
import { Link } from 'gatsby'
import './videoThumbnail.css'

export default ({ video, to, withHoverLink, className }) => {
    if(!video.music?.title) {
        console.log('alt属性が設定されていません。', video)
    }
    return(
        <div className={`${className}`}>
            <div className='relative'>
                <div className='relative overflow-hidden' style={{ paddingBottom: '56.25%' }}>
                    <div className='absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <Img fluid={video.thumbnail_image?.childImageSharp?.fluid} className='w-full' alt={`${video.singers?.map(i=>i.name).join('&')}が歌う${video.music?.title}のサムネイル画像`}/>
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
}