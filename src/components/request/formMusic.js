import React, { useEffect } from 'react'
import createAutoComplete from './autoComplete/formMusic'
import gen64 from '../../utils/gen64'
import { upsertMusic } from '../../queries/mutate'
import { upsertRequestVideo } from '../../queries/requestVideo'

// singerを全てmutationし、帰ってきたidが違ったらそれにする
const syncMusic = (videoRequest) => {
    upsertMusic(videoRequest.music).then(music => console.log(`success upsert`, music))
}

export default ({
    remoteAllMusic,
    requestVideo,
    updateRequestVideo,
    setStep,
    steps,
}) => {
    useEffect(() => {
        if (!requestVideo.music.id) {
            updateRequestVideo(v => {
                v.music.id = gen64()
                return v
            })
        }
        createAutoComplete(requestVideo, remoteAllMusic, updateRequestVideo, steps, setStep, syncMusic, upsertRequestVideo)
    }, [])
    return (
        <div>
            <div className='form'>
                <p className='text-xs text-gray-500 text-right'>ID: {requestVideo.music.id}</p>
                <span className='text-xs text-gray-600'>曲名</span>
                <input
                    className='w-full px-3 py-1 bg-gray-50 border rounded'
                    id='autoComplete-music-title'
                    value={requestVideo.music.title}
                    placeholder='例）命に嫌われている'
                    onChange={e => updateRequestVideo(v => {
                        v.music.title = e.target.value; return v
                    })}
                />
                <span className='block text-xs text-gray-600 mt-5'>カスタム楽曲名 (必要なら)</span>
                <input
                    className='w-full px-3 py-1 mb-5 bg-gray-50 border rounded'
                    value={requestVideo.custom_music_name}
                    placeholder='例）チョコミントは嫌われている'
                    onChange={e => updateRequestVideo(v => {
                        v.custom_music_name = e.target.value; return v
                    })}
                />
            </div>
            {requestVideo.music.title !== '' &&
                <div>
                    <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => {
                            updateRequestVideo(v => {
                                setStep(steps.MUSIC_ARTIST_ASK)
                                if (v.stage < 3) v.stage = 3
                                syncMusic(v)
                                upsertRequestVideo(v)
                                return v
                            })
                        }}
                    >決定！</button>
                </div>
            }
        </div>
    )
}