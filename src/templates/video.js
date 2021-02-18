import React, { useState, useEffect } from 'react'
import { graphql, Link } from 'gatsby'
import ArtistCard from '../components/artistCard'
import VideoCard from '../components/videoCard'
import YouTubePlayer from '../components/youtube-player'
import Heading from '../components/heading'
import MusicTitle from '../components/musicTitle'
import SEO from '../components/seo'
import { TwitterShareButton, TwitterIcon } from "react-share";

export default ({ data: { video }, setVideoPlayer, allSinger }) => {
    const [sameSingerVideos, setSameSingerVideos] = useState([])

    const setVideoPlayerAsync = async () => {
        // const nextVideoId = allSinger.nodes[Math.floor(Math.random() * allSinger.nodes.length)].id
        const nextVideo = await decideNextVideo(allSinger)
        setVideoPlayer(
            <YouTubePlayer
                nextVideoId={nextVideo.id}
                video={video}
            />
        )
    }

    useEffect(() => {
        if (allSinger.length === 0) return
        setVideoPlayerAsync()
    }, [allSinger])

    useEffect(() => {
        const sameSingerVideos = video.singers
            .map(singer => singer.singer_videos)
            .flat()
            .reduce((acc, cur) => {
                if(acc.map(i=>i.id).includes(cur.id) || cur.id === video.id) return acc
                else return acc.concat(cur)
            },[])
        setSameSingerVideos(sameSingerVideos)
    }, [])

    const decideNextVideo = async (allSinger) => {
        const singer = allSinger[Math.floor(Math.random() * allSinger.length)]
        let video = singer.singer_videos[Math.floor(Math.random() * singer.singer_videos.length)]
        if (Math.floor(Math.random() * video.singers.length) !== 0) {
            console.log(`再抽選！ videoId: ${video.id}`)
            video = await decideNextVideo(allSinger)
        }
        return video
    }

    
    return (
        <div className='w-full'>
            <SEO
                title={`${video.music.title} / ${video.singers.map(a => a.name).join('&')}`}
                description={`${video.music.title}を${video.singers.map(i => `${i.name}${i.children.length === 0 ?'さん':''}`).join('と')}が歌っている動画です。`}
                url={`https://vtuber-music.com/video/${video.id}`}
                imgUrl={video.thumbnail_image?.childImageSharp?.fluid?.src}
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
        </div>
    )
}

export const pageQuery = graphql`
query($id: String!) {
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
                        fluid {
                            ...ImageSharpFluid
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
                        fluid {
                            ...ImageSharpFluid
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
                        fluid {
                            ...ImageSharpFluid
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
                    fluid {
                        ...ImageSharpFluid
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
                            fluid {
                                ...ImageSharpFluid
                            }
                        }
                    }
                }
                thumbnail_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
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
                    fluid {
                        ...ImageSharpFluid
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
                    fluid {
                        ...ImageSharpFluid
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
                    fluid {
                        ...ImageSharpFluid
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
            childImageSharp {
                fluid {
                    ...ImageSharpFluid
                }
            }
        }
    }
}
`