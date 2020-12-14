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

export default ({ data: { video }, location }) => {
    console.log('nextURL: ', `/video/${location?.state?.nextVideoId}`)

    const [nextVideoId, setNextVideoId] = useState('')

    const decideNextVideoId = (video) => {
        let videoIdList = []
    
        video.singers.forEach(singer => {
            // 動画のアーティストの他の動画
            singer.singer_videos.forEach(singerVideo => {
                videoIdList.push(singerVideo.id)
            })

            singer.parents.forEach(parent => {
                // 動画のアーティストの所属グループの他の動画
                parent.singer_videos.forEach(parentSingerVideo => {
                    videoIdList.push(parentSingerVideo.id)
                })
                // 動画のアーティストと同じグループに所属しているアーティストの動画
                parent.children
                    .filter(child => child.id !== singer.id)
                    .forEach(parentChild => {
                        parentChild.singer_videos.forEach(parentChildVideo => {
                            videoIdList.push(parentChildVideo.id)
                        }
                    )
                })
            })

            singer.children.forEach(child => {
                child.singer_videos.forEach(childVideo => {
                    videoIdList.push(childVideo.id)
                })
                child.parents
                    .filter(parent => parent.id !== singer.id)
                    .forEach(childParent => {
                        childParent.singer_videos.forEach(childParentVideo => {
                            videoIdList.push(childParentVideo.id)
                        })
                    })
            })
        })

        videoIdList = Array.from(new Set(videoIdList))

        // 現在の動画URLは抜く
        videoIdList = videoIdList.filter(id => id !== video.id)

        console.log('videoIdList', videoIdList)

        setNextVideoId(videoIdList[Math.floor(videoIdList.length * Math.random())])
    }

    useEffect(() => {
        decideNextVideoId(video)
    }, [video])

    const sameSingerVideos = (() => {
        let isEmptySameSingerVideos = true

        const videoElements = (
            video.singers.map(singer => (
            singer.singer_videos.map((singerVideo, key) => {
                const showedVideos = [video.id]
                // ページの動画と同じ動画は関連にあげない
                if (showedVideos.includes(singerVideo.id)) {
                    // console.log(`is exist: ${singerVideo.id}`)
                    return ''
                }
                showedVideos.push(singerVideo.id)
                isEmptySameSingerVideos = false
                return <VideoCard key={`same-singer-videos-${key}`} video={singerVideo} className='mb-16 sm:w-1/2 sm:px-3'/>
            })
        )))

        return isEmptySameSingerVideos ? undefined : videoElements
    })()
    
    return (
        <Layout>
            <SEO
                title={`${video.music.title}`}
                description={`[動画] ${video.music.title}をVtuberの${video.singers.map(a => a.name).join('さんと')}さんが歌っている動画です。`}
                url={`https://vtuber-music.com/video/${video.id}`}
                imgUrl={`https://vtuber-music.com${video.thumbnail_image?.childImageSharp?.fixed?.src}`}
                isLargeCard
            />
            <Breadcrumb
                type='video'
                text={video.music.title}
                subText={video.singers.map(singer => singer.name).join(' & ')}
            />

            {video.thumbnail_image?.childImageSharp?.fluid ?
                <YouTubePlayer
                    videoId={video.id}
                    nextVideoId={nextVideoId}
                    thumbnailFluid={video.thumbnail_image?.childImageSharp?.fluid}
                />
            : <p>動画を取得できませんでした。</p>}

            <div className='mb-5' />

            <Link to={`/music/${video.music.id}`}>
                <Heading text={video.custom_music_name || video.music.title} className='mb-5' hoverEffect isMusicTitle/>
            </Link>

            <div className='mb-16'>
                {video.singers.map((singer, key) => <ArtistCard artist={singer} key={key} className='mb-5'/>)}
            </div>

            {video.custom_music_name &&
                <div className='flex items-center mb-5 mx-5'>
                    <span>オリジナル楽曲名：</span>
                    <MusicTitle music={video.music}/>
                </div>
            }

            {video.music.lyricists.map((lyricist, key) => <ArtistCard artist={lyricist} key={key} className='mb-5' roleText='作詞'/>)}

            {video.music.composers.map((composer, key) => <ArtistCard artist={composer} key={key} className='mb-5' roleText='作曲'/>)}

            {video.music.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-5' roleText='編曲'/>)}

            {video.mixers.map((mixer, key) => <ArtistCard artist={mixer} key={key} className='mb-5' roleText='ミックス'/>)}

            {video.off_vocals.map((off_vocal, key) => <ArtistCard artist={off_vocal} key={key} className='mb-5' roleText='オフボーカル'/>)}

            {video.arrangers.map((arranger, key) => <ArtistCard artist={arranger} key={key} className='mb-5' roleText='アレンジ'/>)}

            {video.music.lyrics_url &&
                <div className='text-gray-700 ml-5 py-5'>
                    歌詞：<a href={video.music.lyrics_url} className='inline-block hover:bg-gray-200 rounded p-3'>外部サイトへジャンプ</a>
                </div>
            }
            <div className='mb-16' />

            {sameSingerVideos &&
                <div>
                    <HeadingH2 text='同じアーティストが歌っている動画' className='mb-5'/>
                    <div className='sm:flex flex-wrap justify-between'>
                        {sameSingerVideos}
                    </div>
                </div>
            }
        </Layout>
    )
}

export const pageQuery = graphql`
 query($id: String!) {
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
                }
                parents {
                    id
                    singer_videos {
                        id
                    }
                }
            }
            parents {
                singer_videos {
                    id
                }
                children:childrenArtist {
                    id
                    singer_videos {
                        id
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