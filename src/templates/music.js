import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import ArtistCard from '../components/artistCard'
import Layout from '../components/layout'
import VideoCard from '../components/videoCard'
import Breadcrumb from '../components/breadcrumb'
import Heading, { HeadingH2 } from '../components/heading'

export default ({ data: { music } }) => {
return (
<Layout>
    <Breadcrumb type='music' text={music.title}/>

    <div className='relative mb-5 w-full h-0 overflow-hidden' style={{ paddingBottom: '56.25%' }}>
        <div className='absolute w-full h-full top-0 left-0 bg-blue-100'>
            <Img fluid={music.videos?.[Math.floor(Math.random() * music.videos.length)]?.thumbnail_image?.childImageSharp?.fluid}/>
        </div>
    </div>
    <Heading text={music.title} isMusicTitle/>

    <div className='p-5'>
        {music.lyricists.map((lyricist, key) => <ArtistCard artist={lyricist} key={key} className='mb-5' roleText='作詞'/>)}
        {music.composers.map((composer, key) => <ArtistCard artist={composer} key={key} className='mb-5' roleText='作曲'/>)}
        {music.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-5' roleText='編曲'/>)}
    </div>

    { music.videos.length !== 0 &&
        <div>
            <HeadingH2
                text='この曲を歌っているアーティスト'
                count={music.videos.reduce((acc, cur) => acc + cur.singers.length, 0)}
                className='mb-5'
            />

            <div className='pl-5 mb-20'>
                {music.videos.map((video) => (
                    video.singers.map((singer, key) => (
                        <ArtistCard artist={singer} key={key} className='mb-5'/>
                    )
                )))}
            </div>

            <HeadingH2 text='この曲の歌ってみた動画' count={music.videos.length} className='mb-5'/>

            <div className='max-w-lg mx-auto'>
                {music.videos.map((video,key) => (
                    <VideoCard key={key} video={video} className='mb-7'/>
                ))}
            </div>
        </div>
    }
</Layout>
)
}

export const pageQuery = graphql`
query($id: String!) {
    music(id: {eq: $id}) {
        id
        title
        lyricists {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        composers {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        arrangers {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        videos {
            id
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            music {
                id
                title
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
}
`