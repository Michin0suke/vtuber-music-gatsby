const { ApolloClient, InMemoryCache } = require('@apollo/client')
const fetch = require('node-fetch')
const { createHttpLink } = require('apollo-link-http')
const gql = require('graphql-tag')

const client = new ApolloClient({
    link: createHttpLink({
        uri: process.env.MODE === `development` ? 'http://vtuber-music.test/graphql' : 'https://api.vtuber-music.com/graphql',
        fetch
    }),
    cache: new InMemoryCache(),
})

const ALL_VIDEO_PAGINATE = gql`
  query($page: Int!){
    allVideoPaginate(first: 100, page: $page) {
      paginatorInfo {
        count
        currentPage
        hasMorePages
        perPage
        total
      }
      data {
        id
        music {
          id
        }
        release_date
        is_mv
        is_original_music
        original_video_id
        custom_music_name
        singers {
          id
        }
        mixers {
          id
        }
        off_vocals {
          id
        }
        arrangers {
          id
        }
        recommends {
          id
        }
        created_at
        updated_at
      }
    }
  }
`

const ALL_MUSIC_PAGINATE = gql`
  query($page: Int!){
    allMusicPaginate(first: 100, page: $page) {
      paginatorInfo {
        count
        currentPage
        hasMorePages
        perPage
        total
      }
      data {
        id
        title
        title_ruby
        lyrics
        lyrics_url
        genre
        original_video_youtube_id
        videos {
          id
        }
        composers {
          id
        }
        lyricists {
          id
        }
        arrangers {
          id
        }
        created_at
        updated_at
      }
    }
  }
`

const ALL_ARTIST_PAGINATE = gql`
  query($page: Int!){
    allArtistPaginate(first: 100, page: $page) {
      paginatorInfo {
        count
        currentPage
        hasMorePages
        perPage
        total
      }
      data {
        id
        name
        name_ruby
        name_original
        profile
        sex
        birthday
        id_youtube
        youtube_registration_date
        id_twitter
        id_instagram
        url_niconico
        url_homepage
        id_spotify
        id_apple_music
        id_showroom
        id_openrec
        id_bilibili
        id_tiktok
        id_twitcasting
        id_facebook
        id_pixiv
        image_url_profile_icon_source_url
        image_url_profile_header_source_url
        image_front_type_icon
        image_front_type_header
        youtube_channel_is_user
        recommends {
          id
        }
        children {
          id
        }
        parents {
          id
        }
        composer_music {
          id
        }
        lyricist_music {
          id
        }
        arranger_music {
          id
        }
        mixer_videos {
          id
        }
        off_vocal_videos {
          id
        }
        arranger_videos {
          id
        }
        singer_videos {
          id
        }
        created_at
        updated_at
      }
    }
  }
`

const fetchData = async (query, queryName) => {
      console.log(process.env.MODE === `development` ? 'http://vtuber-music.test/graphql' : 'https://api.vtuber-music.com/graphql')
      let page = 1
      const arr = []
      while(true) {
          const response = await client.query({ query, variables: { page } })
              .catch(e => {
                  throw new Error(e)
              })
          // console.log(JSON.stringify(response.data[queryName].paginatorInfo.hasMorePages))
          // console.log(JSON.stringify(response, null, 2))
          arr.push(...response.data[queryName].data)
          if (!response.data[queryName].paginatorInfo.hasMorePages) break
          page++
      }
      // const data = {}
      // data[queryName] = arr
      return arr
}

const queryAllVideo = async () => {
  return await fetchData(ALL_VIDEO_PAGINATE, 'allVideoPaginate')
}

const queryAllMusic = async () => {
  return await fetchData(ALL_MUSIC_PAGINATE, 'allMusicPaginate')
}

const queryAllArtist = async () => {
  return await fetchData(ALL_ARTIST_PAGINATE, 'allArtistPaginate')
}

module.exports = {
  queryAllVideo,
  queryAllMusic,
  queryAllArtist
}