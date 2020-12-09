import React from 'react'
import { graphql } from 'gatsby'
import { format, differenceInYears } from 'date-fns';
import SEO from '../components/seo'
import Layout from '../components/layout'
import ArtistCard from '../components/artistCard'
import Heading from '../components/heading'
import VideoCard from '../components/videoCard'
import Breadcrumb from '../components/breadcrumb'
import ArtistCardLinks from '../components/artistLinks'
import MusicTitle from '../components/musicTitle'

const M = ({mb}) => <div className={`mb-${mb}`}/>

const dateFormatter = (string) => {
    const date = new Date(string)

    // 引数がnullの場合
    if (date.getFullYear() === 1970) {
        return ''
    } else if (date.getFullYear() === 9999) {
        return format(date, 'M月 d日')
    } else {
        return `${format(date, 'y年 M月 d日')}（${differenceInYears(new Date(), date)}歳）`
    }
}

export default ({ data: { artist }}) => {

    return (
    <Layout>
        <SEO title={`${artist.name}`}/>
        <Breadcrumb type='artist' text={artist.name}/>

        <div style={{
            width: '100%',
            paddingBottom: '20%'
        }} className='mb-14 bg-blue-100 shadow'></div>

        <Heading text={artist.childrenArtist.length === 0 ? 'アーティスト' : 'グループ'} className='mb-5'/>

        <ArtistCard artist={artist} className='mb-16' noLink withRuby withSexColor/>

        {artist.birthday &&
            <p className='px-5 mb-5'>誕生日: {dateFormatter(artist.birthday)}</p>}

        { artist.profile &&
            <div className='mb-16'>
                <Heading text='プロフィール'/>
                <M mb='5' />
                <p className='px-5 text-gray-700 whitespace-pre-wrap'>{artist.profile}</p>
            </div>
        }

        {/* <Heading text='所属しているグループ'/>
        <M mb='5' /> */}
        
        { artist.childrenArtist.length !== 0 &&
            <div className='mb-16'>
                <Heading text='所属しているアーティスト'/>
                <M mb='5' />
                { artist.childrenArtist.map((artist, key) => (
                    <ArtistCard artist={artist} className='mb-5' key={key}/>
                ))}
            </div>
        }

        { artist.parents.length !== 0 &&
            <div className='mb-16'>
                <Heading text='所属しているグループ' className='mb-5'/>
                { artist.parents.map((parent, key) => (
                    <ArtistCard artist={parent} className='mb-5' key={key}/>
                ))}
            </div>
        }

        <div className='px-5 pb-8'>
            <ArtistCardLinks artist={artist}/>
        </div>

        { artist.recommends.length !== 0 &&
            <div className='pb-10'>
                <Heading text='似ているタイプのアーティスト'/>
                <M mb='5' />

                <div className='px-5'>
                    {artist.recommends.map((artist, key) => (
                        <ArtistCard key={key} artist={artist} className='mb-5'/>
                    ))}
                </div>
            </div>
        }

        { artist.composer_music.length !== 0 &&
            <div className='pb-10'>
                <Heading text='作曲した楽曲' className='mb-5' />
                { artist.composer_music.map((music, key) => <MusicTitle key={key} music={music} className='mb-5 mx-5'/> )}
            </div>
        }

        { artist.lyricist_music.length !== 0 &&
            <div className='pb-10'>
                <Heading text='作詞した楽曲' className='mb-5'/>
                { artist.lyricist_music.map((music, key) => <MusicTitle key={key} music={music} className='mb-5 mx-5'/> )}
            </div>
        }

        { artist.arranger_music.length !== 0 &&
            <div className='pb-10'>
                <Heading text='編曲した楽曲' className='mb-5'/>
                { artist.arranger_music.map((music, key) => <MusicTitle key={key} music={music} className='mb-5 mx-5'/> )}
            </div>
        }

        { artist.singer_videos.length !== 0 &&
            <div className='pb-10'>
                <Heading text='歌っている動画'/>
                <M mb='5' />
    
                <div className='max-w-lg mx-auto'>
                    {artist.singer_videos.map((video,key) => (
                        <VideoCard key={key} video={video} className='mb-6'/>
                    ))}
                </div>
            </div>
        }

        { artist.arranger_videos.length !== 0 &&
            <div className='pb-10'>
                <Heading text='アレンジを担当した動画'/>
                <M mb='5' />
    
                <div className='max-w-lg mx-auto'>
                    {artist.arranger_videos.map((video,key) => (
                        <VideoCard key={key} video={video} />
                    ))}
                </div>
            </div>
        }

        { artist.mixer_videos.length !== 0 &&
            <div className='pb-10'>
                <Heading text='ミックスを担当した動画'/>
                <M mb='5' />
    
                <div className='max-w-lg mx-auto'>
                    {artist.mixer_videos.map((video,key) => (
                        <VideoCard key={key} video={video} />
                    ))}
                </div>
            </div>
        }

        { artist.off_vocal_videos.length !== 0 &&
            <div className='pb-10'>
                <Heading text='オフボーカルを担当した動画'/>
                <M mb='5' />
    
                <div className='max-w-lg mx-auto'>
                    {artist.off_vocal_videos.map((video,key) => (
                        <VideoCard key={key} video={video} />
                    ))}
                </div>
            </div>
        }
    </Layout>
    )
}

export const pageQuery = graphql`
query($id: String!){
    artist(id: {eq: $id}) {
        id
        name
        name_ruby
        profile
        sex
        birthday
        youtube_registration_date
        id_youtube
        id_twitter
        id_instagram
        id_spotify
        id_apple_music
        id_showroom
        id_openrec
        id_bilibili
        id_tiktok
        id_twitcasting
        id_facebook
        id_pixiv
        url_niconico
        url_homepage
        profile_image {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid_withWebp
                }
            }
        }
        childrenArtist {
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
        parents {
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
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        composer_music {
            id
            title
        }
        lyricist_music {
            id
            title
        }
        arranger_music {
            id
            title
        }
        mixer_videos {
            id
            custom_music_name
            music {
                id
                title
            }
            singers {
                id
                name
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        off_vocal_videos {
            id
            custom_music_name
            music {
                id
                title
            }
            singers {
                id
                name
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        arranger_videos {
            id
            custom_music_name
            music {
                id
                title
            }
            singers {
                id
                name
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
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