import React, { useState, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import ArtistCard from '../components/artistCard'
import VideoCard from '../components/videoCard'
import Breadcrumb from '../components/breadcrumb'
import YouTubePlayer from '../components/youtube-player'
import Heading, { HeadingH2 } from '../components/heading'
import MusicTitle from '../components/musicTitle'
import SEO from '../components/seo'
// import modernizr from 'modernizr'

export default ({ data: { video, allVideo }, location }) => {
    const [nextVideoId, setNextVideoId] = useState(undefined)
    const [nextVideoChoicesId, setNextVideoChoicesId] = useState([])
    const [sameSingerVideos, setSameSingerVideos] = useState([])

    useEffect(() => {
        // const Modernizer = modernizr.build({})
        // console.log(Modernizer.videoautoplay)
        decideNextVideoId(video, allVideo)

        const sameSingerVideos = video.singers
            .map(singer => (
                singer.singer_videos)
            )
            .flat()
            .reduce((acc, cur) => {
                if(acc.map(i=>i.id).includes(cur.id) || cur.id === video.id) return acc
                else return acc.concat(cur)
            },[])
        setSameSingerVideos(sameSingerVideos)
    }, [video, allVideo])

    const decideNextVideoId = async (video, allVideo) => {
        let nextVideoChoicesId = []
    
        video.singers.forEach(singer => {
            // 動画のアーティストの他の動画
            singer.singer_videos.forEach(singerVideo => {
                nextVideoChoicesId.push(singerVideo.id)
            })
    
            singer.parents.forEach(parent => {
                // 動画のアーティストの所属グループの他の動画
                parent.singer_videos.forEach(parentSingerVideo => {
                    nextVideoChoicesId.push(parentSingerVideo.id)
                })
                // 動画のアーティストと同じグループに所属しているアーティストの動画
                parent.children
                    .filter(child => child.id !== singer)
                    .forEach(parentChild => {
                        parentChild.singer_videos.forEach(parentChildVideo => {
                            nextVideoChoicesId.push(parentChildVideo.id)
                        }
                    )
                })
            })
    
            singer.children.forEach(child => {
                child.singer_videos.forEach(childVideo => {
                    nextVideoChoicesId.push(childVideo.id)
                })
                child.parents
                    .filter(parent => parent.id !== singer.id)
                    .forEach(childParent => {
                        childParent.singer_videos.forEach(childParentVideo => {
                            nextVideoChoicesId.push(childParentVideo.id)
                        })
                    })
            })
        })

        nextVideoChoicesId = nextVideoChoicesId.reduce((acc, cur) => {
            if (!acc.includes(cur) && cur !== video.id) {
                return acc.concat(cur)
            }
            return acc
        }, [])

        let countOfAddRandomVideos = 0;
        switch(nextVideoChoicesId.length) {
            case 0:
            case 1:
                countOfAddRandomVideos = 1
                break
            case 2:
                countOfAddRandomVideos = 2
                break
            case 3:
                countOfAddRandomVideos = 3
                break
            case 4:
                countOfAddRandomVideos = 2
                break
            default:
                countOfAddRandomVideos = 1
        }

        for(let i = 0; i < countOfAddRandomVideos; i++) {
            nextVideoChoicesId.push(
                allVideo.nodes[Math.floor(allVideo.nodes.length * Math.random())].id
            )
        }

        setNextVideoChoicesId(nextVideoChoicesId)
        setNextVideoId(nextVideoChoicesId[Math.floor(nextVideoChoicesId.length * Math.random())])
    }
    
    return (
        <Layout>
            <SEO
                title={`${video.music.title}`}
                description={`${video.music.title}を${video.singers.map(a => a.name).join('さんと')}さんが歌っている動画です。`}
                url={`https://vtuber-music.com/video/${video.id}`}
                imgUrl={`https://vtuber-music.com${video.thumbnail_image?.childImageSharp?.fixed?.src}`}
                isLargeCard
            />
            <Breadcrumb
                type='video'
                text={video.music.title}
                subText={video.singers.map(singer => singer.name).join(' & ')}
            />


            <div className='w-full max-w-4xl mx-auto'>
                <div className='mb-7 bg-white lg:shadow'>
                    {video.thumbnail_image?.childImageSharp?.fluid ?
                        <YouTubePlayer
                            nextVideoId={nextVideoId}
                            video={video}
                            className='mb-2 w-full'
                        />
                    : <p>動画を取得できませんでした。</p>}
                    <div className='lg:px-5'>
                        <Link to={`/music/${video.music.id}`}>
                            <Heading text={video.custom_music_name || video.music.title} className='mb-5' hoverEffect isMusicTitle/>
                        </Link>

                        <div className='pb-3'>
                            {video.singers.map((singer, key) => <ArtistCard artist={singer} key={key} className='mb-2' imgSize={16}/>)}
                        </div>
                    </div>
                </div>

                {video.custom_music_name &&
                    <div className='flex items-center mb-5 mx-5'>
                        <span>オリジナル楽曲名：</span>
                        <MusicTitle music={video.music}/>
                    </div>
                }

                <div className='mb-7 lg:px-5 pt-5 pb-1 bg-white lg:shadow'>
                    {video.music.lyricists.map((lyricist, key) => <ArtistCard artist={lyricist} key={key} className='mb-3' roleText='作詞'/>)}
                    {video.music.composers.map((composer, key) => <ArtistCard artist={composer} key={key} className='mb-3' roleText='作曲'/>)}
                    {video.music.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-3' roleText='編曲'/>)}
                    {video.mixers.map((mixer, key) => <ArtistCard artist={mixer} key={key} className='mb-3' roleText='ミックス'/>)}
                    {video.off_vocals.map((off_vocal, key) => <ArtistCard artist={off_vocal} key={key} className='mb-3' roleText='オフボーカル'/>)}
                    {video.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-3' roleText='アレンジ'/>)}
                </div>

                {video.music.lyrics_url &&
                    <div className='mb-7 text-gray-700 ml-5 py-5'>
                        歌詞：<a href={video.music.lyrics_url} className='inline-block hover:bg-gray-200 rounded p-3'>外部サイトへジャンプ</a>
                    </div>
                }

                {/* <Heading text='次に再生' className='mb-5'/>
                {nextVideo && <VideoCard video={nextVideo} className='mx-auto w-full max-w-md mb-16'/>} */}

                {sameSingerVideos.length !== 0 &&
                    <div className='lg:px-5 py-3 bg-white lg:shadow'>
                        <Heading text='同じアーティストが歌っている動画' className='mb-5 w-full max-w-4xl mx-auto'/>
                        <div className='w-full sm:flex flex-wrap justify-start'>
                            {
                                sameSingerVideos.map((video, key) => 
                                    <VideoCard
                                        key={`same-singer-videos-${key}`}
                                        video={video}
                                        className='mb-16 sm:px-3 sm:w-1/2 md:w-1/3'
                                    />
                                )
                            }
                        </div>
                    </div>
                }

            </div>

            {/* {console.log(nextVideoChoices.map(video => `${video.id} ${video.singers[0].name} ${video.music.title}`).join('\n'))} */}
            {console.log(`next video choices: \n\n・${nextVideoChoicesId.join('\n・')}`)}
        </Layout>
    )
}

export const pageQuery = graphql`
 query($id: String!) {
    allVideo {
        nodes {
            id
            # custom_music_name
            # music {
            #     id
            #     title
            # }
            # singers {
            #     id
            #     name
            #     profile_image {
            #         childImageSharp {
            #             fluid {
            #                 ...GatsbyImageSharpFluid_withWebp
            #             }
            #         }
            #     }
            # }
            # thumbnail_image {
            #     id
            #     childImageSharp {
            #         fluid {
            #             ...GatsbyImageSharpFluid_withWebp
            #         }
            #     }
            # }
        }
    }
    video(id: {eq: $id}) {
        id
        custom_music_name
        music {
            id
            title
            lyrics_url
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
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
            singer_videos {
                id
                custom_music_name
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
                                ...GatsbyImageSharpFluid_withWebp
                            }
                        }
                    }
                }
                thumbnail_image {
                    id
                    childImageSharp {
                        fluid {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            children:childrenArtist {
                singer_videos {
                    id
                    # custom_music_name
                    # music {
                    #     id
                    #     title
                    # }
                    singers {
                        id
                        # name
                        # profile_image {
                        #     childImageSharp {
                        #         fluid {
                        #             ...GatsbyImageSharpFluid_withWebp
                        #         }
                        #     }
                        # }
                    }
                    # thumbnail_image {
                    #     id
                    #     childImageSharp {
                    #         id
                    #         fluid {
                    #             ...GatsbyImageSharpFluid_withWebp
                    #         }
                    #     }
                    # }
                }
                parents {
                    id
                    # name
                    # profile_image {
                    #     childImageSharp {
                    #         fluid {
                    #             ...GatsbyImageSharpFluid_withWebp
                    #         }
                    #     }
                    # }
                    singer_videos {
                        id
                        # custom_music_name
                        # music {
                        #     id
                        #     title
                        # }
                        singers {
                            id
                            # name
                            # profile_image {
                            #     childImageSharp {
                            #         fluid {
                            #             ...GatsbyImageSharpFluid_withWebp
                            #         }
                            #     }
                            # }
                        }
                        # thumbnail_image {
                        #     id
                        #     childImageSharp {
                        #         id
                        #         fluid {
                        #             ...GatsbyImageSharpFluid_withWebp
                        #         }
                        #     }
                        # }
                    }
                }
            }
            parents {
                id
                # name
                # profile_image {
                #     childImageSharp {
                #         fluid {
                #             ...GatsbyImageSharpFluid_withWebp
                #         }
                #     }
                # }
                singer_videos {
                    id
                    # custom_music_name
                    # music {
                    #     id
                    #     title
                    # }
                    singers {
                        id
                        # name
                        # profile_image {
                        #     childImageSharp {
                        #         fluid {
                        #             ...GatsbyImageSharpFluid_withWebp
                        #         }
                        #     }
                        # }
                    }
                    # thumbnail_image {
                    #     id
                    #     childImageSharp {
                    #         id
                    #         fluid {
                    #             ...GatsbyImageSharpFluid_withWebp
                    #         }
                    #     }
                    # }
                }
                children:childrenArtist {
                    id
                    # name
                    singer_videos {
                        id
                        # custom_music_name
                        # music {
                        #     id
                        #     title
                        # }
                        singers {
                            id
                            # name
                            # profile_image {
                            #     childImageSharp {
                            #         fluid {
                            #             ...GatsbyImageSharpFluid_withWebp
                            #         }
                            #     }
                            # }
                        }
                        # thumbnail_image {
                        #     id
                        #     childImageSharp {
                        #         id
                        #         fluid {
                        #             ...GatsbyImageSharpFluid_withWebp
                        #         }
                        #     }
                        # }
                    }
                }
            }
        }
        mixers {
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
        off_vocals {
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
        recommends {
            id
        }
        thumbnail_image {
            id
            childImageSharp {
                id
                fluid {
                    ...GatsbyImageSharpFluid_withWebp
                }
                fixed(width: 600) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
    }
}
`