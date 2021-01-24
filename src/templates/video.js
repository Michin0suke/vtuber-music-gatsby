import React, { useState, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import ArtistCard from '../components/artistCard'
import VideoCard from '../components/videoCard'
import YouTubePlayer from '../components/youtube-player'
import Heading from '../components/heading'
import MusicTitle from '../components/musicTitle'
import SEO from '../components/seo'
import { TwitterShareButton, TwitterIcon } from "react-share";

export default ({ data: { video, allVideo }, setVideoPlayer }) => {
    const [sameSingerVideos, setSameSingerVideos] = useState([])

    const setVideoPlayerAsync = async () => {
        const nextVideoId = await decideNextVideoId(video, allVideo)
        setVideoPlayer(
            <YouTubePlayer
                nextVideoId={nextVideoId}
                video={video}
            />
        )
    }

    useEffect(() => {
        setVideoPlayerAsync()

        decideNextVideoId(video, allVideo)

        const sameSingerVideos = video.singers
            .map(singer => singer.singer_videos)
            .flat()
            .reduce((acc, cur) => {
                if(acc.map(i=>i.id).includes(cur.id) || cur.id === video.id) return acc
                else return acc.concat(cur)
            },[])
        setSameSingerVideos(sameSingerVideos)
    }, [])

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

        return nextVideoChoicesId[Math.floor(nextVideoChoicesId.length * Math.random())]
    }
    
    return (
        <div className='w-full'>
            <SEO
                title={`${video.music.title} / ${video.singers.map(a => a.name).join('&')}`}
                description={`${video.music.title}を${video.singers.map(i => `${i.name}${i.children.length === 0 ?'さん':''}`).join('と')}が歌っている動画です。`}
                url={`https://vtuber-music.com/video/${video.id}`}
                imgUrl={`https://vtuber-music.com${video.thumbnail_image?.childImageSharp?.fluid?.src}`}
                isLargeCard
            />
            <div className='w-full max-w-4xl mx-auto'>
                <div className='w-full bg-white' style={{ paddingBottom: '56.25%' }}/>
                <div className='mb-4 bg-white lg:shadow'>
                    <div className='lg:px-5'>
                        <Link to={`/music/${video.music.id}`}>
                            <Heading text={video.custom_music_name || video.music.title} className='mb-2' hoverEffect isMusicTitle/>
                        </Link>

                        <div className='pb-2'>
                            {video.singers.map((singer, key) => <ArtistCard artist={singer} key={key} className='mb-2' cardSize='lg' withParent/>)}
                        </div>
                    </div>
                </div>

                {video.custom_music_name &&
                    <div className='flex items-center mb-5 mx-5'>
                        <span>オリジナル楽曲名：</span>
                        <MusicTitle music={video.music}/>
                    </div>
                }

                <div className='mb-4 lg:px-5 pt-4 pb-1 bg-white lg:shadow'>
                    {video.music.lyricists.map((lyricist, key) => <ArtistCard artist={lyricist} key={key} className='mb-3' roleText='作詞'/>)}
                    {video.music.composers.map((composer, key) => <ArtistCard artist={composer} key={key} className='mb-3' roleText='作曲'/>)}
                    {video.music.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-3' roleText='編曲'/>)}
                    {video.mixers.map((mixer, key) => <ArtistCard artist={mixer} key={key} className='mb-3' roleText='ミックス'/>)}
                    {video.off_vocals.map((off_vocal, key) => <ArtistCard artist={off_vocal} key={key} className='mb-3' roleText='オフボーカル'/>)}
                    {video.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-3' roleText='アレンジ'/>)}
                </div>

                <TwitterShareButton
                    url={`https://vtuber-music.com/video/${video.id}/`}
                    title={`#VtuberMusic で「${video.music.title}」(${video.singers.map(i=>`#${i.name}`).join(' & ')})を聞いているよ！`}
                    related={[`VtuberMusicCom`]}
                    className="flex items-center mb-3 mx-5"
                >
                    <TwitterIcon size={42} round className='mr-3'/><span className='text-xs text-gray-600 text-left'>Twitterで共有して、{video.music.title}をたくさんの人に聞いてもらおう！</span>
                </TwitterShareButton>

                {video.music.lyrics_url &&
                    <div className='mb-4 text-gray-700 ml-5 py-5'>
                        歌詞：<a href={video.music.lyrics_url} className='inline-block sm:hover:bg-gray-200 rounded p-3'>外部サイトへジャンプ</a>
                    </div>
                }

                {sameSingerVideos.length !== 0 &&
                    <div className='lg:px-5 py-2 bg-white lg:shadow'>
                        <Heading text='同じアーティストが歌っている動画' className='mb-2 w-full max-w-4xl mx-auto'/>
                        <div className='w-full sm:flex flex-wrap justify-start'>
                            {
                                sameSingerVideos.map((video, key) => 
                                    <VideoCard
                                        key={`same-singer-videos-${key}`}
                                        video={video}
                                        className='mb-5 sm:px-3 sm:w-1/2 md:w-1/3'
                                        withPublishDate
                                    />
                                )
                            }
                        </div>
                    </div>
                }

            </div>
            <Link
                className='block mx-auto py-1 px-3 mt-5 mb-5 w-44 max-w-md border bg-white sm:hover:bg-gray-200 text-center'
                to={`/request_add_video?id=${video.id}`}
            >編集リクエスト</Link>
        </div>
    )
}

export const pageQuery = graphql`
 query($id: String!) {
    allVideo {
        nodes {
            id
        }
    }
    video(id: {eq: $id}) {
        id
        custom_music_name
        is_original_music
        music {
            id
            title
            lyrics_url
            lyricists {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
                parents {
                    name
                }
            }
            composers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
                parents {
                    name
                }
            }
            arrangers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
                parents {
                    name
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
                    fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
            parents {
                name
            }
            singer_videos {
                id
                custom_music_name
                release_date
                is_original_music
                music {
                    id
                    title
                }
                singers {
                    id
                    name
                    profile_image {
                        childImageSharp {
                            fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
                thumbnail_image {
                    id
                    childImageSharp {
                        fluid(quality: 70, pngQuality: 70, maxWidth: 330) {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
            children:children_artist {
                singer_videos {
                    id
                    singers {
                        id
                    }
                }
                parents {
                    id
                    singer_videos {
                        id
                        singers {
                            id
                        }
                    }
                }
            }
            parents {
                id
                singer_videos {
                    id
                    singers {
                        id
                    }
                }
                children:children_artist {
                    id
                    singer_videos {
                        id
                        singers {
                            id
                        }
                    }
                }
            }
        }
        mixers {
            id
            name
            profile_image {
                childImageSharp {
                    fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
            parents {
                name
            }
        }
        off_vocals {
            id
            name
            profile_image {
                childImageSharp {
                    fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
            parents {
                name
            }
        }
        arrangers {
            id
            name
            profile_image {
                childImageSharp {
                    fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
            parents {
                name
            }
        }
        recommends {
            id
        }
        thumbnail_image {
            id
            childImageSharp {
                id
                fluid(quality: 70, pngQuality: 70, maxWidth: 330) {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
}
`