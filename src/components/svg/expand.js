import React from 'react'

export default ({ className, style, color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={style}>
        <path d="M9 20H5a1 1 0 0 1-1-1V15a1 1 0 0 1 2 0v3H9a1 1 0 0 1 0 2zM14 11a1 1 0 0 1-.71-1.71l5-5a1 1 0 0 1 1.41 1.41l-5 5A1 1 0 0 1 14 11z" style={{ fill: color }}/>
        <path d="M19 10a1 1 0 0 1-1-1V6H15a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1V9A1 1 0 0 1 19 10zM5 20a1 1 0 0 1-.71-1.71l5-5a1 1 0 0 1 1.41 1.41l-5 5A1 1 0 0 1 5 20z" style={{ fill: color }}/>
    </svg>
)
