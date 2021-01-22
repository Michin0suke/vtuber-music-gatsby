import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { upsertRequestVideo } from '../queries/requestVideo'
import { upsertVideo } from '../queries/video'
import './request_add_video_preview.css'
import Youtube from 'react-youtube'
import InfiniteScroll from 'react-infinite-scroll-component'
import { requestVideosPaginate, queryRequestCountByDay } from '../queries/requestVideo'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const getContributorTwitterId = () => {
    return window.localStorage.getItem('twitter_id')
}

const Row = ({l, m, r}) => (
    <div className='sm:flex leading-6 py-2 sm:py-0.5'>
        <p className='px-2 mr-3 w-28 text-center bg-red-400 text-white'>{l}</p>
        {m && <p className='mr-3'>{m}</p>}
        {r && <p className='text-gray-500'>{r}</p>}
    </div>
)

const fetchOnce = 100

export default () => {
    const [expandIndex, setExpandIndex] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [contents, setContents] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [remoteRequestVideosCountAll, setRemoteRequestVideoCountAll] = useState(0)
    const [remoteRequestVideosCountIsNotDone, setRemoteRequestVideoCountIsNotDone] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [requestCountData, setRequestCountData] = useState([{count: 0, date: '2021/1/1 0'}])

    const resetContents = () => {
        setIsLoading(true)
        setContents([])
        fetchRemoteRequestVideos(1)
    }

    const addContents = (newContents, currentContents) => {
        const contentsCopy = currentContents ? JSON.parse(JSON.stringify(contents)) : []
        contentsCopy.push(...newContents)
        setContents(contentsCopy)
    }

    const parseContents = async (requestVideos) => {
        return await Promise.all(
            requestVideos
                .map(async requestVideo => {
                    try {
                        const parsedContent = JSON.parse(requestVideo.content)
                        parsedContent.updated_at = requestVideo.updated_at
                        return parsedContent
                    } catch(e) {
                        console.log(`failed parse content: ${requestVideo.content}`)
                        console.log(e)
                        return null
                    }
                })
        )
    }

    const fetchRemoteRequestVideos = async (page, currentContents) => {
        const parsedContents = await requestVideosPaginate(fetchOnce, page)
            .then(result => {
                setCurrentPage(page)
                const hasMore = result.data.requestVideosPaginate.paginatorInfo.hasMorePages
                const countAll = result.data.requestVideosCount
                const countIsNotDone = result.data.requestVideosPaginate.paginatorInfo.total

                if (!hasMore) setHasMore(false)
                setRemoteRequestVideoCountAll(countAll)
                setRemoteRequestVideoCountIsNotDone(countIsNotDone)

                return parseContents(result.data.requestVideosPaginate.data)
            })
            .catch(e => {throw new Error(e)})

        addContents(parsedContents, currentContents)
        setIsLoading(false)
    }

    useEffect(() => {
        queryRequestCountByDay().then(result => {
            let acc = 0
            const accResult = result.data.requestVideosCountByDay.map(cur => {
                const nextAcc = acc + cur.count
                acc += cur.count
                cur.count = nextAcc
                return cur
            })
            setRequestCountData(accResult)
        })
    }, [])

    useEffect(() => {
        fetchRemoteRequestVideos(1)
    }, [])

    return (
        <div className='w-full'>
            <div className='max-w-2xl mx-auto'>
                {isLoading
                ? <p className='text-center text-gray-600 leading-6'>Loading...🤔</p>
                : <p className='text-sm text-gray-600 leading-6'>{remoteRequestVideosCountIsNotDone}件の待機中リクエストがあります。<span className='text-gray-400'>総リクエスト数:{remoteRequestVideosCountAll}件</span></p>}

                {requestCountData.length > 1 &&
                    <div className='w-full h-60'>
                        <ResponsiveContainer width="95%">
                            <LineChart width={600} height={300} data={requestCountData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <XAxis dataKey='date' tickFormatter={(props) => props.match(/\d+\/(\d+\/\d+) \d+/)[1]}/>
                                <YAxis />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                <Legend verticalAlign="top" height={36}/>
                                <Line dataKey="count" stroke="#DC2626" dot={false} strokeWidth={5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>}

                <button className='block mx-auto text-3xl mb-3' onClick={() => resetContents()}>🔄</button>

                <InfiniteScroll
                    dataLength={contents.length} //This is important field to render the next data
                    next={() => fetchRemoteRequestVideos(currentPage + 1, contents)}
                    hasMore={hasMore}
                    className='sm:px-2 flex flex-wrap justify-start'
                    loader={<p className="loader w-full text-lg text-center leading-8" key={0}>Loading ...🤔</p>}
                >
                    {contents.map((content, key) => (
                        <Card
                            key={key}
                            expandIndex={expandIndex}
                            setExpandIndex={setExpandIndex}
                            cardIndex={key}
                            content={content}
                        />))}
                </InfiniteScroll>
                <ul>
                    <li className='py-2 px-3 mb-5 border bg-white mt-5'>
                        <h3 className='border-b pb-2'><span className='text-red-600 font-bold'>Q. </span>リクエストしたのに一覧にないよ！</h3>
                        <div className='py-2 text-sm leading-7'>
                            <p>ここの一覧にある動画は、問題がなければデータベースに追加されて、一覧から消えるよ！</p>
                            <p>しばらくしたらサイトに反映されるから、待っててね！</p>
                        </div>
                    </li>
                    <li className='py-2 px-3 mb-5 border bg-white'>
                        <h3 className='border-b pb-2'><span className='text-red-600 font-bold'>Q. </span>「問題あり」ってボタンなに？</h3>
                        <div className='py-2 text-sm leading-7'>
                            <p>問題がありそうなリクエストを見つけたときに押してね！</p>
                            <p>データベースに追加する前に問題がないか確認するよ！</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

const Card = ({
    expandIndex,
    setExpandIndex,
    cardIndex,
    content,
}) => {
    const [status, setStatus] = useState(false)
    const [pos, setPos] = useState({ y: (Math.random()) * 500 + 20, x: (Math.random()) * 1000 + 20 })
    return (
        <div className={`w-full`}>
            <article className={`w-full mb-2 bg-white select-none rounded overflow-hidden shadow-sm ${status === 'failed' ? 'border-4 border-red-500' : 'border'} ${status === 'success' || status === 'sending' ? 'hidden' : ''}`}>
                <h2 className={`relative cursor-pointer sm:hover:bg-red-50 pl-7 pr-5 leading-8 ${expandIndex === cardIndex && 'bg-red-100'}`}>
                    <div className='absolute left-0 h-full flex flex-col'>
                        <span className={`h-full w-1.5 ${content.singers.name_ruby !== '' && 'bg-green-300'}`}/>
                        <span className={`h-full w-1.5 ${content.singers.profile !== '' && 'bg-green-200'}`}/>
                        <span className={`h-full w-1.5 ${content.singers.birthday && 'bg-green-300'}`}/>
                        <span className={`h-full w-1.5 ${content.singers.id_youtube && 'bg-green-200'}`}/>
                        <span className={`h-full w-1.5 ${content.singers.id_twitter != '' && 'bg-green-300'}`}/>
                    </div>
                    <div className='absolute left-1.5 h-full flex flex-col'>
                        <span className={`h-full w-1.5 ${content.music.composers.length > 0 && 'bg-yellow-300'}`}/>
                        <span className={`h-full w-1.5 ${content.music.lyricists.length > 0 && 'bg-yellow-300'}`}/>
                        <span className={`h-full w-1.5 ${content.music.arrangers.length > 0 && 'bg-yellow-300'}`}/>
                    </div>
                    <div className='absolute left-3 h-full flex flex-col'>
                        <span className={`h-full w-1.5 ${content.mixers.length > 0 && 'bg-red-300'}`}/>
                        <span className={`h-full w-1.5 ${content.off_vocals.length > 0 && 'bg-red-300'}`}/>
                        <span className={`h-full w-1.5 ${content.arrangers.length > 0 && 'bg-red-300'}`}/>
                    </div>
                    <span className='pr-2 text-red-600'>{content.stage}</span>
                    <span className='pr-2 text-gray-800'>{content.singers.map(i=>i.name).join(' & ')}</span>
                    <span className='pr-2 text-gray-500'>{content.music.title}</span>
                    {content.is_original_music && <span className='inline-block right-0 bg-blue-500 h-3 w-3'/>}
                    {!content.contributor_twitter_id && <span className='inline-block right-0 bg-yellow-500 h-3 w-3'/>}
                    {content.is_issue && <span className='inline-block right-0 bg-red-600 h-3 w-3'/>}
                    <div className='absolute top-0 left-0 w-full h-full' onClick={() => setExpandIndex(cardIndex)}/>
                    {(content.stage === 4 || content.stage === 5 ) && getContributorTwitterId() === 'VtuberMusicCom' &&
                        <button
                            className={`absolute right-0 z-10 h-full px-1 py-1 ${content.stage === 4 ? 'bg-red-500 sm:hover:bg-red-400' : 'bg-blue-500 sm:hover:bg-blue-400'} text-xs text-white shadow rounded`}
                            onClick={() => {
                                setStatus('sending')
                                upsertVideo(content)
                                .then(res => {
                                    content.is_done = true
                                    upsertRequestVideo(content)
                                        .then(() => setStatus('success'))
                                        .catch(e => {
                                            setStatus('failed')
                                            console.log(e)
                                        })
                                })
                                .catch(e => {
                                    setStatus('failed')
                                    console.log(e)
                                })
                            }}
                        >{status === 'sending' ? <span className='text-xl'>🔄</span> : '送信'}</button>
                    }
                    {content.title && <p className='text-xs text-gray-400'>{content.title}</p>}
                </h2>
                <div className={`card-container ${expandIndex === cardIndex ? 'show mx-5 mb-3' : 'm-0'}`}>
                    {expandIndex === cardIndex &&
                        <Youtube
                            videoId={content.id}
                            opts={{}}
                            containerClassName={"youtubeContainer"}
                        />
                    }
                    <Row l='STAGE' m={content.stage === 5 ? 'READY' : content.stage}/>
                    <Row l='ID' m={<a href={`https://www.youtube.com/watch?v=${content.id}`} target='_blank' className='border-b-2'>{content.id}</a>}/>
                    <Row l='オリジナル' m={content.is_original_music ? 'YES' : 'NO'}/>
                    <Row l='楽曲名' m={content.music.title} r={`(${content.music.id})`}/>
                    {content.music.custom_music_name && <Row l='カスタム楽曲名' m={content.music.custom_music_name}/>}
                    {content.singers.map((artist, key2) => <Row key={key2} l='歌' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.music.composers.map((artist, key2) => <Row key={key2} l='作曲' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.music.lyricists.map((artist, key2) => <Row key={key2} l='作詞' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.music.arrangers.map((artist, key2) => <Row key={key2} l='編曲' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.mixers.map((artist, key2) => <Row key={key2} l='ミックス' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.off_vocals.map((artist, key2) => <Row key={key2} l='オフボーカル' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.arrangers.map((artist, key2) => <Row key={key2} l='アレンジ' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                    {content.contributor_twitter_id
                        ?   <Row l='リクエスト' m={<a href={`https://twitter.com/${content.contributor_twitter_id}`} target='_blank' className='border-b-2'>@{content.contributor_twitter_id}</a>}/>
                        :   <Row l='リクエスト' m='匿名'/>
                    }
                    <Row l='更新日時' m={content.updated_at}/>
                    {content.stage < 5 && 
                        <Link to={`/request_add_video?id=${content.id}`}>
                            <button className='mx-auto mt-3 block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'>データを追加！</button>
                        </Link>}
                    {content.stage === 5 && 
                        <Link to={`/request_add_video?id=${content.id}`}>
                            <button className='mx-auto mt-3 block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'>編集！</button>
                        </Link>}
                    {content.is_issue && <button className='mx-auto mt-3 block px-4 py-2 bg-yellow-500 text-white shadow'>確認中</button>}
                    <div className='flex justify-around'>
                        {content.stage === 5 && getContributorTwitterId() === 'VtuberMusicCom' &&
                            <button
                                className='mt-3 block px-4 py-2 bg-blue-500 sm:hover:bg-blue-400 text-white shadow rounded-full'
                                onClick={() => {
                                    setStatus('sending')
                                    upsertVideo(content)
                                    .then(res => {
                                        content.is_done = true
                                        upsertRequestVideo(content)
                                            .then(() => setStatus('success'))
                                            .catch(e => {
                                                setStatus('failed')
                                                console.log(e)
                                            })
                                    })
                                    .catch(e => {
                                        setStatus('failed')
                                        console.log(e)
                                    })
                                }}
                            >問題なし！</button>
                        }
                        {!content.is_issue && getContributorTwitterId() &&
                            <button
                                className='mt-3 block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                                onClick={() => {
                                    setStatus('sending')
                                    content.is_issue = true
                                    upsertRequestVideo(content)
                                        .then(() => setStatus('success'))
                                        .catch(e => {
                                            setStatus('failed')
                                            console.log(e)
                                        })
                                }}
                            >問題あり！</button>
                        }
                    </div>
                </div>
            </article>
            {/* <span className='inline-block ball-animation rounded-full absolute w-32 h-32 bg-red-600 pointer-events-none' style={{ top: Math.random() * 500 + 20, left: Math.random() * 1000 + 20 }}/> */}
            {status === 'sending' && <span className='inline-block opacity-70 ball-animation rounded-full fixed z-50 w-40 h-40 bg-red-600 pointer-events-none' style={{ top: pos.y, left: pos.x }}/>}
        </div>
    )
}