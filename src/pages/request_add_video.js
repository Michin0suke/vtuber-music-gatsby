import React, { useState } from 'react'
import Layout from '../components/layout'
import VideoCard from '../components/videoCard'
import Heading from '../components/heading'
import Plus from '../components/svg/plus'

const validateUrl = (url) => {
    if (url.match(/^https:\/\/www.youtube.com\/watch\?v=([\w-]{11})(&.+)?$/)) {
        return url.match(/^https:\/\/www.youtube.com\/watch\?v=([\w-]{11})(&.+)?$/)[1]
    }
    if (url.match(/^https:\/\/youtu.be\/([\w-]{11})$/)) {
        return url.match(/^https:\/\/youtu.be\/([\w-]{11})$/)[1]
    }
    return false
}

export default ({ data: { allVideo }}) => {
    const [videoIdList] = useState(allVideo.nodes.map(video => video.id))
    const [videoId, setVideoId] = useState(false)
    const [formText, setFormText] = useState('')

    // if (videoId && !videoIdList.includes(videoId)) window.location.href = `https://ws.formzu.net/dist/S31309131/?importv=${encodeURIComponent('https://youtu.be/' + videoId)}`

    return(
        <Layout currentPage='/request_add_video'>
            <div className='max-w-2xl mx-auto bg-white h-full mt-10 py-10 md:shadow-lg'>
                <Heading className='mb-10 mx-3' text='動画を追加してみよう！'/>
                <div className='px-8'>
                    <p className='text-red-600 h-7'>
                        {formText === '' ? 'URLを入力してね！👇👇' : ''}
                        {!videoId && formText !== '' ? 'URLが無効です！' : ''}
                        {videoIdList.includes(videoId) ? 'この動画はすでに登録されています！' : ''}
                    </p>
                    <div className='flex items-center mb-16 w-full'>
                        <input
                            placeholder='動画のURLを入力してね！'
                            className='block border w-full py-1 px-2 rounded'
                            value={formText}
                            onChange={e => {
                                setFormText(e.target.value)
                                setVideoId(validateUrl(e.target.value))
                            }}
                        />
                        <div onClick={() => setFormText('')}>
                            <Plus color='red' className='transform rotate-45 w-7 h-7 ml-3 cursor-pointer'/>
                        </div>
                    </div>
                    {formText === '' &&
                        <section className='text-sm text-gray-600 leading-8'>
                            <p>以下の条件を満たしていればなんでも追加できるよ！</p>
                            <ul className='my-5'>
                                <li>⭐️ Vtuber / Vsinger / Vartist とかの動画であること！</li>
                                <li>⭐️ １つの楽曲だけで構成されてること！（歌枠とかは無理だよ！）</li>
                            </ul>
                            <p>とりあえずリクエストしてみよう！</p>
                        </section>
                    }
                    {formText !== '' && videoId && !videoIdList.includes(videoId) &&
                        <iframe className='w-full' style={{height: 700}} src={`https://ws.formzu.net/dist/S31309131/?importv=${encodeURIComponent('https://youtu.be/' + videoId)}`}/>
                        // <a href={`https://ws.formzu.net/dist/S31309131/?importv=${encodeURIComponent('https://youtu.be/' + videoId)}`}>
                        //     <button className='block mx-auto py-2 px-3 bg-red-600 sm:hover:bg-red-500 text-white rounded-lg shadow-lg'>リクエストを送信</button>
                        // </a>
                    }
                    {formText !== '' && !videoId ?
                        <div>
                            <p className='leading-9'>【ヒント】<br/>
                            YouTubeアプリを利用している場合は、「共有」ボタンからURLをコピーできます！<br/>
                            PCの場合はアドレスバーからコピペしてね！</p>
                        </div>
                    : ''}
                    {videoIdList.includes(videoId) &&
                        // <pre>{JSON.stringify(allVideo.nodes.filter(video => video.id === videoId))}</pre>
                        <VideoCard video={allVideo.nodes.filter(video => video.id === videoId)[0]} withPublishDate/>
                    }
                </div>
            </div>
        </Layout>
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
                    fluid(maxWidth: 300) {
                        ...GatsbyImageSharpFluid_withWebp
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
                        id
                        fluid(maxWidth: 60) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        }
    }
}`