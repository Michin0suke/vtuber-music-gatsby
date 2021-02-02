import React, { useState, useEffect } from 'react'
import { graphql, Link, navigate } from 'gatsby'
import Heading from '../components/heading'
import { requestVideos, requestVideosLess } from '../queries/requestVideo'
import { parse } from 'date-fns'
import FormYoutubeUrl from '../components/request/formYoutubeUrl'
import StepButtons from '../components/request/stepButtons'
import FormArtist from '../components/request/formArtist'
import FormMusic from '../components/request/formMusic'
import FormMusicArtist from '../components/request/formMusicArtist'
import FormVideoArtist from '../components/request/formVideoArtist'
import FormTwitter from '../components/request/formTwitter'
import { allArtist, queryAllArtistOnlySingerFull, queryAllArtistWithoutSingerLess } from '../queries/artist'
import { allMusic } from '../queries/music'
import { upsertRequestVideo, requestVideosCountByTwitterId } from '../queries/requestVideo'
import Youtube from 'react-youtube'
import { upsertArtistLess } from '../queries/mutate'
import { TwitterShareButton, TwitterIcon } from "react-share";

const syncArtist = (videoRequest) => {
    const roles = ['mixers', 'off_vocals', 'arrangers']
    roles.forEach(role => {
        videoRequest[role].forEach(artist => {
            upsertArtistLess(artist).then(artist => console.log(`success upsert`, artist))
        })
    })
}

const getContributorTwitterId = () => {
    if (typeof window === 'undefined') return null

    return window.localStorage.getItem('twitter_id')
}

const setContributorTwitterId = twitterId => {
    if (typeof window === 'undefined') return null

    window.localStorage.setItem('twitter_id', twitterId)
}

const steps = {
    INIT: 'init',
    TWITTER_ASK_FIRST: 'twitter_ask_first',
    TWITTER_INPUT_FIRST: 'twitter_input_first',
    ORIGINAL_MUSIC_ASK: 'original_music_ask',
    ARTIST_ASK: 'artist_ask',
    ARTIST_INPUT: 'artist_input',
    MUSIC_ASK: 'music_ask',
    MUSIC_INPUT: 'music_input',
    MUSIC_ARTIST_ASK: 'music_artist_ask',
    MUSIC_ARTIST_INPUT: 'music_artist_input',
    VIDEO_ARTIST_ASK: 'video_artist_ask',
    VIDEO_ARTIST_INPUT: 'video_artist_input',
    TWITTER_ASK_LAST: 'twitter_ask_last',
    TWITTER_INPUT_LAST: 'twitter_input_last',
    FIN: 'fin'
}

const stepToStage = step => {
    switch(step){
        case steps.INIT: return 0
        case steps.ORIGINAL_MUSIC_ASK: return 1
        case steps.ARTIST_INPUT: return 2
        case steps.MUSIC_INPUT: return 3
        case steps.MUSIC_ARTIST_INPUT: return 4
        case steps.VIDEO_ARTIST_INPUT: return 5
        default: return null
    }
}

const stageToStep = stage => {
    switch(stage) {
        case 0: return steps.TWITTER_ASK_FIRST
        case 1: return steps.ARTIST_ASK
        case 2: return steps.MUSIC_ASK
        case 3: return steps.MUSIC_ARTIST_ASK
        case 4: return steps.VIDEO_ARTIST_ASK
        case 5: return steps.TWITTER_ASK_LAST
        default: return null
    }
}

const validateBirthday = birthday => {
    let {year, month, date} = birthday
    if (month === '' || date === '') return false

    year = year || 8888
    const i = parse(`${year}-${month}-${date}`, 'y-M-d', new Date())
    if (JSON.stringify(i) === 'null') return false
    
    if (year === '') {
        return `${month}-${date}`
    } else {
        return `${year}-${month}-${date}`
    }
}

const copyState = state => JSON.parse(JSON.stringify(state))

const initStateSinger = {
    id: null,
    name: '',
    name_ruby: '',
    profile: '',
    birthday: null,
    birthday_input: {
        year: '',
        month: '',
        date: ''
    },
    url_youtube: '',
    id_youtube: null,
    is_exist_remote_id_youtube: false,
    id_twitter: '',
}

const initStateArtist = {
    id: null,
    name: '',
    id_twitter: '',
}

