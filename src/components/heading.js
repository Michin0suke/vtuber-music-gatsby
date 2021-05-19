import React from 'react'
import './heading.css'

export default ({ text, count, className, hoverEffect }) => (
    <h2 className={`heading px-5 py-3 text-xl text-gray-900 rounded ${className} ${hoverEffect && 'sm:hover:bg-gray-200'}`}>
        {/* {isMusicTitle && <ColorNote className='inline-block h-6 mr-4'/>} */}
        {text}
        {count && <span className='pl-2 text-gray-500 text-xs align-top'>{count}</span>}
    </h2>
)
