// アーティストが10000を超えない前提

import { gql } from '@apollo/client';
import { client } from './client';

const ALL_ARTIST_FULL = gql`
query {
    allArtist {
      id
      name
      name_ruby
      profile
      birthday
      id_youtube
      id_twitter
    }
}
`
;

const ALL_ARTIST_ONLY_SINGER_FULL = gql`
query($first: Int!, $page: Int!) {
  allArtistOnlySinger(first: $first, page: $page) {
    paginatorInfo {
      total
      hasMorePages
      lastPage
    }
    data {
      id
      name
      name_ruby
      profile
      birthday
      id_youtube
      id_twitter
    }
  }
}
`
;

const ALL_ARTIST_WITHOUT_SINGER_FULL = gql`
query($first: Int!, $page: Int!) {
  allArtistOnlySinger(first: $first, page: $page) {
    paginatorInfo {
      total
      hasMorePages
      lastPage
    }
    data {
      id
      name
      name_ruby
      profile
      birthday
      id_youtube
      id_twitter
    }
  }
}
`
;

const ALL_ARTIST_WITHOUT_SINGER_LESS = gql`
query($first: Int!, $page: Int!) {
  allArtistWithoutSinger(first: $first, page: $page) {
    paginatorInfo {
      total
      hasMorePages
    }
    data {
      id
      name
      id_twitter
    }
  }
}
`
;

const FIND_ARTIST_BY_ID = gql`
query($id: String) {
  findArtist(id: $id) {
    id
    name
    id_youtube
    id_twitter
    youtube_channel_is_user
  }
}
`;

const FIND_ARTIST_BY_NAME = gql`
query($name: String) {
  findArtist(name: $name) {
    id
    name
    id_youtube
    id_twitter
    youtube_channel_is_user
  }
}
`;


export const queryArtist = id => client.query({
  query: FIND_ARTIST_BY_ID,
  variables: { id }
});

export const allArtist = () => client.query({
  query: ALL_ARTIST_FULL,
})
;

export const allArtistOnlySingerFull = (first, page) => client.query({
  query: ALL_ARTIST_ONLY_SINGER_FULL,
  variables: {
    first,
    page,
  }
})
;

export const allArtistWithoutSingerLess = (first, page) => client.query({
  query: ALL_ARTIST_WITHOUT_SINGER_LESS,
  variables: {
    first,
    page,
  }
})
;

// export const queryAllArtistOnlySingerFull = async () => {
//   const artists = []
//   const first = 500;
//   const resultFirst = await allArtistOnlySingerFull(first, 1)
//   const totalPageCount = resultFirst.data.allArtistOnlySinger.paginatorInfo.lastPage
//   artists.push(...resultFirst.data.allArtistOnlySinger.data)

//   const allPage = await Promise.all([...Array(totalPageCount)].map(async i => {
//     const page = i + 1
//     const result = await allArtistOnlySingerFull(first, 1)
//     return result.data.allArtistOnlySinger.data
//   }))
//   artists.push(...allPage.flat())
//   console.log(artists)

//   return artists
// }

export const queryAllArtistOnlySingerFull = async () => {
  const artists = []
  const first = 1000;
  
  for(let page = 1; page < 50; page++) {
    const result = await allArtistOnlySingerFull(first, page)
    // console.log(`only singer(${page}): `, result)
    artists.push(...result.data.allArtistOnlySinger.data)
    if (!result.data.allArtistOnlySinger.paginatorInfo.hasMorePages) break
  }
  // console.log(`only singer: `, artists)
  return artists
}

export const queryAllArtistWithoutSingerLess = async () => {
  const artists = []
  const first = 2000;
  
  for(let page = 1; page < 50; page++) {
    const result = await allArtistWithoutSingerLess(first, page)
    // console.log(`without singer(${page}): `, result)
    artists.push(...result.data.allArtistWithoutSinger.data)
    if (!result.data.allArtistWithoutSinger.paginatorInfo.hasMorePages) break
  }
  // console.log(`without singer: `, artists)
  return artists
}

export const findArtistById = id => client.query({
  query: FIND_ARTIST_BY_ID,
  variables: { id: `%${id}%` }
})
;

export const findArtistByName = name => client.query({
  query: FIND_ARTIST_BY_NAME,
  variables: { name: `%${name}%` }
})
;
