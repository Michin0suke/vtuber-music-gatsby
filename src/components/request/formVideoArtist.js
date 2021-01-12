import React, { useEffect } from 'react'
import createAutoComplete from './autoComplete/formVideoArtist'
import gen64 from '../../utils/gen64'
import { upsertArtistLess } from '../../queries/mutate'
import { upsertRequestVideo } from '../../queries/requestVideo'

// singerを全てmutationし、帰ってきたidが違ったらそれにする
const syncArtist = (videoRequest) => {
    const roles = ['mixers', 'off_vocals', 'arrangers']
    roles.forEach(role => {
        videoRequest[role].forEach(artist => {
            upsertArtistLess(artist).then(artist => console.log(`success upsert`, artist))
        })
    })
}

export default ({
    remoteAllArtist,
    updateRequestVideo,
    requestVideo,
    initStateArtist,
    setStep,
    steps,
}) => {
    return (
        <div>
            {[
                {en: 'mixers', ja: 'ミックス'},
                {en: 'off_vocals', ja: 'オフボーカル'},
                {en: 'arrangers', ja: 'アレンジ'},
            ].map((role, roleIndex) => (
                <VideoArtistRole
                    remoteAllArtist={remoteAllArtist}
                    key={roleIndex}
                    role={role}
                    requestVideo={requestVideo}
                    initStateArtist={initStateArtist}
                    updateRequestVideo={updateRequestVideo}
                />
            ))}
            {
            requestVideo.mixers.length + requestVideo.off_vocals.length + requestVideo.arrangers.length === 0
                ?
                <div>
                    <button
                        className='mx-auto block px-4 py-2 bg-white sm:hover:bg-gray-50 text-red-600 border border-red-600 shadow rounded-full'
                        onClick={() => {
                            updateRequestVideo(v => {
                                setStep(steps.TWITTER_ASK_LAST)
                                if (v.stage < 5) v.stage = 5
                                syncArtist(v)
                                upsertRequestVideo(v)
                                return v
                            })
                        }}
                    >MIXとかしてる人いないよ！</button>
                </div>
                :
                <div>
                {!(
                    requestVideo.mixers.find(i => i.name === '') ||
                    requestVideo.off_vocals.find(i => i.name === '') ||
                    requestVideo.arrangers.find(i => i.name === '')
                )
                &&
                    <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => {
                            updateRequestVideo(v => {
                                setStep(steps.TWITTER_ASK_LAST)
                                v.stage = 5
                                syncArtist(v)
                                upsertRequestVideo(v)
                                return v
                            })
                        }}
                    >決定！！</button>
                }
                    
                </div>
            }
        </div>
    )
}

const VideoArtistRole = ({
    remoteAllArtist,
    role,
    requestVideo,
    initStateArtist,
    updateRequestVideo,
}) => {
    return (
        <div className='mb-10'>
            <h2 className='pb-3'>{role.ja}</h2>
            {requestVideo[role.en].map((artist, artistIndex) => (
                <VideoArtist
                    key={artistIndex}
                    remoteAllArtist={remoteAllArtist}
                    role={role}
                    artist={artist}
                    artistIndex={artistIndex}
                    requestVideo={requestVideo}
                    updateRequestVideo={updateRequestVideo}
                />
            ))}
            <div className='w-full'>
                <button
                    className='block mx-auto h-7 w-7 bg-red-500 sm:hover:bg-red-400 text-xl font-bold text-white rounded-full'
                    onClick={_=> updateRequestVideo(v => {
                        v[role.en].push(initStateArtist); return v
                    })}
                >+</button>
            </div>
        </div>
    )
}

const VideoArtist = ({
    remoteAllArtist,
    role,
    artist,
    artistIndex,
    requestVideo,
    updateRequestVideo,
}) => {
    return (
        <div className='flex items-center mb-3 pb-7 border-b-2'>
                    <button
                        className='block h-7 w-7 mr-3 bg-blue-500 sm:hover:bg-blue-400 text-xl font-bold text-white rounded-full'
                        onClick={ _ => {
                            updateRequestVideo(v => {
                                if (role.en === 'composers' && v[role.en].length === 1) return v
                                if (role.en === 'lyricists' && v[role.en].length === 1) return v
                                v[role.en].splice(artistIndex, 1); return v
                            })
                        }}
                    >−</button>
                    <div className='w-full'>
                        <p className='text-xs text-gray-500 text-right'>ID: {artist.id}</p>
                        {[
                            {en: 'name', ja: '名前'},
                            {en: 'id_twitter', ja: 'Twitter ID'}
                        ].map((element, elementIndex) => (
                            <VideoArtistElement
                                remoteAllArtist={remoteAllArtist}
                                key={elementIndex}
                                element={element}
                                role={role}
                                artist={artist}
                                artistIndex={artistIndex}
                                requestVideo={requestVideo}
                                updateRequestVideo={updateRequestVideo}
                            />
                        ))}
                    </div>
                </div>
    )
}

const VideoArtistElement = ({
    remoteAllArtist,
    element,
    role,
    artist,
    artistIndex,
    requestVideo,
    updateRequestVideo,
}) => {
    useEffect(() => {
        if (!requestVideo[role.en][artistIndex].id) {
            updateRequestVideo(v => {
                v[role.en][artistIndex].id = gen64()
                return v
            })
        }

        createAutoComplete(requestVideo, remoteAllArtist, role.en, artistIndex, element, updateRequestVideo)
    }, [])
    return (
        <div className='w-full form'>
            <span className='text-xs text-gray-600'>{role.ja}:{element.ja}</span>
            <div
                className='flex items-center'
                id={`autoComplete-list-container-video-artist-${role.en}-${artistIndex}-${element.en}`}
            >
                {element.en === 'id_twitter' && <span className='text-lg text-gray-500 px-1'>@</span>}
                <input
                    className='w-full px-3 py-1 bg-gray-50 border rounded'
                    value={artist[element.en]}
                    id={`autoComplete-video-artist-${role.en}-${artistIndex}-${element.en}`}
                    maxLength={element.en === 'id_twitter' ? 15 : 255}
                    placeholder={element.ja}
                    onChange={e => updateRequestVideo(v => {
                        v[role.en][artistIndex][element.en] = e.target.value; return v
                    })}
                />
            </div>
        </div>
    )
}