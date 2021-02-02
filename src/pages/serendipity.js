import React, { useEffect, useState } from 'react'
import { graphql, navigate } from 'gatsby'
import Img from 'gatsby-image'
import SEO from '../components/seo'
import ProfileImg from '../components/profileImage'
import './serendipity.css'

const sleep = async (time) => new Promise(resolve => setTimeout(resolve, time))

export default ({ data: { allArtist, allVideo }, isRandomMode, setIsRandomMode, setVideoPlayer }) => {
    const [nextArtist, setNextArtist] = useState({})

    useEffect(() => {
        setNextVideoId()
    }, [])

    const setNextVideoId = async () => {
        const startTime = Date.now()
        Promise.all([decideNextVideoId(), sleep(800)])
            .then(result => {
                console.log(Date.now() - startTime)
                navigate(`/video/${result[0]}`)
            })
    }

    const decideNextVideoId = async () => {
        const nextArtist = allArtist.nodes[Math.floor(allArtist.nodes.length * Math.random())]
        setNextArtist(nextArtist)
        const nextVideoId = nextArtist.singer_videos[Math.floor(nextArtist.singer_videos.length * Math.random())].id
        return nextVideoId
    }
    
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <SEO
                title={``}
                description={`Vtuberとの素敵な出会いをあなたに`}
                url={`https://vtuber-music.com/serendipity`}
                isLargeCard
            />
            <div className='pb-14 flex items-center flex-col'>
                <div className='relative mb-5 flex items-center justify-center'>
                    <div className='ring-animation'/>
                    <ProfileImg artist={nextArtist} className='w-44 h-44 shadow-lg'/>
                </div>
                <h2 className='text-2xl text-gray-700 text-center'>{nextArtist.name}</h2>
            </div>
        </div>
    )
}

export const pageQuery = graphql`
 query {
    allArtist(filter: {is_singer: {eq: true}}) {
        nodes {
            name
            singer_videos {
                id
            }
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
`