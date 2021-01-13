import React, { useState, useEffect } from 'react'
import { validateVideoUrl } from '../../utils/validateUrl'
import Plus from '../svg/plus'
import VideoCard from '../videoCard'
import { upsertRequestVideo } from '../../queries/requestVideo'
import './formYoutubeUrl.css'

export default ({
    remoteRequestVideos,
    requestVideo,
    updateRequestVideo,
    allVideo,
    setErrorMessage,
    stageToStep,
    steps,
    setStep,
}) => {
    const [formText, setFormText] = useState('')

    useEffect(() => {
        const youtubeIdQuery = window.location.search?.split('=')?.[1]
        if (youtubeIdQuery) paginateEvent(`https://www.youtube.com/watch?v=${youtubeIdQuery}`)
    }, [])

    const paginateEvent = (text) => {
        updateRequestVideo(v => {
            v.id = validateVideoUrl(text);
            if (text === '') {
                setErrorMessage('')
                return v
            }
            if (!v.id) {
                setErrorMessage('URLが無効だよ！')
                return v
            }
            if (allVideo.nodes.map(i=>i.id).includes(v.id)) {
                setErrorMessage('その動画はすでに追加されているよ！')
                return v
            }
            const remoteRequestVideo = remoteRequestVideos.find(video => video.id === v.id)
            if (remoteRequestVideo) {
                if (remoteRequestVideo.is_done) {
                    setErrorMessage('その動画はすでにリクエスト&登録されているよ！')
                    return v
                }
                // if (remoteRequestVideo.stage >= 5) {
                //     setErrorMessage('その動画はすでにリクエストされているよ！')
                //     return v
                // }
                try {
                    console.log(remoteRequestVideo)
                    const newState = JSON.parse(remoteRequestVideo.content)
                    setErrorMessage('')
                    if (remoteRequestVideo.stage === 5) {
                        alert('編集モード！')
                        setStep(steps.ARTIST_INPUT)
                    } else {
                        setStep(stageToStep(remoteRequestVideo.stage))
                    }
                    return newState
                } catch(e) {
                    console.error(e)
                    return v
                }
            }
            setErrorMessage('')
            setStep(steps.TWITTER_ASK_FIRST)
            // stage 0 としてmigrate
            upsertRequestVideo(v)
            return v
        })
    }

    return (
        <div>
            <div className='flex items-center mb-16 w-full'>
                <input
                    placeholder='動画のURLを入力してね！'
                    className='block border w-full py-1 px-2 rounded form-youtube-url'
                    value={formText}
                    onChange={e => {
                        setFormText(e.target.value)
                        paginateEvent(e.target.value)
                    }}
                />
                <div onClick={() => {
                    setFormText('')
                    setErrorMessage('')
                }}>
                    <Plus color='red' className='transform rotate-45 w-7 h-7 ml-3 cursor-pointer'/>
                </div>
            </div>
            {allVideo.nodes.map(i=>i.id).includes(requestVideo.id) &&
            <div>
                {console.log('hey')}
            <VideoCard video={allVideo.nodes.filter(video => video.id === requestVideo.id)[0]} withPublishDate/>
            </div>
            }
            {/* <pre>{JSON.stringify(remoteRequestVideos, null, 4)}</pre> */}
        </div>
    )
}