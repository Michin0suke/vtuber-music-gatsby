import React, { useState } from 'react'
import { navigate } from 'gatsby'
import Youtube from 'react-youtube'
import VideoThumbnail from './videoThumbnail'
import './youtube-player.css'

const YouTubePlayer = ({ videoId, nextVideoId, thumbnailFluid }) => {
    const [isReadyPlayer, setIsReadyPlayer] = useState(false)
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
        <div className='relative w-full max-w-4xl overflow-hidden mx-auto'>
            {/* { isReadyPlayer ? <p>isReadyPlayer: true</p> : <p>isReadyPlayer: false</p>} */}
            <Youtube
                videoId={videoId}
                onReady={() => setIsReadyPlayer(true)}
                // onPlay={() => setIsReadyPlayer(true)}
                opts={opts}
                onEnd={() => navigate(`/video/${nextVideoId}`)}
                containerClassName={"youtubeContainer"}
            />

            { isReadyPlayer ||
                <VideoThumbnail fluid={thumbnailFluid} className='absolute top-0 left-0 w-full h-full'/>
                // <div className='thumbnail-image absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                //     <Img fluid={thumbnailFluid} className='w-full' />
                // </div>
            }
        </div>
    )
}

export default YouTubePlayer