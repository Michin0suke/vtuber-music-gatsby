import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import InfiniteScroll from 'react-infinite-scroll-component';
import Breadcrumb from '../components/breadcrumb'
import ArtistCard from '../components/artistCard'
import SEO from '../components/seo'

export default ({ data: {allArtist} }) => {
    const [hasMore, setHasMore] = useState(true);
    const [showCount, setShowCount] = useState(20)

    const addArtist = () => {
        const nextShowCount = showCount + 5
        setShowCount(nextShowCount)
        if (allArtist.nodes.length <= nextShowCount) {
            setHasMore(false)
        }
    }

    return (
        <Layout currentPage='/artists'>
            <SEO title='アーティスト一覧' description='アーティスト一覧のページです。'/>
            <Breadcrumb type='artist'/>
            <InfiniteScroll
                dataLength={showCount} //This is important field to render the next data
                next={addArtist}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>全てのアーティストを表示しました。</p>
                }
            >
            {allArtist.nodes
                .filter(artist => artist.singer_videos.length !== 0)
                .slice(0, showCount)
                .map((artist, key) => {
                    return (<ArtistCard key={key} artist={artist}/>)
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