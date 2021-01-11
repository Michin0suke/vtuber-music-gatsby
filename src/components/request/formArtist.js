import React, { useEffect } from 'react'
import { validateChannelUrl } from '../../utils/validateUrl'
import createAutoComplete from './autoComplete/formArtist'
import gen64 from '../../utils/gen64'
import { upsertArtistFull } from '../../queries/mutate'
import { upsertRequestVideo } from '../../queries/requestVideo'

// singerを全てmutationし、帰ってきたidが違ったらそれにする
const upsertArtist = (videoRequest) => {
    videoRequest.singers.forEach((singer) => {
        upsertArtistFull(singer).then(artist => console.log(`success upsert`, artist))
    })
}

export default ({
    remoteAllArtist,
    setRequestVideo,
    requestVideo,
    updateRequestVideo,
    copyState,
    updateRequestVideoBirthday,
    initStateSinger,
    setStep,
    steps,
    setErrorMessage,
}) => {
    return (
        <div>
            {requestVideo.singers.map((singer, key) => (
                <Form
                    key={key}
                    singerIndex={key}
                    singer={singer}
                    remoteAllArtist={remoteAllArtist}
                    setRequestVideo={setRequestVideo}
                    requestVideo={requestVideo}
                    updateRequestVideo={updateRequestVideo}
                    copyState={copyState}
                    updateRequestVideoBirthday={updateRequestVideoBirthday}
                />
            ))}
            <button
                className='h-7 w-7 mr-3 bg-red-500 sm:hover:bg-red-400 text-xl font-bold text-white rounded-full'
                onClick={_=> updateRequestVideo(v => {
                    v.singers.push(initStateSinger); return v
                })}
            >+</button>
            {requestVideo.singers.filter(singer => singer.name === '').length === 0
                && !requestVideo.singers.find(singer => singer.id_youtube === false)
                && !requestVideo.singers.map(singer => singer.birthday).includes(false)
                && <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => {
                            // 空白のアーティストがいない場合
                            if (!requestVideo.singers.find(singer => singer.name === '')) {
                                updateRequestVideo(v => {
                                    setErrorMessage('')
                                    setStep(steps.MUSIC_ASK)
                                    v.stage = 2
                                    upsertArtist(v)
                                    upsertRequestVideo(v)
                                    return v
                                })
                            } else {
                                setErrorMessage('名前が設定されていないアーティストがいるよ！')
                            }
                        }}
                    >決定！</button>
            }
        </div>
    )
}

