import React, { useState } from 'react'
import { graphql, navigate } from 'gatsby'
import SEO from '../components/seo'
import VideoCard from '../components/videoCard'
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import SortBar from '../components/sortBar'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import Loading from '../components/svg/loading'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'

const IndexPage = ({ data: { allVideo } }) => {
  const [page, setPage] = useState(0)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const addVideos = (newVideos) => {
    const videosCopy = JSON.parse(JSON.stringify(videos))
    videosCopy.push(...newVideos)
    setVideos(videosCopy)
  }

  const fetchVideos = (nextPage) => {
    fetch(`/all_video_order_by_release_date-${nextPage}.json`)
      .then(response => response.json())
      .then(json => addVideos(json.items))
      .then(() => setPage(nextPage))
      .catch(e => {
        setHasMore(true)
        console.log(e)
      })
  }

  return (
    <div className='w-full'>
        <SEO isTop isIndex/>
        <p className='px-2 py-1 text-gray-500 text-xs'>Vtuberの歌ってみた動画をまとめたサイトです。{allVideo.totalCount}本の動画が登録されています。</p>
        <SortBar path='/'/>

        <div className='sm:px-2 flex flex-wrap justify-start'>
            {allVideo.nodes.map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </div>

        <TwitterShareButtonWrapper videoTotalCount={allVideo.totalCount}/>

        <InfiniteScroll
            dataLength={videos.length}
            next={() => fetchVideos(page + 1)}
            hasMore={hasMore}
            className='sm:px-2 flex flex-wrap justify-start'
            loader={<Loading className='w-10 h-10 mx-auto'/>}
            // loader={<p className="loader w-full text-lg text-center leading-8" key={0}>Loading ...</p>}
        >
            {videos.map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </InfiniteScroll>

    </div>
  )
}

const TwitterShareButtonWrapper = ({ videoTotalCount }) => (
    <TwitterShareButton
        url={'https://vtuber-music.com/'}
        title={`#VtuberMusic でVtuberの歌を聞こう！${videoTotalCount}本の歌が登録されているよ！`}
        related={['VtuberMusicCom']}
        className="flex items-center mb-3 mx-5"
    >
        <TwitterIcon size={42} round className='mr-3'/>
        <span className='text-xs text-gray-600 text-left'>Twitterで共有して、Vtuber Musicをみんなに使ってもらおう！</span>
    </TwitterShareButton>
)

export default IndexPage

export const query = graphql`
fragment ImageSharpFluid on ImageFluid {
    aspectRatio
    src
    srcSet
    sizes
}
{
    # limitはgatsby-config.jsに依存
    allVideo(sort: {order: DESC, fields: release_date}, limit: 24) {
        totalCount
        nodes {
            id
            release_date
            is_original_music
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
            }
            singers {
                id
                name
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
}
`
