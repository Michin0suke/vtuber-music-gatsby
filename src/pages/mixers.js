import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import InfiniteScroll from 'react-infinite-scroll-component';
import ArtistCard from '../components/artistCard'
import SEO from '../components/seo'

export default ({ data: { allArtist } }) => {
    const [artists, setArtists] = useState(allArtist.nodes)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)

    const addArtists = async (newArtists) => {
        const artistsCopy = JSON.parse(JSON.stringify(artists))
        artistsCopy.push(...newArtists)
        setArtists(artistsCopy)
    }

    const fetchArtists = async (newPage) => {
        console.log('fetch_artists')
        fetch(`/all_mixer_order_by_count_mixer_videos-${newPage}.json`)
            .then(response => response.json())
            .then(json => addArtists(json.items))
            .then(() => setPage(newPage))
            .catch(e => {
                setHasMore(false)
                console.log(e)
            })
    }

    return (
        <div className='w-full'>
            <SEO title='アーティスト一覧' description='アーティスト一覧のページです。' isIndex/>
            <p className='px-2 py-1 text-gray-500 text-xs'>{allArtist.totalCount}人のアーティストが登録されています。</p>
            <InfiniteScroll
                dataLength={artists.length}
                next={() => fetchArtists(page + 1)}
                hasMore={hasMore}
                className='sm:flex flex-wrap px-5 mt-5'
                loader={<p className="loader w-full text-lg text-center leading-8" key={0}>Loading ...</p>}
            >
            {artists.map((artist, key) => {
                    return (<ArtistCard key={key} artist={artist} className='w-full md:w-1/2 lg:w-1/3' withParent withVideoCount/>)
                })
            }
            </InfiniteScroll>
        </div>
    )
}

export const query = graphql`
{
    allArtist(filter: {is_mixer: {eq: true}}, sort: {order: DESC, fields: count_mixer_videos}, limit: 36) {
        totalCount
        nodes {
            id
            name
            birthday
            count_singer_videos:count_mixer_videos
            profile_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
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
}
`