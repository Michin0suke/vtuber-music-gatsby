import React, { useState } from "react"
import { graphql, navigate } from "gatsby"
import SEO from '../../components/seo'
import VideoCard from '../../components/videoCard'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InfiniteScroll from 'react-infinite-scroll-component'
import SortBar from '../../components/sortBar'

const IndexPage = ({ data: { allVideo }}) => {
    const [showVideoIndex, setShowVideoIndex] = useState(24)
    const [showVideos, setShowVideos] = useState(allVideo.nodes)

    return (
    <div className='w-full'>
        <SEO isTop isFollow/>
        <p className='px-2 py-1 text-gray-500 text-xs'>Vtuberの歌ってみた動画をまとめたサイトです。{allVideo.totalCount}本の動画が登録されています。</p>
        <SortBar path='/sort/created_at'/>

        <InfiniteScroll
            dataLength={showVideoIndex - 12} //This is important field to render the next data
            next={() => setShowVideoIndex(showVideoIndex + 12)}
            hasMore={showVideos.length > showVideoIndex}
            className='sm:px-2 flex flex-wrap justify-start'
        >
            {showVideos.slice(0, showVideoIndex).map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </InfiniteScroll>

    </div>
  )
}

export default IndexPage

export const query = graphql`
{
    allVideo(sort: {order: DESC, fields: created_at}, limit: 300) {
        totalCount
        nodes {
            id
            release_date
            is_original_music
            custom_music_name
            thumbnail_image {
                childImageSharp {
                    fluid(maxWidth: 300) {
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
                        fluid(maxWidth: 60) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
    vtuberMusicIcon:file(base: {eq: "vtuber-music-icon-for-ogp.png"}) {
        childImageSharp {
            fixed(width: 300) {
                src
            }
        }
    }
}
`