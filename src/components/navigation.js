import React from 'react'
import { Link } from 'gatsby'

export default () => (
<nav style={{ fontSize: 12 }}>
    <p style={{ marginBottom: 5, paddingLeft: 10 }}>
    <span><Link to={'/videos'} style={{ color: '#555', textDecoration: 'none' }}>動画</Link></span>
    <span style={{ padding: '0 5px' }}>{'>'}</span>
    <span><Link to={`/artist/${video.singers[0]?.id}`} style={{ color: '#555', textDecoration: 'none' }}>{video.singers[0]?.name}</Link></span>
    <span style={{ padding: '0 5px' }}>{'>'}</span>
    <span>{video.music.title}</span>
    </p>
</nav>
)
