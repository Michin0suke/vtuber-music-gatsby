import React, { useState } from "react"
import { graphql } from "gatsby"
import SEO from '../components/seo'
import VideoCard from '../components/videoCard'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import SortBar from '../components/sortBar'
import { TwitterShareButton, TwitterIcon } from "react-share";

const IndexPage = ({ data: { allVideo }}) => {
    const [showVideoIndex, setShowVideoIndex] = useState(24)

    return (
    <div className='w-full'>
        <SEO isTop isFollow/>
        <p className='px-2 py-1 text-gray-500 text-xs'>Vtuberの歌ってみた動画をまとめたサイトです。{allVideo.totalCount}本の動画が登録されています。</p>
        <SortBar path='/'/>

        <div className='sm:px-2 flex flex-wrap justify-start'>
            {allVideo.nodes.slice(0, 12).map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </div>

        <TwitterShareButton
            url={`https://vtuber-music.com/`}
            title={`#VtuberMusic でVtuberの歌を聞こう！${allVideo.totalCount}本の歌が登録されているよ！`}
            related={[`VtuberMusicCom`]}
            className="flex items-center mb-3 mx-5"
        >
            <TwitterIcon size={42} round className='mr-3'/>
            <span className='text-xs text-gray-600 text-left'>Twitterで共有して、Vtuber Musicをみんなに使ってもらおう！</span>
        </TwitterShareButton>


        <InfiniteScroll
            dataLength={showVideoIndex - 12}
            next={() => setShowVideoIndex(showVideoIndex + 12)}
            hasMore={allVideo.nodes.length > showVideoIndex}
            className='sm:px-2 flex flex-wrap justify-start'
        >
            {allVideo.nodes.slice(12, showVideoIndex).map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </InfiniteScroll>

    </div>
  )
}

export default IndexPage

export const query = graphql`
{
    allVideo(sort: {order: DESC, fields: release_date}, limit: 300) {
        totalCount
        nodes {
            id
            release_date
            is_original_music
            custom_music_name
            thumbnail_image {
                childImageSharp {
                    fluid(maxWidth: 330) {
                        ...GatsbyImageSharpFluid
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
                        fluid(maxWidth: 160) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
}
`