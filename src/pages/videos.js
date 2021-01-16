import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Breadcrumb from '../components/breadcrumb'
import VideoCard from '../components/videoCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import SearchIcon from '../components/svg/search'
import Fuse from 'fuse.js'

export default ({ data: { allVideo } }) => {
    const [videos, setVideos] = useState(allVideo.nodes)
    const [showVideoIndex, setShowVideoIndex] = useState(24)
    const [search, setSearch] = useState(() => {})

    useEffect(() => {
        createFuse()
    }, [allVideo])

    const createFuse = async() => {
        const options = {
            includeScore: false,
            keys: ['music.name', 'music.title', 'singers.name', 'singers.name_ruby']
        }
        const fuse = new Fuse(allVideo.nodes, options)
        setSearch(fuse)
    }

    const searchVideo = async (e) => {
        setShowVideoIndex(24)
        if (e.target.value === '') {
            setVideos(allVideo.nodes)
        } else {
            const result = search.search(e.target.value).map(r => r.item)
            setVideos(result)
        }
    }

    return (
        <div>
            {/* <Breadcrumb type='video'/> */}
            <div className='flex mx-auto px-2 mt-4 mb-7 w-full max-w-xl h-10'>
                <SearchIcon color='#555' className='w-10 p-2'/>
                <input
                    type='text'
                    className='outline-none w-full h-full px-2 border border-gray-200 rounded shadow-inner'
                    placeholder='キーワードを入力してください。'
                    onChange={(e) => searchVideo(e)}
                />
            </div>
            
            <InfiniteScroll
                dataLength={showVideoIndex} //This is important field to render the next data
                next={() => setShowVideoIndex(showVideoIndex + 12)}
                hasMore={videos.length > showVideoIndex}
                className='sm:px-2 flex flex-wrap justify-start'
            >
                {videos.slice(0, showVideoIndex).map((video, key) => (
                    <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
                ))}
            </InfiniteScroll>
        </div>
    )
}

export const query = graphql`
{
    allVideo {
        nodes {
            id
            music {
                id
                title
                title_ruby
            }
            release_date
            is_mv
            original_video_id
            custom_music_name
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
            mixers {
                id
                name
                name_ruby
            }
            off_vocals {
                id
                name
                name_ruby
            }
            arrangers {
                id
                name
                name_ruby
            }
            recommends {
                id
            }
            thumbnail_image {
                childImageSharp {
                    id
                    fluid(maxWidth: 200) {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
}
`