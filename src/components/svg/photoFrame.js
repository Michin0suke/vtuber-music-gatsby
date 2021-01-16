import React from 'react'

export default ({ className, style, color, color2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300.72 270.2" className={className} style={style}>
        <line x1="86.67" y1="58" x2="150.36" y2="7.39" style={{ fill: 'none', stroke: '#231815', strokeMiterlimit: 10, strokeWidth: 2, opacity: 0.31 }}/>
        <line x1="76.3" y1="59.11" x2="150.36" y2="7.39" style={{ fill: 'none', stroke: '#231815', strokeMiterlimit: 10, strokeWidth: 2 }}/>
        <line x1="218.11" y1="60.13" x2="150.36" y2="7.39" style={{ fill: 'none', stroke: '#231815', strokeMiterlimit: 10, strokeWidth: 2, opacity: 0.31 }}/>
        <line x1="225.18" y1="58.59" x2="150.36" y2="7.39" style={{ fill: 'none', stroke: '#231815', strokeMiterlimit: 10, strokeWidth: 2 }}/>
        <path d="M0,56.86V270.2H300.72V56.86ZM253.56,223.31H47.16V103.75h206.4Z" style={{ fill: color, opacity: 0.9 }}/>
        <path d="M21.7,78.74V248.32H279V78.74ZM253.56,223.31H47.16V103.75h206.4Z" style={{ fill: '#e0dddb' }}/>
        <circle cx="150.36" cy="7.39" r="6.39" style={{ fill: color2, stroke: '#231815', strokeMiterlimit: 10, strokeWidth: 2 }}/>
        <circle cx="150.53" cy="7.28" r="0.92" style={{ fill: color2, stroke: '#231815', strokeMiterlimit: 10, strokeWidth: 2 }}/>
        <line x1="47.16" y1="223.31" x2="253.56" y2="223.31" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <line x1="253.56" y1="103.75" x2="253.56" y2="223.31" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <line x1="47.16" y1="103.75" x2="47.16" y2="223.31" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <line x1="47.16" y1="103.75" x2="253.56" y2="103.75" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <line x1="21.7" y1="78.74" x2="279.01" y2="78.74" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <line x1="21.7" y1="248.32" x2="279.01" y2="248.32" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <polygon points="0 270.19 0 56.86 21.7 78.74 21.7 248.32 0 270.19" style={{ fill: color2 }}/>
        <polygon points="300.71 270.19 300.71 56.86 279.01 78.74 279.01 248.32 300.71 270.19" style={{ fill: color2 }}/>
        <line x1="21.7" y1="78.74" x2="21.7" y2="248.32" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
        <line x1="279.01" y1="78.74" x2="279.01" y2="248.32" style={{ fill: 'none', stroke: '#f2f2f2', strokeLinecap: 'square', strokeMiterlimit: 10, strokeWidth: 3 }}/>
    </svg>
)