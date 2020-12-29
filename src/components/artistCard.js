import React from 'react'
import { Link } from 'gatsby'
import ProfileImg from './profileImage'

export default ({ artist, className, noLink, roleText, withRuby, imgSize, withParent, withVideoCount }) => {
    if (artist.id === 'unknown') {
        return <div className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>{roleText}：不明</div>
    }

    const imageSize = imgSize || 14

    const innerElement = (
        <li className='flex items-center'>
            { roleText && <span className='whitespace-nowrap mr-3 text-md'>{roleText}：</span> }
            <ProfileImg artist={artist} className={`flex-shrink-0 w-${imageSize} h-${imageSize}`} style={{width: imgSize, height: imgSize}}/>
            <h2 className='pl-5 w-full text-md relative'>
                {withParent && artist.parents.length > 0 && <span className='absolute w-full -top-4 text-xs text-gray-400'>{artist.parents[0].name}</span>}
                {withVideoCount && artist.singer_videos.length > 0 && <span className='absolute w-full -bottom-4 text-xs text-gray-400'>{`${artist.singer_videos.length}本の動画`}</span>}
                {artist.name}{withRuby && artist.name_ruby && `（${artist.name_ruby}）`}
            </h2>
        </li>
    )
    
    if (noLink) {
        return (
            <ul className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>
                {innerElement}
            </ul>
        )
    } else {
        return (
            <ul className={`py-2 px-5 rounded-md text-gray-800 hover:bg-gray-200 ${className}`}>
                <Link to={`/artist/${artist.id}`}>
                    {innerElement}
                </Link>
            </ul>
        )
    }
}