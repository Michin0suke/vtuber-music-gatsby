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
    const [artists, setArtists] = useState(
        allArtist.nodes
            .sort((a, b) => b.singer_videos.length - a.singer_videos.length)
    )
    const [showCount, setShowCount] = useState(initialShowCount)

    return (
        <div className='w-full'>
            <SEO title='MIXer一覧' description='MIXer一覧のページです。'/>
            {/* <Breadcrumb type='artist'/> */}
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
    allArtist(filter: {is_mixer: {eq: true}}, sort: {order: ASC, fields: name_ruby}, limit: 36) {
        nodes {
            id
            name
            birthday
            profile_image {
                childImageSharp {
                    fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
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
}
`