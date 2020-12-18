import React from 'react'
import { Link } from 'gatsby'
import ProfileImg from './profileImage'

export default ({ artist, className, noLink, roleText, withRuby, withSexColor }) => {
    if (artist.id === 'unknown') {
        return <div className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>{roleText}：不明</div>
    }

    let ringColorStyle = ''
    if (withSexColor) {
        switch(artist.sex) {
            case 'male':
                ringColorStyle += 'border-2 border-blue-500'
                break;
            case 'female':
                ringColorStyle += 'border-2 border-pink-500'
                break
            default:
                ringColorStyle += 'border-2 border-white'
        }
    }
    
    if (noLink) {
        return (
            <div className={`py-2 px-5 rounded-md text-gray-800 ${className}`}>
                { roleText && <span className='mr-3 text-md'>{roleText}：</span> }
                <div className='flex items-center'>
                    <ProfileImg fluid={artist.profile_image?.childImageSharp?.fluid} className={`flex-shrink-0 w-14 h-14 ${ringColorStyle}`}/>
                    <span className='pl-5 text-md'>
                        {artist.name}{withRuby && artist.name_ruby && `（${artist.name_ruby}）`}
                    </span>
                </div>
            </div>
        )
    } else {
        return (
            <div className={`py-2 px-5 rounded-md text-gray-800 hover:bg-gray-200 ${className}`}>
                <Link to={`/artist/${artist.id}`}>
                    <div className='flex items-center'>
                        { roleText && <span className='mr-3 text-md'>{roleText}：</span> }
                        <ProfileImg fluid={artist.profile_image?.childImageSharp?.fluid} className={`flex-shrink-0 w-14 h-14 ${ringColorStyle}`}/>
                        <span className='pl-5 text-md'>
                            {artist.name}{withRuby && artist.name_ruby && `（${artist.name_ruby}）`}
                        </span>
                    </div>
                </Link>
            </div>
        )
    }
}