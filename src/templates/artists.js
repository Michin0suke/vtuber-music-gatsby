import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import InfiniteScroll from 'react-infinite-scroll-component'
import ArtistCard from '../components/artistCard'
import SEO from '../components/seo'

export default ({ data: { allArtist }, pathContext: { pathRole, pathSort, roleName, artistCountKey, artistCountSuffix }, path }) => {
  const [artists, setArtists] = useState(allArtist.nodes)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const addArtists = async (newArtists) => {
    const artistsCopy = JSON.parse(JSON.stringify(artists))
    artistsCopy.push(...newArtists)
    setArtists(artistsCopy)
  }

  const fetchArtists = async (newPage) => {
    // fetch(pathSort ? `${pathRole}_sort_${pathSort}-${newPage}.json` : `${pathRole}-${newPage}.json`)
    fetch(pathSort ? `/${pathRole}_sort_${pathSort}-${newPage}.json` : `/${pathRole}-${newPage}.json`)
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
            <SEO title={`${roleName}一覧`} description={`${roleName}一覧のページです。`} isIndex/>
            <p className='px-2 py-1 text-gray-500 text-xs'>{allArtist.totalCount}人の{roleName}が登録されています。</p>
            <nav className='mx-auto w-full max-w-3xl'>
                <ul className='flex justify-between'>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathRole === 'singers' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={pathSort ? `/singers/sort/${pathSort}` : '/singers'} className='block w-full h-full'>Vtuber</Link>
                    </li>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathRole === 'composers' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={pathSort ? `/composers/sort/${pathSort}` : '/composers'} className='block w-full h-full'>作曲</Link>
                    </li>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathRole === 'lyricists' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={pathSort ? `/lyricists/sort/${pathSort}` : '/lyricists'} className='block w-full h-full'>作詞</Link>
                    </li>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathRole === 'mixers' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={pathSort ? `/mixers/sort/${pathSort}` : '/mixers'} className='block w-full h-full'>ミックス</Link>
                    </li>
                </ul>
                <ul className='flex justify-between pt-3'>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathSort === null ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={`/${pathRole}`} className='block w-full h-full'>曲数</Link>
                    </li>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathSort === 'ruby' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={`/${pathRole}/sort/ruby`} className='block w-full h-full'>よみがな</Link>
                    </li>
                    <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${pathSort === 'release_date' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                        <Link to={`/${pathRole}/sort/release_date`} className='block w-full h-full'>公開日</Link>
                    </li>
                </ul>
            </nav>
            <InfiniteScroll
                dataLength={artists.length}
                next={() => fetchArtists(page + 1)}
                hasMore={hasMore}
                className='sm:flex flex-wrap px-5 mt-5'
                loader={<p className="loader w-full text-lg text-center leading-8" key={0}>Loading ...</p>}
            >
            {artists.map((artist, key) => {
              return (<ArtistCard key={key} artist={artist} className='w-full md:w-1/2 lg:w-1/3' withParent bottomText={`${artist[artistCountKey]}${artistCountSuffix}`}/>)
            })
            }
            </InfiniteScroll>
        </div>
  )
}

export const query = graphql`
query(
    $filter: ArtistFilterInput,
    $sort: ArtistSortInput,
){
    allArtist(filter: $filter, sort: $sort, limit: 36) {
        totalCount
        nodes {
            id
            name
            birthday
            count_singer_videos
            count_composer_music
            count_lyricist_music
            count_mixer_videos
            profile_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
            singer_videos {
                id
                release_date
            }
            parents {
                name
            }
        }
    }
}
`
