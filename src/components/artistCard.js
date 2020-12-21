import React from 'react'
import { Link } from 'gatsby'
import ProfileImg from './profileImage'

export default ({ artist, className, noLink, roleText, withRuby, imgSize }) => {
    if (artist.id === 'unknown') {
        return <div className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>{roleText}：不明</div>
    }

    const imageSize = imgSize || 14

    const innerElement = (
        <div className='flex items-center'>
            { roleText && <span className='mr-3 text-md'>{roleText}：</span> }
            <ProfileImg artist={artist} className={`flex-shrink-0 w-${imageSize} h-${imageSize}`} style={{width: imgSize, height: imgSize}}/>
            <span className='pl-5 text-md'>
                {artist.name}{withRuby && artist.name_ruby && `（${artist.name_ruby}）`}
            </span>
        </div>
    )
    
    if (noLink) {
        return (
            <div className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>
                {innerElement}
            </div>
        )
    } else {
        return (
            <div className={`py-2 px-5 rounded-md text-gray-800 hover:bg-gray-200 ${className}`}>
                <Link to={`/artist/${artist.id}`}>
                    {innerElement}
                </Link>
            </div>
        )
    }
}