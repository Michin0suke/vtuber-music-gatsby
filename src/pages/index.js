import React from "react"
import { Link, graphql } from "gatsby"
import SEO from '../components/seo'
import ProfileImage from '../components/profileImage'
import Layout from "../components/layout"
import { HeadingH2 } from '../components/heading'
import Slider from "react-slick";
import VideoCard, { VideoCardHeader } from '../components/videoCard'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css'
import { headerVideos } from '../custom/index'

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

const IndexPage = ({ data: { allArtist, allVideo } }) => (
  <Layout currentPage='/'>
    <SEO isTop/>
    <p className='px-2 py-1 text-gray-500 text-xs'>Vtuberの歌ってみた動画をまとめたサイトです。</p>

    <Slider {...sliderSettingsHeader} className='mx-auto mb-16'>
        { headerVideos
            .map(videoId => allVideo.nodes.find(video => video.id === videoId))
            .map((video, key) => <VideoCardHeader video={video} key={key}/>)
        }
    </Slider>
    
    <HeadingH2 text='100名以上のVtuberを登録済み！' className='mb-2'/>
    
    <Slider {...sliderSettingsProfileImages} className='mb-10'>
        {allArtist.nodes
            .filter(artist => (artist.singer_videos.length !== 0))
            .filter(artist => (artist.profile_image !== null))
            .map((artist, key) => (
            <Link to={`/artist/${artist.id}`} key={key}>
                <ProfileImage fluid={artist.profile_image?.childImageSharp?.fluid} key={key} className='mx-3 w-20 h-20'/>
            </Link>
        ))}
    </Slider>

    <div className='sm:flex flex-wrap justify-between'>
        {allVideo.nodes.slice(0, 12).map((video, key) => (
            <VideoCard video={video} className='max-w-screen-sm mx-auto mb-16 sm:w-1/2 sm:px-3' key={key}/>
        ))}
    </div>
  </Layout>
)

export default IndexPage

export const query = graphql`
{
    allArtist {
        nodes {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
            singer_videos {
                id
            }
        }
    }
    allVideo {
        nodes {
            id
            thumbnail_image {
                childImageSharp {
                    fluid {
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
                        fluid {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
}
`