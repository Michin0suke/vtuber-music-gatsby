import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import Heading from '../components/heading'
import InfiniteScroll from 'react-infinite-scroll-component';
import ArtistCard from '../components/artistCard'
import SEO from '../components/seo'
import SearchIcon from '../components/svg/search'
import Fuse from 'fuse.js'
import { parse } from 'date-fns';

const initialShowCount = 42

const today = new Date()

export default ({ data: { allArtist, vtuberMusicIcon } }) => {
    const [birthdayArtists, setBirthdayArtists] = useState(allArtist.nodes.filter(artist => {
        if (!artist.birthday) return false
        try{
            const birthday = parse(artist.birthday, 'yyyy-MM-dd', today)
            if (today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate()) {
                return true
            }
        } catch(e) {
            console.log(e)
        }
        return false
    }))
    const [showBirthdayArtists, setShowBirthdayArtists] = useState(true)
    const [artists, setArtists] = useState(
        allArtist.nodes
            .sort((a, b) => b.singer_videos.length - a.singer_videos.length)
    )
    const [showCount, setShowCount] = useState(initialShowCount)
    const [search, setSearch] = useState(() => {})

    useEffect(() => {
        createFuse()
    }, [allArtist])

    const createFuse = async () => {
        const options = {
            includeScore: false,
            keys: ['name', 'name_ruby']
        }
        const fuse = new Fuse(allArtist.nodes, options)
        setSearch(fuse)
    }

    const searchVideo = async (e) => {
        setShowCount(initialShowCount)
        if (e.target.value === '') {
            setArtists(allArtist.nodes)
            setShowBirthdayArtists(true)
        } else {
            const result = search.search(e.target.value).map(r => r.item)
            setArtists(result)
            setShowBirthdayArtists(false)
        }
    }

    return (
        <div className='w-full'>
            <SEO title='MIXer一覧' description='MIXer一覧のページです。' imgUrl={`https://vtuber-music.com${vtuberMusicIcon.childImageSharp.fixed.src}`}/>
            {/* <Breadcrumb type='artist'/> */}
            <p className='px-2 py-1 text-gray-500 text-xs'>{allArtist.nodes.length}人のMIXerが登録されています。</p>
            <div className='flex mx-auto px-2 mt-4 mb-7 w-full max-w-xl h-10'>
                <SearchIcon color='#555' className='w-10 p-2'/>
                <input
                    type='text'
                    className='outline-none w-full h-full px-2 border border-gray-200 rounded shadow-inner'
                    placeholder='キーワードを入力してください。'
                    onChange={(e) => searchVideo(e)}
                />
            </div>
            {showBirthdayArtists && birthdayArtists.length > 0 &&
                <div>
                    <Heading text='今日が誕生日のアーティスト'/>
                    <div className='sm:flex flex-wrap mx-5 pb-5 border-b-4 border-dotted'>
                        {birthdayArtists.map((artist, key) => <ArtistCard key={key} artist={artist} className='w-full md:w-1/2 lg:w-1/3' cardSize='lg' withParent withVideoCount/>)}
                    </div>
                </div>
            }
            <InfiniteScroll
                dataLength={showCount} //This is important field to render the next data
                next={() => setShowCount(showCount + 6)}
                hasMore={artists.length > showCount}
                className='sm:flex flex-wrap px-5 mt-5'
            >
            {artists
                .slice(0, showCount)
                .map((artist, key) => {
                    return (<ArtistCard key={key} artist={artist} className='w-full md:w-1/2 lg:w-1/3' withParent withVideoCount/>)
                })
            }
            </InfiniteScroll>
        </div>
    )
}

export const query = graphql`
{
    allArtist(filter: {is_mixer: {eq: true}}, sort: {order: ASC, fields: name_ruby}) {
        nodes {
            id
            name
            birthday
            profile_image {
                childImageSharp {
                    fluid(maxWidth: 60) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
            singer_videos:mixer_videos {
                id
            }
            parents {
                name
            }
        }
    }
    vtuberMusicIcon:file(base: {eq: "vtuber-music-icon-for-ogp.png"}) {
        childImageSharp {
            fixed(width: 300) {
                src
            }
        }
    }
}
`