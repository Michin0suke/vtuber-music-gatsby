import React from 'react'
import Heading from './heading'
import YouTube from './svg/youtube'
import Twitter from './svg/twitter'
import Instagram from './svg/instagram'

const convertFullUrl = (id, type) => {
    switch (type) {
        case 'id_youtube':
            return `https://www.youtube.com/channel/${id}`
        case 'id_twitter':
            return `https://twitter.com/${id}`
        case 'id_instagram':
            return `https://www.instagram.com/${id}`
        case 'id_spotify':
            return `https://open.spotify.com/artist/${id}`
        case 'id_apple_music':
            return `https://music.apple.com/jp/artist/${id}`
        case 'id_showroom':
            return `https://www.showroom-live.com/room/profile?room_id=${id}`
        case 'id_openrec':
            return `https://www.openrec.tv/user/${id}`
        case 'id_bilibili':
            return `https://space.bilibili.com/${id}`
        case 'id_tiktok':
            return `https://www.tiktok.com/@${id}`
        case 'id_twitcasting':
            return `https://twitcasting.tv/${id}`
        case 'id_facebook':
            return `https://www.facebook.com/${id}`
        case 'id_pixiv':
            return `https://www.pixiv.net/users/${id}`
        case 'url_niconico':
            return id
        case 'url_homepage':
            return id
        default:
            console.log('[error] url type is not valid(artistLinks)')
            return ''
    }
}

const linkTypes = [
    { type: 'id_youtube', logo: <YouTube colorMode='light' className='pl-1 h-3/5'/>, disp: '' },
    { type: 'id_twitter', logo: <Twitter className='mr-1 h-full'/>, disp: 'Twitter' },
    { type: 'id_instagram', logo: <Instagram className='pl-1 mr-3 h-5/6'/>, disp: 'Instagram' },
    { type: 'id_spotify', disp: 'Spotify' },
    { type: 'id_apple_music', disp: 'Apple Music' },
    { type: 'id_showroom', disp: 'Showroom' },
    { type: 'id_openrec', disp: 'Openrec' },
    { type: 'id_bilibili', disp: 'Bilibili' },
    { type: 'id_tiktok', disp: 'Tiktok' },
    { type: 'id_twitcasting', disp: 'Twitcasting' },
    { type: 'id_facebook', disp: 'Facebook' },
    { type: 'id_pixiv', disp: 'Pixiv' },
    { type: 'url_niconico', disp: 'niconico' },
    { type: 'url_homepage', disp: 'ホームページ' },
]

export default ({ artist, className }) => {
    let isHasLink = false

    const elements = linkTypes.map(({ type, logo, disp }) => {
        if (artist[type]) {
            isHasLink = true
        } else {
            return ''
        }

        const url = convertFullUrl(artist[type], type)

        return (
            <li key={`${artist.id}-${type}`} className='mb-2 pl-5 py-2 h-14 hover:bg-gray-200 rounded'>
                <a href={url} target='_brank' className='h-full flex items-center'>
                    {logo}
                    {disp && <span className='text-xl font-bold text-gray-800'>{disp}</span>}
                </a>
            </li>
        )
    })

    if (isHasLink) {
        return (
            <div className={className}>
                <Heading text='リンク' className='mb-5'/>
                <ul>
                    {elements}
                </ul>
            </div>
        )
    } else {
        return null
    }
}