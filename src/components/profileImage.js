import React from 'react'
import Img from 'gatsby-image'
import ProfileImg from './svg/profile'

export default ({ artist, href, className, hoverEffect }) => {
    // if (!artist.name) {
    //     console.log('alt属性が設定されていません。', artist)
    // }
    return (
        <div className={`relative bg-white rounded-full shadow overflow-hidden ${className}`}>
            <ProfileImg color='#999' className='absolute top-0 left-0 right-0 bottom-0 m-auto w-3/5'/>
            { artist?.profile_image?.childImageSharp?.fluid &&
                <Img fluid={artist.profile_image.childImageSharp.fluid} alt={`${artist.name}さんのプロフィール画像`}/> }
            <div className={`absolute top-0 left-0 w-full h-full opacity-20 ${hoverEffect && 'sm:hover:bg-white'}`}/>
            {href && 
            <a href={href} target='_blank' className='absolute top-0 left-0 w-full h-full bg-white opacity-0 sm:hover:opacity-20 text-xs flex items-center justify-center whitespace-pre'>{href}</a>}
        </div>
    )
}