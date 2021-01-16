import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import Breadcrumb from '../components/breadcrumb'
import Heading from '../components/heading'
import VideoThumbnail from '../components/videoThumbnail'

const FeaturedMusic = ({ music, className }) => (
    <div className={className}>
        <Heading text={`「${music.title}」の歌ってみた一覧`} className='mb-4'/>
        <div className='flex flex-wrap'>
            {music.videos.map(video => (
                <Link to={`/video/${video.id}`} className='w-1/3 md:w-1/4 lg:w-1/5 sm:hover:opacity-80 p-0.5'>
                    <VideoThumbnail video={video}/>
                </Link>
            ))}
        </div>
    </div>
)

export default ({data}) => {
    return (
        <div>
            {/* <Breadcrumb type='recommends' className='mb-5'/> */}
            <FeaturedMusic music={data.musicKing} className='mb-20'/>
            <FeaturedMusic music={data.musicInochi}/>
        </div>
    )
}

export const query = graphql`
{
    musicKing:music(id: {eq: "king"}) {
        title
        videos {
            id
            thumbnail_image {
                childImageSharp {
                    fluid(maxWidth: 200) {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
    musicInochi:music(id: {eq: "inochi_ni_kirawareteiru"}) {
        title
        videos {
            id
            thumbnail_image {
                childImageSharp {
                    fluid(maxWidth: 200) {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
}
`