import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import SEO from '../components/seo'
import ArtistCard from '../components/artistCard'
import VideoCard from '../components/videoCard'
import Heading from '../components/heading'
import PhotoFrame from '../components/svg/photoFrame'
import Please from 'pleasejs'
import './music.css'
import { TwitterShareButton, TwitterIcon } from "react-share";

export default ({ data: { music } }) => {
    const [frameColor, addFrameColor] = useState(Please.make_color({format: 'rgb-string', saturation: 0.2}))
    const [isPhotoFrameMoving, setIsPhotoFrameMoving] = useState(false)

    const movePhotoFrame = () => {
        setIsPhotoFrameMoving(true)
        setTimeout(() => setIsPhotoFrameMoving(false), 1000)
    }
    const creators = []

    music.composers
        .concat(music.lyricists)
        .forEach(artist => {
            if (!creators.includes(artist.name)) {
                creators.push(artist.name)
            }
        })
    
return (
<div className='w-full'>
    <SEO
        title={music.title}
        description={`楽曲 ${music.title}(${creators.join('&')})のページです。${music.videos.length}本の歌ってみた動画が登録されています。`}
        imgUrl={`https://vtuber-music.com${music.videos?.[Math.floor(Math.random() * music.videos.length)]?.thumbnail_image?.childImageSharp?.fluid?.src}`}
        isLargeCard
    />

    <div className='max-w-4xl mx-auto'>
        <div className={`mb-7 pb-3 bg-white lg:shadow`}>
            <div className={`w-4/5 max-w-md mx-auto pt-2 photo-frame ${isPhotoFrameMoving && 'moving'}`} onClick={() => isPhotoFrameMoving || movePhotoFrame()}>
                <div className='relative mb-3 h-0' style={{paddingBottom: '89%'}}>
                    <div className='absolute left-0 right-0 h-0 mx-auto max-w-xs border' style={{marginBottom: '56.25%', width: '70%', top:'61%'}}>
                        <Img className='top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' fluid={music.videos?.[Math.floor(Math.random() * music.videos.length)]?.thumbnail_image?.childImageSharp?.fluid}/>
                    </div>
                    <PhotoFrame className='absolute right-0 left-0 w-full' color={frameColor} color2={frameColor}/>
                </div>
            </div>
            <div className='lg:px-5'>
                <Heading text={music.title} className='mb-5' isMusicTitle/>
                {music.lyricists.map((lyricist, key) => <ArtistCard artist={lyricist} key={key} className='mb-5' roleText='作詞'/>)}
                {music.composers.map((composer, key) => <ArtistCard artist={composer} key={key} className='mb-5' roleText='作曲'/>)}
                {music.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-5' roleText='編曲'/>)}
            </div>
        </div>

        { music.videos.length !== 0 &&
            <div>
                <div className='mb-7 lg:px-5 bg-white lg:shadow'>
                    <Heading text='この曲の歌ってみた動画' count={music.videos.length} className='mb-5'/>
                    <div className='flex flex-wrap'>
                        {music.videos.map((video,key) => (
                            <VideoCard key={key} video={video} className='mb-12 sm:px-3 w-full sm:w-1/2 md:w-1/3'/>
                        ))}
                    </div>
                </div>
                <div className='mb-7 pb-3 lg:px-5 bg-white lg:shadow'>
                    <Heading
                        text='この曲を歌っているアーティスト'
                        count={music.videos.reduce((acc, cur) => acc + cur.singers.length, 0)}
                        className='mb-5'
                    />
                    <div>
                        {music.videos.map((video) => (
                            video.singers.map((singer, key) => (
                                <ArtistCard artist={singer} key={key} className='mb-5'/>
                            )
                        )))}
                    </div>
                </div>
            </div>
        }

        <TwitterShareButton
            url={`https://vtuber-music.com/music/${music.id}/`}
            title={`#VtuberMusic には「${music.title}」の歌ってみた動画が${music.videos.length}本登録されているよ！`}
            related={[`VtuberMusicCom`]}
            className="flex items-center mb-3 mx-5"
        >
            <TwitterIcon size={42} round className='mr-3'/><span className='text-xs text-gray-600 text-left'>Twitterで共有して、{music.title}をたくさんの人に聞いてもらおう！</span>
        </TwitterShareButton>
    </div>
</div>
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
                    fluid(maxWidth: 160) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
        composers {
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
        arrangers {
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
        videos {
            id
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
            music {
                id
                title
            }
            thumbnail_image {
                childImageSharp {
                    fluid(maxWidth: 330) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    }
}
`