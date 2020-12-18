import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import InfiniteScroll from 'react-infinite-scroll-component';
import Breadcrumb from '../components/breadcrumb'
import ArtistCard from '../components/artistCard'
import SEO from '../components/seo'
import SearchIcon from '../components/svg/search'
import Fuse from 'fuse.js'

const initialShowCount = 42

export default ({ data: {allArtist} }) => {
    const [artists, setArtists] = useState(allArtist.nodes.filter(artist => artist.singer_videos.length !== 0))
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
        const fuse = new Fuse(allArtist.nodes.filter(artist => artist.singer_videos.length !== 0), options)
        setSearch(fuse)
    }

    const searchVideo = async (e) => {
        setShowCount(initialShowCount)
        if (e.target.value === '') {
            setArtists(allArtist.nodes.filter(artist => artist.singer_videos.length !== 0))
        } else {
            const result = search.search(e.target.value).map(r => r.item)
            setArtists(result)
        }
    }

    return (
        <Layout currentPage='/artists'>
            <SEO title='アーティスト一覧' description='アーティスト一覧のページです。'/>
            <Breadcrumb type='artist'/>
            <div className='flex mx-auto px-2 mt-4 mb-7 w-full max-w-xl h-10'>
                <SearchIcon color='#555' className='w-10 p-2'/>
                <input
                    type='text'
                    className='outline-none w-full h-full px-2 border border-gray-200 rounded shadow-inner'
                    placeholder='キーワードを入力してください。'
                    onChange={(e) => searchVideo(e)}
                />
            </div>
            <InfiniteScroll
                dataLength={showCount} //This is important field to render the next data
                next={() => setShowCount(showCount + 6)}
                hasMore={artists.length > showCount}
                className='sm:flex flex-wrap px-5 mt-5'
            >
            {artists
                .slice(0, showCount)
                .map((artist, key) => {
                    return (<ArtistCard key={key} artist={artist} className='w-full md:w-1/2 lg:w-1/3'/>)
                })
            }
            </InfiniteScroll>
        </Layout>
    )
}

export const query = graphql`
{
    allArtist {
        nodes {
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
            }
        }
    }
}
`