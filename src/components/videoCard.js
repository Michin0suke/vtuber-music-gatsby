import React from 'react'
import { Link } from 'gatsby'
import ProfileImg from './profileImage'
import VideoThumbnail from './videoThumbnail'

export const VideoCardHeader = ({ video, className }) => (
    <div className={`relative overflow-hidden ${className}`}>
        <VideoThumbnail video={video} className='mb-2'/>
        <Link to={`/video/${video.id}`} className='absolute top-0 right-0 bottom-0 left-0 w-full h-full opacity-10 sm:hover:bg-white'/>
        <div className='absolute bottom-5 left-3'>
            <div className='pr-10'>
                <div className='absolute top-0 right-0 w-full h-full rounded-full bg-white opacity-50'/>
                <div className='flex relative'>
                    <Link to={`/artist/${video.singers[0]?.id}`} className='relative'>
                        <ProfileImg artist={video.singers[0]} className='w-12 h-12 w-16 h-16' hoverEffect/>
                    </Link>
                    <div className='ml-3'>
                        <h4 className='py-1 text-lg text-black font-bold'>{video.music.title}</h4>
                        <Link to={`/artist/${video.singers[0]?.id}`}>
                            <p className='text-md text-black sm:hover:text-black'>{video.singers.map(singer => singer.name).join(' & ')}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export default ({ video, className, withPublishDate }) => (
    <article className={`relative md:rounded overflow-hidden ${className}`}>
        <VideoThumbnail to={`/video/${video.id}`} video={video} className='mb-2' withHoverLink/>
        <div className='z-10 flex'>
            <Link to={`/artist/${video.singers[0]?.id}`} className='relative'>
                <ProfileImg artist={video.singers[0]} className='mx-2 w-14 h-14' hoverEffect/>
            </Link>
            <div className='w-full'>
                <Link to={`/video/${video.id}`}>
                    <h2 className='py-1'>
                        <cite className='text-gray-900 not-italic'>{video.custom_music_name || video.music.title}</cite>
                    </h2>
                </Link>
                <div className='flex justify-between items-center sm:block pr-2'>
                    <Link to={`/artist/${video.singers[0]?.id}`}>
                        <p className='text-sm text-gray-500 sm:hover:text-black'>{video.singers.map(singer => singer.name).join(' & ')}</p>
                    </Link>
                    {withPublishDate && <time className='text-xs text-gray-500' dateTime={video.release_date}>{video.release_date?.replace(/-/g, '/')}</time>}
                </div>
            </div>
        </div>
    </article>
)
