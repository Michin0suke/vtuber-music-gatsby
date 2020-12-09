import React from 'react'

export default ({ color, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 6" className={className}>
        <circle cx="3" cy="3" r="3" style={{fill: color}}/>
        <circle cx="11.5" cy="3" r="3" style={{fill: color}}/>
        <circle cx="20" cy="3" r="3" style={{fill: color}}/>
    </svg>
)