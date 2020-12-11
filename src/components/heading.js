import React from 'react'
import ColorNote from '../components/colorNote'

export default ({ text, count, className, hoverEffect, isMusicTitle }) => (
    <h1 className={`pl-3 py-2 mx-3 text-2xl text-gray-900 border-b-2 ${className} ${hoverEffect && 'hover:bg-gray-200'}`}>
        {isMusicTitle && <ColorNote className='inline-block h-8 mr-4'/>}
        {text}
        { count && <span className='pl-2 text-gray-500'>({count})</span>}
    </h1>
)

export const HeadingH2 = ({ text, count, className }) => (
    <h1 className={`pl-3 py-2 mx-3 text-xl text-gray-800 border-b-2 ${className}`}>
        {text}
        { count && <span className='pl-2 text-gray-500'>({count})</span> }
    </h1>
)