const initRequestVideo = {
    id: null,
    title: null,
    description: null,
    custom_music_name: '',
    is_original_music: false,
    music: {
        id: '',
        title: '',
        composers: [initStateArtist],
        lyricists: [],
        arrangers: [],
    },
    singers: [initStateSinger],
    mixers: [],
    off_vocals: [],
    arrangers: [],
    contributor_twitter_id: null,
    is_done: false,
    is_issue: false,
    stage: 0,
}

export default ({ data: { allVideo }}) => {
    const [remoteRequestVideos, setRemoteRequestVideos] = useState([])
    const [requestVideo, setRequestVideo] = useState(initRequestVideo)
    const [step, setStepRaw] = useState(steps.INIT)
    const [errorMessage, setErrorMessage] = useState('')
    const [remoteAllArtist, setRemoteAllArtist] = useState([])
    const [remoteAllMusic, setRemoteAllMusic] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)

    const setStep = (step) => {
        window.scrollTo(0, 0)
        setStepRaw(step)
    }

    const refreshState = () => {
        requestVideosLess().then(result => {
            setRemoteRequestVideos(result.data.requestVideos)
        })
        fetchRemoteData.artist()
        fetchRemoteData.music()
        setRequestVideo(initRequestVideo)
        setStep(steps.INIT)
        setErrorMessage()
    }

    const fetchRemoteData = {
        artist: async () => {
            Promise.all(
                [
                    queryAllArtistOnlySingerFull(),
                    queryAllArtistWithoutSingerLess(),
                ]
            ).then(result => setRemoteAllArtist(result.flat()))
                // .then(result => setRemoteAllArtist(result))
        },
        music: async () => {
            allMusic()
                .then(result => setRemoteAllMusic(result.data?.allMusic))
                .catch(e => console.log(e))
        }
    }

    const updateRequestVideoBirthday = (requestVideo, singerIndex, birthdayInput) => {
        const newRequestVideo = copyState(requestVideo)
        newRequestVideo.singers[singerIndex].birthday_input = birthdayInput
        if (validateBirthday(birthdayInput)) {
            newRequestVideo.singers[singerIndex].birthday = validateBirthday(birthdayInput)
        }else if (Object.values(birthdayInput).filter(i=>i === '').length === 3) {
            newRequestVideo.singers[singerIndex].birthday = null
        } else {
            newRequestVideo.singers[singerIndex].birthday = false
        }
        return newRequestVideo
    }

    useEffect(() => {
        if (step === steps.INIT || requestVideo.id === null || requestVideo.description !== null || requestVideo.title !== null) return

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyBkn0LB-sw4ZiPEs069rCEotczo1Qi6ZPY&id=${requestVideo.id}`)
            .then(res => res.json())
            .then(json => json.items?.[0]?.snippet)
            .then(snippet => {
                updateRequestVideo(v => {
                    v.title = snippet?.title || false
                    v.description = snippet?.description || false
                    return v
                })
            })
            .catch(updateRequestVideo(v => {
                v.title = false
                v.description = false
                return v
            }))
    }, [requestVideo.id])

    useEffect(() => {
        refreshState()
    }, [])

    const updateRequestVideo = (func) => {
        let newRequestVideo = copyState(requestVideo)
        newRequestVideo = func(newRequestVideo)
        console.log(JSON.stringify(newRequestVideo, null, 4))
        setRequestVideo(newRequestVideo)
        return newRequestVideo
    }

    if (requestVideo.contributor_twitter_id === null && getContributorTwitterId('twitter_id')) {
        updateRequestVideo(v => {
            v.contributor_twitter_id = getContributorTwitterId('twitter_id'); return v
        })
    }
    if (requestVideo.contributor_twitter_id !== null && requestVideo.contributor_twitter_id !== '') {
        if (step === steps.TWITTER_ASK_FIRST) setStep(steps.ORIGINAL_MUSIC_ASK)
        if (step === steps.TWITTER_ASK_LAST) setStep(steps.FIN)
    }
    // if (step === steps.FIN && requestVideo.contributor_twitter_id !== '' && requestVideo.contributor_twitter_id !== null) {
    //     setContributorTwitterId(requestVideo.contributor_twitter_id)
    // }

    const Choose = ({yes, no, className}) => (
        <ul className={`flex justify-around ${className}`}>
            <li className='px-5 py-3 bg-blue-400 sm:hover:bg-blue-300 text-white rounded-lg cursor-pointer transform scale-90 shadow-lg' onClick={_=> setStep(no)}>あとで！</li>
            <li className='px-5 py-3 bg-red-500 sm:hover:bg-red-400 text-white rounded-lg cursor-pointer shadow-lg' onClick={_=>setStep(yes)}>いいよ！</li>
        </ul>
    )

    const step_elements = {
        init: {
            message: '動画のURLをコピペしよう',
            children: 
                <div>
                    {(remoteRequestVideos.length > 0)
                    ?
                        <FormYoutubeUrl
                            remoteRequestVideos={remoteRequestVideos}
                            requestVideo={requestVideo}
                            updateRequestVideo={updateRequestVideo}
                            allVideo={allVideo}
                            setErrorMessage={setErrorMessage}
                            stageToStep={stageToStep}
                            steps={steps}
                            setStep={setStep}
                            step={step}
                            setIsEditMode={setIsEditMode}
                        />
                    :
                        <p className='text-center text-xl'>読み込み中...🤔</p>
                    }
                </div>
                ,
            qa: [
                {
                    q: 'どんな動画が追加できるの？',
                    a:
                        <div>
                            <p>以下の条件を満たしていればなんでも追加できるよ！</p>
                            <ul>
                                <li>⭐️ Vtuber / Vsinger / Vartist とかの動画であること！</li>
                                <li>⭐️ １つの楽曲だけで構成されてること！（歌枠とかは無理だよ！）</li>
                            </ul>
                            <p>とりあえずリクエストしてみよう！</p>
                        </div>
                },
                {
                    q: 'URLはどうやってコピーするの？',
                    a:
                        <div>
                            <p>【ヒント】<br/>
                            YouTubeアプリを利用している場合は、「共有」ボタンからURLをコピーできます！<br/>
                            PCの場合はアドレスバーからコピペしてね！</p>
                        </div>
                },
                {
                    q: 'バグがあったよ！',
                    a:
                        <div>
                            <p>バグがあったらTwitterで教えてください！</p>
                            <p>👉<a href='https://twitter.com/vtubermusiccom' className='border-b-2'>Vtuber MusicのTwitterアカウント</a>👈</p>
                        </div>
                },
                {
                    q: 'リクエストした動画が追加されてないんだけど！',
                    a:
                        <div>
                            <p>リクエストしてから、サイトに反映されるまでは少し時間がかかるよ！</p>
                            <p>問題がなければ必ず反映されるから待っててね！</p>
                        </div>
                },
                {
                    q: '荒らし対策はどうしてる？',
                    a:
                        <div>
                            <p>この動画リクエストの仕組みは、Vtuber好きのみなさんの善意で成り立っています！</p>
                            <p>入力ミス等は全く問題ありませんが、<span className='text-red-700'>故意で不正なデータを入力する等の行為はやめてください！</span></p>
                        </div>
                }
            ]
        },
        twitter_ask_first: {
            message: 'あなたのTwitterアカウントを教えてくれる？',
            children: <Choose yes={steps.TWITTER_INPUT_FIRST} no={steps.ORIGINAL_MUSIC_ASK}/>,
            qa: [
                {
                    q: 'なんで教えないといけないの？',
                    a: <div>
                        <p>動画追加したときとかに連絡させてもらったりするかも！</p>
                        <p>リクエストした動画数ランキングとかいつか作るかも！</p>
                        <p>なるべく入力してほしいよ！</p>
                    </div>

                }
            ]
        },
        twitter_input_first: {
            message: 'あなたのTwitterアカウントを入力してね！',
            children: 
                <FormTwitter
                    requestVideo={requestVideo}
                    updateRequestVideo={updateRequestVideo}
                    upsertRequestVideo={upsertRequestVideo}
                    setContributorTwitterId={setContributorTwitterId}
                    setStep={setStep}
                    steps={steps}
                    isFirst
                />
        },
        original_music_ask: {
            message: 'オリジナル楽曲ですか？',
            children: 
                <ul className='flex justify-around'>
                    <li
                        className='px-5 py-3 bg-blue-400 sm:hover:bg-blue-300 text-white rounded-lg cursor-pointer transform shadow-lg'
                        onClick={_=>{
                            updateRequestVideo(v => {
                                setStep(steps.ARTIST_ASK)
                                v.is_original_music = false
                                if (v.stage < 1) v.stage = 1
                                upsertRequestVideo(v)
                                return v
                            })
                        }}
                    >いいえ</li>
                    <li
                        className='px-5 py-3 bg-red-500 sm:hover:bg-red-400 text-white rounded-lg cursor-pointer shadow-lg'
                        onClick={_=>{
                            updateRequestVideo(v => {
                                setStep(steps.ARTIST_ASK)
                                v.is_original_music = true
                                v.stage = 1
                                upsertRequestVideo(v)
                                return v
                            })
                        }}
                    >はい</li>
                </ul>,
            qa: [
                {
                    q: 'オリジナル楽曲って？',
                    a: <div>
                        <p>歌ってるVtuberのために作られた楽曲のことだよ！</p>
                        <p>他のアーティストの歌のカバー曲は含まれないよ！</p>
                        <p>「オリジナルMV」と書いてあっても、映像だけがオリジナルで、楽曲はオリジナルではない場合があるから注意しよう！</p>
                    </div>
                }
            ]
        },
        artist_ask: {
            message: '歌っているVtuberの情報を教えてくれる？',
            children: <Choose yes={steps.ARTIST_INPUT} no={steps.TWITTER_ASK_LAST}/>,
            qa: [
                {
                    q: 'なんで必要なの？',
                    a: <div>
                            <p>動画のURLだけでは、誰が歌ってるか特定できないよ！</p>
                            <p>アーティストを登録すると、そのアーティストの歌を関連づけられるよ！</p>
                        </div>
                },
                {
                    q: '入力しないとどうなる？',
                    a: <div>
                        <p>このままではサイトに掲載できないから、他の誰かに入力してもらうことになるよ！</p>
                        <p>掲載まで時間がかかるよ！</p>
                    </div>
                }
            ]
        },
        artist_input: {
            message: '歌っているVtuberの情報を入力してね！',
            children: 
                <FormArtist
                    remoteAllArtist={remoteAllArtist}
                    setRequestVideo={setRequestVideo}
                    requestVideo={requestVideo}
                    updateRequestVideo={updateRequestVideo}
                    copyState={copyState}
                    updateRequestVideoBirthday={updateRequestVideoBirthday}
                    initStateSinger={initStateSinger}
                    setStep={setStep}
                    steps={steps}
                    setErrorMessage={setErrorMessage}
                />,
            qa: [
                {
                    q: 'これ全部入力しなきゃだめなの？',
                    a:
                        <div>
                            <p>入力必須なのは「名前」だけだけど、できれば全部入力してほしいよ！</p>
                            <p>入力すると以下のようなメリットがあるよ！</p>
                            <ul className='py-2'>
                                <li>⭐️<span className='text-red-700'>ふりがな</span>：ひらがなでも検索できるようになる！</li>
                                <li>⭐️<span className='text-red-700'>プロフィール</span>：一目でどんな人か理解できる！</li>
                                <li>⭐️<span className='text-red-700'>誕生日</span>：「今日誕生日のアーティスト」に表示されるようになる！</li>
                            </ul>
                            <p><span className='text-red-700'>Twitter</span>か<span className='text-red-700'>YouTube</span>のどっちかを入力しないと<span className='border-b-2'>アイコン画像が表示されない</span>ので、どっちかは入力しよう！</p>
                        </div>
                },
                {
                    q: 'プロフィールってどれくらい書けば良いの？',
                    a:
                        <div>
                            <p>長いほうが良いよ！</p>
                            <p>ネットからコピペしても良いけど、自分で考えて書いてくれると嬉しいよ！</p>
                            <p>文章を読んだ人がそのVtuberに興味を持つようなプロフィールを書こう！</p>
                        </div>
                }
            ]
        },
        music_ask: {
            message: '曲の名前を教えてくれる？',
            children: <Choose yes={steps.MUSIC_INPUT} no={steps.TWITTER_ASK_LAST}/>,
            qa: [
                {
                    q: 'なんで必要なの？',
                    a: <div>
                            <p>動画のURLだけでは、なんの楽曲か特定できないよ！</p>
                            <p>楽曲を登録すると、楽曲ごとの歌ってみた動画を検索できるようになるよ！</p>
                        </div>
                },
                {
                    q: '入力しないとどうなる？',
                    a: <div>
                        <p>このままではサイトに掲載できないから、他の誰かに入力してもらうことになるよ！</p>
                        <p>掲載まで時間がかかるよ！</p>
                    </div>
                }
            ]
        },
        music_input: {
            message: '曲名を入力してね！',
            children: 
                <FormMusic
                    remoteAllMusic={remoteAllMusic}
                    requestVideo={requestVideo}
                    updateRequestVideo={updateRequestVideo}
                    setStep={setStep}
                    steps={steps}
                />,
                qa: [
                    {
                        q: 'カスタム楽曲名とは？',
                        a: <div>
                                <p>カバー元の楽曲と違うタイトルを表示したいときに設定するよ！</p>
                                <p>アレンジなしバージョンとアレンジありバージョンを区別するときとか！</p>
                                <p>例はこんな感じ！</p>
                                <ul className='py-2'>
                                    <li>⭐️命に嫌われている ➡️ チョコミントは嫌われている</li>
                                    <li>⭐️紅蓮華 ➡️ GURENGE</li>
                                    <li>⭐️Hello, Morning ➡️ Hello, Morning ~Happy New Year Edition~</li>
                                </ul>
                            </div>
                    }
                ]
        },
        music_artist_ask: {
            message: '作曲者と作詞者を教えてくれる？',
            children: <Choose yes={steps.MUSIC_ARTIST_INPUT} no={steps.TWITTER_ASK_LAST}/>,
            qa: [
                {
                    q: 'なんで必要なの？',
                    a: <div>
                            <p>楽曲だけでは、同じ名前の楽曲が被ったりするよ！</p>
                            <p>同じ作曲者の楽曲を歌っている動画を検索できたりするよ！</p>
                        </div>
                },
                {
                    q: '入力しないとどうなる？',
                    a: <div>
                        <p>このままではサイトに掲載できないから、他の誰かに入力してもらうことになるよ！</p>
                        <p>掲載まで時間がかかるよ！</p>
                    </div>
                }
            ]
        },
        music_artist_input: {
            message: '作曲者と作詞者を入力してね！',
            children: 
                <FormMusicArtist
                    remoteAllArtist={remoteAllArtist}
                    updateRequestVideo={updateRequestVideo}
                    requestVideo={requestVideo}
                    initStateArtist={initStateArtist}
                    setStep={setStep}
                    steps={steps}
                />,
                qa: [
                    {
                        q: 'どうやって調べるの？',
                        a: <div>
                            <p>Googleで楽曲名を検索して作曲者と作詞者を調べてね！</p>
                        </div>
                    },
                    {
                        q: 'TwitterIDわからないんだけど',
                        a: <div>
                                <p>分からなかったら入力しないで良いよ！</p>
                                <p>でもアイコン画像が表示されないから、なるべく入力してね！</p>
                            </div>
                    },
                    {
                        q: '小さく書いてあるIDってやつ何？',
                        a: <div>
                            <p>アーティストを識別するIDだよ！</p>
                            <p>同じ名前でもIDが違うと別のアーティストとして判断されるから気をつけよう！</p>
                        </div>
                    },
                ]
        },
        video_artist_ask: {
            message: 'MIXとかしてる人を教えてくれる？',
            children: 
                <div>
                    <Choose yes={steps.VIDEO_ARTIST_INPUT} no={steps.TWITTER_ASK_LAST} className='mb-5'/>
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
                        >概要欄にMIXとか書いてない！</button>
                    </div>
                </div>,
            qa: [
                {
                    q: 'MIXとか良くわからない...',
                    a: <div>
                            <p>動画の概要欄を見て、「MIX」とか「カラオケ」とかやってる人を入力してくれるだけでいいよ！</p>
                            <p>ぱっと見て、そういう人がいなかったら、「いいよ！」に進んでから「MIXとかしてる人いない」をクリックしてね！</p>
                        </div>
                },
                {
                    q: 'なんで必要なの？',
                    a: <div>
                            <p>MIXした人ごとに検索できたりして便利だよ！</p>
                        </div>
                },
                {
                    q: '入力しないとどうなる？',
                    a: <div>
                        <p>このままではサイトに掲載できないから、他の誰かに入力してもらうことになるよ！</p>
                        <p>掲載まで時間がかかるよ！</p>
                    </div>
                }
            ]
        },
        video_artist_input: {
            message: 'MIXとかしてる人を入力してね！',
            children:
                <FormVideoArtist
                    remoteAllArtist={remoteAllArtist}
                    updateRequestVideo={updateRequestVideo}
                    requestVideo={requestVideo}
                    initStateArtist={initStateArtist}
                    setStep={setStep}
                    steps={steps}
                />,
                qa: [
                    {
                        q: 'どうやって調べるの？',
                        a: <div>
                            <p>だいたい動画の概要欄に書いてあるよ！</p>
                        </div>
                    },
                    {
                        q: 'それぞれの項目の意味がわからないよ！',
                        a: <div>
                                <ul className='py-2'>
                                    <li>⭐️<span className='text-red-700'>ミックス</span>：MIXとかの項目だよ！一番頻繁に出てくる！</li>
                                    <li>⭐️<span className='text-red-700'>オフボーカル</span>：カラオケとか音源制作とかともいう！ギターとかもここに書いちゃおう！</li>
                                    <li>⭐️<span className='text-red-700'>アレンジ</span>：動画のアレンジしてる人！楽曲の編曲者と間違えないようにしよう！</li>
                                </ul>
                            </div>
                    },
                    {
                        q: 'TwitterIDわからないんだけど！',
                        a: <div>
                                <p>分からなかったら入力しないで良いよ！</p>
                                <p>でもアイコン画像が表示されないから、なるべく入力してね！</p>
                            </div>
                    },
                    {
                        q: '小さく書いてあるIDってやつ何？',
                        a: <div>
                            <p>アーティストを識別するIDだよ！</p>
                            <p>同じ名前でもIDが違うと別のアーティストとして判断されるから気をつけよう！</p>
                        </div>
                    },
                ]
        },
        twitter_ask_last: {
            message: 'あなたのTwitterアカウントを教えてくれる？',
            children: <Choose yes={steps.TWITTER_INPUT_LAST} no={steps.FIN}/>,
            qa: [
                {
                    q: 'なんで教えないといけないの？',
                    a: <div>
                        <p>動画追加したときとかに連絡させてもらったりするかも！</p>
                        <p>リクエストした動画数ランキングとかいつか作るかも！</p>
                        <p>なるべく入力してほしいよ！</p>
                    </div>

                }
            ]
        },
        twitter_input_last: {
            message: 'あなたのTwitterアカウントを入力してね！',
            children: 
                <FormTwitter
                    requestVideo={requestVideo}
                    updateRequestVideo={updateRequestVideo}
                    upsertRequestVideo={upsertRequestVideo}
                    setContributorTwitterId={setContributorTwitterId}
                    setStep={setStep}
                    steps={steps}
                />
        },
        fin: {
            message: <ClosingMessage requestVideo={requestVideo}/>,
            children: 
                <div>
                    <TwitterShareButton
                        url={`https://vtuber-music.com/`}
                        title={`#VtuberMusic に${requestVideo.singers.map(i=>` #${i.name} さん`).join('と')}が歌っている「${requestVideo.music.title}」をリクエストしたよ！`}
                        related={[`VtuberMusicCom`]}
                        className="flex items-center mb-7 mx-5"
                    >
                        <TwitterIcon size={42} round className='mr-3'/><span className='text-xs text-gray-600 text-left'>Twitterで{requestVideo.singers.map(i=>i.name).join('さん&')}さんの{requestVideo.music.title}をリクエストしたことを共有しよう！</span>
                    </TwitterShareButton>

                    <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => refreshState()}
                    >もっと追加する！</button>
                </div>
        },
    }

    // const nextStep = () => setStep(step + 1)

    // if (videoId && !videoIdList.includes(videoId)) window.location.href = `https://ws.formzu.net/dist/S31309131/?importv=${encodeURIComponent('https://youtu.be/' + videoId)}`

    return(
        <div className='w-full'>
            <div className='max-w-2xl mx-auto bg-white h-full py-5'>
                <StepButtons
                    requestVideo={requestVideo}
                    steps={steps}
                    step={step}
                    setStep={setStep}
                    stepToStage={stepToStage}
                    stageToStep={stageToStep}
                    isEditMode={isEditMode}
                />

                <Heading className='mb-3 mx-3' text='動画を追加してみよう！'/>

                <div className='px-4 mb-14'>
                    <h2 className='mx-auto px-2 py-3 mb-5 leading-7 text-center border whitespace-pre-wrap'>
                        {isEditMode && 
                        <div className='mb-4'>
                            <span className='py-1 px-1 mb-3 mx-auto border border-red-500 text-red-600'>編集モード</span>
                            <p className='text-red-600'>※「決定」ボタンを押さないと変更が保存されません！</p>
                        </div>}
                        {step_elements[step].message}
                        <p className='text-red-600'>
                            {errorMessage}
                        </p>
                    </h2>
                    {step_elements[step].children}
                </div>

                {(step === steps.INIT || step === steps.FIN) &&
                    <Link to={'/request_add_video_preview'}>
                        <button
                            className='mx-auto block px-4 py-2 mb-10 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        >リクエスト一覧</button>
                    </Link>
                }

                {step !== steps.INIT &&
                    <div className='mb-10'>
                        <Youtube
                            videoId={requestVideo.id}
                            opts={{}}
                            containerClassName={"youtubeContainer"}
                        />
                    </div>
                }

                {requestVideo.id &&
                    <div>
                        {requestVideo.title === false && <p className='text-center'>タイトルの取得に失敗しました😨</p>}
                        {requestVideo.title === null && <p className='text-center'>タイトルを読み込み中🤔</p>}
                        {requestVideo.title && <h3 className='whitespace-pre-wrap text-lg border mx-2 my-4 px-2 py-3 overflow-hidden'>{requestVideo.title}</h3>}
                        {requestVideo.description === false && <p className='text-center'>概要欄の取得に失敗しました😨</p>}
                        {requestVideo.description === null && <p className='text-center'>概要欄を読み込み中🤔</p>}
                        {requestVideo.description && <p className='whitespace-pre-wrap text-sm border mx-2 my-4 px-2 py-3 overflow-hidden'>{requestVideo.description}</p>}
                    </div>
                }

                <ul className='mx-5'>
                    {
                        step_elements[step].qa?.map((qa, key) => (
                            <li className='py-2 px-3 mb-5 border' key={key}>
                                <h3 className='border-b pb-2'><span className='text-red-600 font-bold'>Q. </span>{qa.q}</h3>
                                <div className='py-2 text-sm leading-7'>{qa.a}</div>
                            </li>
                        ))
                    }
                </ul>

                {step !== steps.INIT && step !== steps.FIN &&
                    <div className='mb-10'>
                        <a href={`https://www.youtube.com/watch?v=${requestVideo.id}`} target='_blank' className='block mb-5'>
                            <button
                                className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                            >動画を確認する</button>
                        </a>

                        <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => {
                            refreshState()
                            navigate('/request_add_video')
                        }}
                        >この動画の登録を中断する</button>
                        <p className='text-xs text-gray-400 text-center'>登録を中断しても、データは保存されるよ!</p>
                    </div>
                }

                {step !== steps.INIT && step !== steps.FIN &&
                    <Link to={'/request_add_video_preview'}>
                        <button
                            className='mx-auto block px-4 py-2 mb-10 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        >リクエスト一覧</button>
                    </Link>
                }

                {step === steps.INIT && getContributorTwitterId() &&
                    <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => setContributorTwitterId('')}
                    >入力したTwitterID(@{getContributorTwitterId()})の訂正</button>
                }


                <table className='mx-auto text-xs text-gray-400'>
                    <thead>
                        <tr>
                            <th colSpan={2}>DEBUG</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>allVideo</td><td>{allVideo.nodes.length}</td>
                        </tr>
                        <tr>
                            <td>remoteAllMusic</td><td>{remoteAllMusic.length}</td>
                        </tr>
                        <tr>
                            <td>remoteAllArtist</td><td>{remoteAllArtist.length}</td>
                        </tr>
                        <tr>
                            <td>remoteRequestVideos</td><td>{remoteRequestVideos.length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const ClosingMessage = ({ requestVideo }) => {
    const [requestCount, setRequestCount] = useState(0)

    const fetchRequestCount = async (twitterId) => {
        const count = await requestVideosCountByTwitterId(twitterId)
        setRequestCount(count)
    }

    useEffect(() => {
        const twitterId = requestVideo.contributor_twitter_id
        if (twitterId) {
            fetchRequestCount(twitterId)
        }
    }, [])

    return (
        <p>
            {requestVideo.contributor_twitter_id ? `@${requestVideo.contributor_twitter_id}さん` : ''}リクエストありがとうございました！
            {requestCount > 1 && `これで${requestCount}本目のリクエストですね！！\nいつもありがとうございます！！！`}
            あなたのおかげでより良いサイトになります！！
        </p>
    )
}

export const query = graphql`
{
    allVideo {
        nodes {
            id
            release_date
            is_mv
            original_video_id
            custom_music_name
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
            music {
                id
                title
                title_ruby
            }
            singers {
                id
                name
                name_ruby
                profile_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
                        }
                    }
                }
            }
        }
    }
}`