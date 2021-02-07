import React, { useState, useEffect } from 'react'
import { navigate, Link } from 'gatsby'
import Youtube from 'react-youtube'
import VideoThumbnail from './videoThumbnail'
import Expand from './svg/expand'
import './youtube-player.css'

const YouTubePlayer = ({ nextVideoId, video, className }) => {
    const [isReadyPlayer, setIsReadyPlayer] = useState(false)
    const [videoId, setVideoId] = useState(video.id)

    useEffect(() => {
        setVideoId(video.id)
    }, [video])
    // const videoId = JSON.parse(JSON.stringify(video.id))
    // const [a, setA] = useState(false)

    const opts = {
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            // controls: 0,
            disablekb: 0,
            playsinline: 1,
            // cc_load_policy: 0,
            cc_lang_pref: 'ja'
        },
    }

    // return (
    //     <div className='relative w-full max-w-4xl overflow-hidden mx-auto'>
    //         <div className='youtubeContainer'></div>
    //         {/* <div className='thumbnail-image absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition'>
    //             <Img fluid={thumbnailFluid} className='w-full' />
    //         </div> */}
    //         <VideoThumbnail fluid={thumbnailFluid} className='absolute top-0 left-0 w-full h-full'/>
    //     </div>
    // )

    return (
        <div className='youtube-player-wrapper'>
            <div className={`relative overflow-hidden`}>
                {/* { isReadyPlayer ? <p>isReadyPlayer: true</p> : <p>isReadyPlayer: false</p>} */}
                <Youtube
                    videoId={video.id}
                    onReady={() => setIsReadyPlayer(true)}
                    // onPlay={() => setIsReadyPlayer(true)}
                    opts={opts}
                    onEnd={() => {
                        if (nextVideoId) {
                            navigate(`/video/${nextVideoId}`)
                        } else {
                            console.log('is not set nextVideoId')
                        }
                    }}
                    containerClassName={"youtubeContainer"}
                />

                { isReadyPlayer ||
                    <VideoThumbnail video={video} className='absolute top-0 left-0 w-full h-full'/>
                    // <div className='thumbnail-image absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    //     <Img fluid={thumbnailFluid} className='w-full' />
                    // </div>
                }

                <Link to={`/video/${videoId}`} className='absolute top-0 right-0'>
                    <div className='relative w-7 h-7 m-1 rounded overflow-hidden'>
                        <div className='absolute top-0 left-0 w-full h-full bg-white opacity-50'/>
                        <Expand color='black' className='absolute top-0 left-0 w-full h-full'/>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default YouTubePlayer