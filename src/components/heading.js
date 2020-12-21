import React from 'react'
import ColorNote from '../components/colorNote'

export default ({ text, count, className, hoverEffect, isMusicTitle }) => (
    <h2 className={`px-5 pt-5 pb-3 text-xl text-gray-900 border-b ${className} ${hoverEffect && 'hover:bg-gray-200'}`}>
        {isMusicTitle && <ColorNote className='inline-block h-6 mr-4'/>}
        {text}
        {count && <span className='pl-2 text-gray-500'>({count})</span>}
    </h2>
)

export const HeadingH2 = ({ text, count, className }) => (
    <h1 className={`pl-3 py-2 text-xl text-gray-800 border-b-2 ${className}`}>
        {text}
        { count && <span className='pl-2 text-gray-500'>({count})</span> }
    </h1>
)