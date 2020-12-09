import React from 'react'
import { Link } from 'gatsby'
import ColorNote from './colorNote'

export default ({ music, className }) => {
    return (
        <div className={`py-3 px-5 hover:bg-gray-200 ${className}`}>
            <Link to={`/music/${music.id}`}>
                <p className='flex items-center'>
                    <ColorNote className='w-4 h-4'/>
                    <span className='pl-2 text-gray-800'>{music.title}</span>
                </p>
            </Link>
        </div>
    )
}