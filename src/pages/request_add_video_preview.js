import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import { requestVideos, upsertRequestVideo } from '../queries/requestVideo'
import { upsertVideo } from '../queries/video'

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

export default () => {
    const [remoteRequestVideos, setRemoteRequestVideos] = useState([])

    const fetchRemoteRequestVideos = () => {
        requestVideos()
            .then(result => result.data?.requestVideos)
            .then(requestVideos => setRemoteRequestVideos(requestVideos))
    }

    useEffect(() => {
        fetchRemoteRequestVideos()
    }, [])

    return (
        <Layout>
            <div className='max-w-2xl mx-auto'>
                {/* <button className='block mx-auto text-3xl' onClick={() => fetchRemoteRequestVideos()}>🔄</button> */}
                {remoteRequestVideos.map((request, key) => {
                    const content = JSON.parse(request.content)
                    if (request.is_done) return

                    return (
                        <article key={key} className='w-full px-5 py-3 mb-5 bg-white border'>
                            <Row l='STAGE' m={content.stage === 5 ? 'READY' : content.stage}/>
                            <Row l='ID' m={<a href={`https://www.youtube.com/watch?v=${content.id}`} target='_blank' className='border-b-2'>{content.id}</a>}/>
                            <Row l='オリジナル' m={content.is_original_music ? 'YES' : 'NO'}/>
                            <Row l='楽曲名' m={content.music.title} r={`(${content.music.id})`}/>
                            {content.music.custom_title && <Row l='カスタム楽曲名' m={content.music.custom_title}/>}
                            {content.singers.map((artist, key2) => <Row key={key2} l='歌' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.music.composers.map((artist, key2) => <Row key={key2} l='作曲' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.music.lyricists.map((artist, key2) => <Row key={key2} l='作詞' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.music.arrangers.map((artist, key2) => <Row key={key2} l='編曲' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.mixers.map((artist, key2) => <Row key={key2} l='ミックス' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.off_vocals.map((artist, key2) => <Row key={key2} l='オフボーカル' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.arrangers.map((artist, key2) => <Row key={key2} l='アレンジ' m={artist.name} r={`@${artist.id_twitter} (${artist.id})`}/>)}
                            {content.contributor_twitter_id
                                ?   <Row l='最終編集者' m={<a href={`https://twitter.com/${content.contributor_twitter_id}`} target='_blank' className='border-b-2'>@{content.contributor_twitter_id}</a>}/>
                                :   <Row l='最終編集者' m='匿名'/>
                            }
                            {request.stage < 5 && 
                                <Link to={`/request_add_video?id=${request.id}`}>
                                    <button className='mx-auto mt-3 block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'>データを追加！</button>
                                </Link>}
                            {request.is_issue && <button className='mx-auto mt-3 block px-4 py-2 bg-yellow-500 text-white shadow'>確認中</button>}
                            {request.stage === 5 && !request.is_issue && getContributorTwitterId() &&
                                <div className='flex justify-around'>
                                    <button
                                        className='mt-3 block px-4 py-2 bg-blue-500 sm:hover:bg-blue-400 text-white shadow rounded-full'
                                        onClick={() => {
                                            upsertVideo(content)
                                            .then(res => {
                                                console.log(res)
                                                content.is_done = true
                                                upsertRequestVideo(content).then(() => fetchRemoteRequestVideos())
                                            })
                                            .catch(e => console.log(e))
                                        }}
                                    >問題なし！</button>
                                    <button
                                        className='mt-3 block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                                        onClick={() => {
                                            upsertVideo(content)
                                            .then(res => {
                                                console.log(res)
                                                content.is_issue = true
                                                upsertRequestVideo(content).then(() => fetchRemoteRequestVideos())
                                            })
                                            .catch(e => console.log(e))
                                        }}
                                    >問題あり！</button>
                                </div>
                            }
                        </article>
                    )
                })}
            </div>
        </Layout>
    )
}