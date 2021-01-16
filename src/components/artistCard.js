import React from 'react'
import { Link } from 'gatsby'
import ProfileImg from './profileImage'

const size = {
    md: {
        img: 14
    },
    lg: {
        img: 16
    },
    xl: {
        img: 20
    }
}

const artistCard = ({ artist, className, noLink, roleText, withRuby, cardSize, withParent, withVideoCount }) => {

    if (cardSize && !['md', 'lg', 'xl'].includes(cardSize)) throw new Error('augment size is invalid.')

    if (withParent && roleText) throw new Error('withParentとroleTextは同時に指定できません。')

    if (artist.id === 'unknown') {
        return <div className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>{roleText}：不明</div>
    }

    const innerElement = (
        <li className='flex items-center'>
            {/* { roleText && <span className='whitespace-nowrap mr-3 py-1 px-2 text-md border-2 border-red-600 rounded'>{roleText}：</span> } */}
            <ProfileImg artist={artist} className={`flex-shrink-0 w-${size[cardSize].img} h-${size[cardSize].img}`}/>
            <h2 className={`relative pl-5 w-full text-${cardSize}`}>
                { roleText && <span className='absolute w-full -top-4 text-xs text-gray-700'>{roleText}</span> }
                { withParent && artist.parents.length > 0 && <span className='absolute w-full -top-4 text-xs text-gray-400'>{artist.parents[0].name}</span> }
                { withVideoCount && artist.singer_videos.length > 0 && <span className='absolute w-full -bottom-4 text-xs text-gray-400'>{`${artist.singer_videos.length}本の動画`}</span> }
                { artist.name }
                { withRuby && artist.name_ruby && `（${artist.name_ruby}）` }
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
            <ul className={`py-2 px-5 rounded-md text-gray-800 sm:hover:bg-gray-200 ${className}`}>
                <Link to={`/artist/${artist.id}`}>
                    {innerElement}
                </Link>
            </ul>
        )
    }
}

artistCard.defaultProps = {
    cardSize: 'md'
}

export default artistCard