const Form = ({
    singerIndex,
    remoteAllArtist,
    setRequestVideo,
    requestVideo,
    updateRequestVideo,
    copyState,
    updateRequestVideoBirthday,
    singer,
}) => {
    useEffect(() => {
        if (!requestVideo.singers[singerIndex].id) {
            updateRequestVideo(v => {
                v.singers[singerIndex].id = gen64()
                return v
            })
        }

        // const autoCompleteKeys = ['name', 'name_ruby', 'id_twitter', 'id_youtube']
        const autoCompleteKeys = ['name', 'name_ruby', 'id_twitter']
        autoCompleteKeys.forEach(singerElement => {
            createAutoComplete(requestVideo, remoteAllArtist, singerIndex, singerElement, updateRequestVideo)
        })
    }, [])

    return (
        <div className='flex items-center mb-3 pb-7 border-b-2'>
            <button
                className='block h-7 w-7 mr-3 bg-blue-500 sm:hover:bg-blue-400 text-xl font-bold text-white rounded-full'
                onClick={_=> {
                    if (requestVideo.singers.length > 1) {
                        updateRequestVideo(v => {
                            v.singers.splice(singerIndex, 1); return v
                        })
                    }
                }}
            >−</button>
            <div className='w-full'>
                <p className='text-xs text-gray-500 text-right'>ID: {singer.id}</p>
                {[
                    {en: 'name', ja: '名前', inputType: 'textBox'},
                    {en: 'name_ruby', ja: 'ふりがな', inputType: 'textBox'},
                    {en: 'profile', ja: 'プロフィール', inputType: 'textArea'},
                    {en: 'birthday', ja: '誕生日', inputType: 'date'},
                    {en: 'id_twitter', ja: 'Twitter ID', inputType: 'id_twitter'},
                    {en: 'url_youtube', ja: 'YouTubeチャンネルのURL', inputType: 'id_youtube'}
                ].map((i, key2) => (
                    <div key={key2} className='w-full' className='form'>
                        <span className='text-xs text-gray-600'>{i.ja}</span>
                        {i.inputType === 'textArea' &&
                            <textarea
                                className='w-full px-3 py-1 bg-gray-50 border rounded'
                                id={`autoComplete-artist-${singerIndex}-${i.en}`}
                                placeholder={i.ja}
                                cols={20} rows={3}
                                value={singer[i.en]}
                                onChange={e => updateRequestVideo(v => {
                                    v.singers[singerIndex][i.en] = e.target.value; return v
                                })}
                            ></textarea>
                        }
                        {i.inputType === 'textBox' &&
                            <input
                                className='w-full px-3 py-1 bg-gray-50 border rounded'
                                id={`autoComplete-artist-${singerIndex}-${i.en}`}
                                value={singer[i.en]}
                                placeholder={i.ja}
                                autoComplete='off'
                                onChange={e => updateRequestVideo(v => {
                                    v.singers[singerIndex][i.en] = e.target.value; return v
                                })}
                            />
                        }
                        {i.inputType === 'date' &&
                            <div>
                                <div className='flex'>
                                    <input
                                        className='w-full px-3 py-1 mr-3 bg-gray-50 border rounded'
                                        id={`autoComplete-artist-${singerIndex}-${i.en}-year`}
                                        value={singer.birthday_input.year}
                                        placeholder='年(省略可)'
                                        autoComplete='off'
                                        maxLength={4}
                                        onChange={e => {
                                            const newBirthdayInput = copyState(singer.birthday_input)
                                            newBirthdayInput.year = e.target.value
                                            setRequestVideo(updateRequestVideoBirthday(requestVideo, singerIndex, newBirthdayInput))
                                        }}
                                    />
                                    <input
                                        className='w-full px-3 py-1 mr-3 bg-gray-50 border rounded'
                                        id={`autoComplete-artist-${singerIndex}-${i.en}-month`}
                                        value={singer.birthday_input.month}
                                        placeholder='月'
                                        autoComplete='off'
                                        maxLength={2}
                                        onChange={e => {
                                            const newBirthdayInput = copyState(singer.birthday_input)
                                            newBirthdayInput.month = e.target.value
                                            setRequestVideo(updateRequestVideoBirthday(requestVideo, singerIndex, newBirthdayInput))
                                        }}
                                    />
                                    <input
                                        className='w-full px-3 py-1 bg-gray-50 border rounded'
                                        id={`autoComplete-artist-${singerIndex}-${i.en}-date`}
                                        value={singer.birthday_input.date}
                                        placeholder='日'
                                        autoComplete='off'
                                        maxLength={2}
                                        onChange={e => {
                                            const newBirthdayInput = copyState(singer.birthday_input)
                                            newBirthdayInput.date = e.target.value
                                            setRequestVideo(updateRequestVideoBirthday(requestVideo, singerIndex, newBirthdayInput))
                                        }}
                                    />
                                </div>
                                {requestVideo.singers[singerIndex].birthday === false && <p className='text-xs text-red-500'>誕生日が有効ではありません！</p>}
                            </div>
                        }
                        {i.inputType === 'id_twitter' &&
                            <div className='w-full'>
                                <span className='text-lg text-gray-500 px-1'>@</span>
                                <input
                                    className='w-auto px-3 py-1 bg-gray-50 border rounded'
                                    id={`autoComplete-artist-${singerIndex}-${i.en}`}
                                    value={singer[i.en]}
                                    placeholder={i.ja}
                                    autoComplete='off'
                                    maxLength={15}
                                    onChange={e => updateRequestVideo(v => {
                                        if (i.en === 'url_youtube') {
                                            v.singers[singerIndex].id_youtube = validateChannelUrl(e.target.value)
                                            if (e.target.value === '') {
                                                if (e.target.value === '') v.singers[singerIndex].id_youtube = null
                                            }
                                        }
                                        v.singers[singerIndex][i.en] = e.target.value; return v
                                    })}
                                />
                            </div>
                        }
                        {i.inputType === 'id_youtube' &&
                            <div>
                                {requestVideo.singers[singerIndex].is_exist_remote_id_youtube ?
                                    <p>{singer.id_youtube}</p> :
                                    <input
                                        className='w-full px-3 py-1 bg-gray-50 border rounded'
                                        id={`autoComplete-artist-${singerIndex}-id_youtube`}
                                        value={singer.url_youtube}
                                        placeholder={i.ja}
                                        autoComplete='off'
                                        onChange={e => updateRequestVideo(v => {
                                            v.singers[singerIndex].id_youtube = validateChannelUrl(e.target.value)
                                            if (e.target.value === '') {
                                                if (e.target.value === '') v.singers[singerIndex].id_youtube = null
                                            }
                                            v.singers[singerIndex].url_youtube = e.target.value
                                            return v
                                        })}
                                    />
                                }
                            </div>
                        }
                        {i.en === 'url_youtube'
                            && requestVideo.singers[singerIndex].id_youtube === false
                            && <span className='text-xs text-red-600'>無効なチャンネルURLだよ！</span>
                        }
                        {i.en === 'url_youtube'
                            && requestVideo.singers[singerIndex].id_youtube !== false
                            && requestVideo.singers[singerIndex].url_youtube !== ''
                            && <span className='text-xs text-blue-600'>有効なチャンネルURLだよ！</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}