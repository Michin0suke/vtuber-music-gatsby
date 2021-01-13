import React, { useState } from "react"
import { graphql } from "gatsby"
import SEO from '../components/seo'
import Layout from "../components/layout"
import VideoCard from '../components/videoCard'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import InfiniteScroll from 'react-infinite-scroll-component'

const sliderSettingsHeader = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      },
    ]
}

const sliderSettingsProfileImages = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 1500,
    cssEase: 'ease',
    edgeFriction: 1,
    slidesToShow: 7,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          arrows: false
        }
      },
    ]
  };

const IndexPage = ({ data: { allVideoSortByCreatedAt, allVideoSortByReleaseDate, vtuberMusicIcon } }) => {
    const [showVideoIndex, setShowVideoIndex] = useState(24)
    const [showVideos, setShowVideos] = useState(allVideoSortByReleaseDate.nodes)
    const [sortSelected, setSortSelected] = useState(0)

    return (
    <Layout currentPage='/'>
        <SEO isTop imgUrl={`https://vtuber-music.com${vtuberMusicIcon.childImageSharp.fixed.src}`}/>
        <p className='px-2 py-1 text-gray-500 text-xs'>Vtuberの歌ってみた動画をまとめたサイトです。{allVideoSortByReleaseDate.nodes.length}本の動画が登録されています。</p>

        <div className='max-w-lg mx-auto py-2 pb-5 px-5'>
            <ul className='flex justify-around w-full border bg-white text-gray-700 rounded cursor-pointer'>
                <li className='w-1/2 border-r'>
                    <button
                        className={`inline-block w-full focus:outline-none text-center ${sortSelected === 0 && 'bg-gray-100'}`}
                        onClick={() => {
                            setShowVideos(allVideoSortByReleaseDate.nodes)
                            setSortSelected(0)
                        }}
                    >
                        アップロード日順
                    </button>
                </li>
                <li className='w-1/2'>
                    <button
                        className={`inline-block w-full focus:outline-none text-center ${sortSelected === 1 && 'bg-gray-100'}`}
                        onClick={() => {
                            setShowVideos(allVideoSortByCreatedAt.nodes)
                            setSortSelected(1)
                        }}
                    >
                        追加日順
                    </button>
                </li>
            </ul>
        </div>

        {/* <Slider {...sliderSettingsHeader} className='mx-auto mb-16'>
            { headerVideos
                .map(videoId => allVideo.nodes.find(video => video.id === videoId))
                .map((video, key) => <VideoCardHeader video={video} key={key}/>)
            }
        </Slider> */}

        <div className='sm:px-2 flex flex-wrap justify-between'>
            {showVideos.slice(0, 12).map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </div>

        {/* <pre>
            {JSON.stringify(showVideos.nodes[9], null, 4)}
        </pre> */}
        
        {/* <HeadingH2 text='100名以上のVtuberを登録済み！' className='mb-2'/> */}
        
        {/* <Slider {...sliderSettingsProfileImages} className='w-1/3 mb-10'>
            {allArtist.nodes
                .filter(artist => (artist.singer_videos.length !== 0))
                .filter(artist => (artist.profile_image !== null))
                .slice(0, 15)
                .map((artist, key) => (
                <Link to={`/artist/${artist.id}`} key={key}>
                    <ProfileImage fluid={artist.profile_image?.childImageSharp?.fluid} key={key} className='mx-3 w-20 h-20'/>
                </Link>
            ))}
        </Slider> */}


        <InfiniteScroll
            dataLength={showVideoIndex - 12} //This is important field to render the next data
            next={() => setShowVideoIndex(showVideoIndex + 12)}
            hasMore={showVideos.length > showVideoIndex}
            className='sm:px-2 flex flex-wrap justify-start'
        >
            {showVideos.slice(12, showVideoIndex).map((video, key) => (
                <VideoCard video={video} className='mb-5 sm:px-1 w-full sm:w-1/2 md:w-1/3 xl:w-1/4' key={key} withPublishDate/>
            ))}
        </InfiniteScroll>

    </Layout>
  )
}

export default IndexPage

export const query = graphql`
{
    allArtist {
        nodes {
            id
            name
            profile_image {
                childImageSharp {
                    fluid(maxWidth: 60) {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
            singer_videos {
                id
            }
        }
    }
    allVideoSortByCreatedAt:allVideo(sort: {order: DESC, fields: created_at}) {
        nodes {
            id
            release_date
            is_original_music
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
            }
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(maxWidth: 60) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        }
    }
    allVideoSortByReleaseDate:allVideo(sort: {order: DESC, fields: release_date}) {
        nodes {
            id
            release_date
            is_original_music
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
            }
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(maxWidth: 60) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        }
    }
    vtuberMusicIcon:file(base: {eq: "vtuber-music-icon-for-ogp.png"}) {
        childImageSharp {
            fixed(width: 500) {
                src
            }
        }
    }
}
`