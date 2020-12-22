import React from 'react'
import { Link } from 'gatsby'
import ProfileImg from './profileImage'
import VideoThumbnail from './videoThumbnail'

export const VideoCardHeader = ({ video, className }) => (
    <div className={`relative overflow-hidden ${className}`}>
        <VideoThumbnail video={video} className='mb-2'/>
        <Link to={`/video/${video.id}`} className='absolute top-0 right-0 bottom-0 left-0 w-full h-full opacity-10 hover:bg-white'/>
        {/* <div className='absolute bottom-0 left-0 w-100 h-30 bg-white'/> */}
        <div className='absolute bottom-5 left-3'>
            <div className='pr-10'>
                <div className='absolute top-0 right-0 w-full h-full rounded-full bg-white opacity-50'/>
                <div className='flex relative'>
                    <Link to={`/artist/${video.singers[0].id}`} className='relative'>
                        <ProfileImg artist={video.singers[0]} className='w-12 h-12 w-16 h-16' hoverEffect/>
                    </Link>
                    <div className='ml-3'>
                        <h4 className='py-1 text-lg text-black font-bold'>{video.music.title}</h4>
                        <Link to={`/artist/${video.singers[0].id}`}>
                            <p className='text-md text-black hover:text-black'>{video.singers.map(singer => singer.name).join(' & ')}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default ({ video, className }) => (
    <div className={`relative md:rounded overflow-hidden ${className}`}>
        <VideoThumbnail to={`/video/${video.id}`} video={video} className='mb-2' withHoverLink/>
        <div className='z-10 flex'>
            <Link to={`/artist/${video.singers[0].id}`} className='relative'>
                <ProfileImg artist={video.singers[0]} className='mx-2 w-14 h-14' hoverEffect/>
            </Link>
            <div>
                <Link to={`/video/${video.id}`}>
                    <h4 className='py-1 text-md text-gray-900'>{video.custom_music_name || video.music.title}</h4>
                </Link>
                <Link to={`/artist/${video.singers[0].id}`}>
                    <p className='pb-2.5 text-sm text-gray-500 hover:text-black'>{video.singers.map(singer => singer.name).join(' & ')}</p>
                </Link>
            </div>
        </div>
    </div>
)