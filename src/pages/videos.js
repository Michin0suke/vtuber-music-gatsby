import React, { useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Breadcrumb from '../components/breadcrumb'
import VideoCard from '../components/videoCard'

export default ({ data: { allVideo } }) => {
    // const [videos, setVideos] = useState([])
    // const [isCompleteShows, setIsCompleteShows] = useState(false)

    useEffect(() => {
        // const queueVideos = []

        // for(let i = 1; i <= 10; i++) {
        //     const currentVideo = allVideo.nodes[i]
        //     // const nextVideo = allVideo.nodes[i + 1]
    
        //     if (!currentVideo) {
        //         setIsCompleteShows(true)
        //         continue
        //     }

        //     if (!currentVideo.thumbnail_image) {
        //         console.log(`${currentVideo.id} has beed deleted`)
        //         continue
        //     }
    
        //     queueVideos.push(
        //         <VideoCard video={currentVideo} className='mb-5 w-3/5'/>
        //     )
        // }
        // setVideos(queueVideos)
    }, [allVideo.nodes])

    // const appendVideos = () => {
    //     if (isCompleteShows) {
    //         console.log('is finished')
    //         return
    //     }

    //     const queueVideos = []
    //     const stateLength = videos.length
    //     for(let i = 1; i <= 5; i++) {
    //         const currentVideo = allVideo.nodes[stateLength + i]
    //         const nextVideo = allVideo.nodes[stateLength + i + 1]

    //         console.log(currentVideo)

    //         if (!currentVideo) {
    //             console.log(`!currentVideo`)
    //             setIsCompleteShows(true)
    //             continue
    //         }

    //         if (!currentVideo.thumbnail_image) {
    //             console.log(`${currentVideo.id} has beed deleted`)
    //             queueVideos.push('')
    //             continue
    //         }

    //         queueVideos.push(
    //             <VideoCard video={currentVideo} className='mb-5 w-3/5'/>
    //         )
    //     }
    //     setVideos(videos.concat(queueVideos))
    // }

    return (
        <Layout currentPage='/videos'>
            <Breadcrumb type='video'/>
            {/* <div className='flex flex-wrap justify-between'> */}
            {/* <Infinite containerHeight={1000} elementHeight={250} infiniteLoadBeginEdgeOffset={0} onInfiniteLoad={() => appendVideos()}>
                {videos}
            </Infinite> */}
            {/* </div> */}
            { allVideo.nodes.map((video, key) => (
                <div key={key} className='w-1/2 mx-auto mb-10'>
                    {video.id}
                    <VideoCard video={video}/>
                </div>
            ))}
        </Layout>
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
            }
            release_date
            is_mv
            original_video_id
            custom_music_name
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        id
                        fluid {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            mixers {
                id
                name
            }
            off_vocals {
                id
                name
            }
            arrangers {
                id
                name
            }
            recommends {
                id
            }
            thumbnail_image {
                childImageSharp {
                    id
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
}
`