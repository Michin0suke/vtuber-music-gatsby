import React, { useState, useEffect } from 'react'
import { validateVideoUrl } from '../../utils/validateUrl'
import Plus from '../svg/plus'
import VideoCard from '../videoCard'
import { upsertRequestVideo, findRequestVideo } from '../../queries/requestVideo'
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
    setIsEditMode,
}) => {
    const [formText, setFormText] = useState('')
    const [typedVideoId, setTypedVideoId] = useState()
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const youtubeIdQuery = window.location.search?.split('=')?.[1]
        if (youtubeIdQuery) paginateEvent(`https://www.youtube.com/watch?v=${youtubeIdQuery}`)
    }, [])

    const paginateEvent = async (text) => {
        setErrorMessage('')
        setIsProcessing(true)
        const typedVideoId = validateVideoUrl(text)
        setTypedVideoId(typedVideoId)
        if (remoteRequestVideos.length === 0) {
            console.log(`remoteRequestVideos.length === 0`)
            setIsProcessing(false)
            return
        }
        if (text === '') {
            setIsProcessing(false)
            return
        }
        if (!typedVideoId) {
            setErrorMessage('URLが無効だよ！')
            setIsProcessing(false)
            return
        }
        if (allVideo.nodes.map(i=>i.id).includes(typedVideoId)) {
            setErrorMessage('その動画はすでに追加されているよ！')
            setIsProcessing(false)
            return
        }

        const remoteRequestVideo = remoteRequestVideos.find(video => video.id === typedVideoId)

        if (!remoteRequestVideo) {
            // まだ登録もリクエストもされていない
            setStep(steps.TWITTER_ASK_FIRST)
            updateRequestVideo(v => {
                v.id = typedVideoId
                return v
            })
            setIsProcessing(false)
            return
        }

        if (remoteRequestVideo?.is_done) {
            setErrorMessage('その動画はすでにリクエスト&登録されているよ！')
        }

        const remoteRequestVideoFull = await findRequestVideo(typedVideoId).then(i => {
            setIsProcessing(false)
            return i.data.requestVideos[0]
        }).catch(e => console.log(e))

        if (remoteRequestVideoFull) {
            try {
                const parsedContent = JSON.parse(remoteRequestVideoFull.content)
                if (parsedContent.stage === 5) {
                    // 編集モードへ
                    setIsEditMode(true)
                    // ここは適当
                    setStep(steps.ARTIST_ASK)
                } else {
                    // 途中から
                    setStep(stageToStep(parsedContent.stage))
                }
                updateRequestVideo(v => {
                    // stage 0 としてmigrate
                    // upsertRequestVideo(v)
                    return parsedContent
                })
            } catch(e) {
                // パースに失敗
                console.error(e)
                setIsProcessing(false)
                return
            }
        }
        setIsProcessing(false)
    }

    return (
        <div>
            {isProcessing ?
                <p className='text-center'>処理中...</p> :

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
            }
            {allVideo.nodes.map(i=>i.id).includes(requestVideo.id) &&
            <div>
            <VideoCard video={allVideo.nodes.filter(video => typedVideoId === requestVideo.id)[0]} withPublishDate/>
            </div>
            }
            {/* <pre>{JSON.stringify(remoteRequestVideos, null, 4)}</pre> */}
        </div>
    )
}