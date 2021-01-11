import { gql } from '@apollo/client';
import { client } from './client';
import { requestVideos } from './requestVideo';

const UPSERT_VIDEO = gql`
mutation(
  $id: String!
  $custom_music_name: String
  $is_original_music: Boolean
  $music_id: String!
  $music_title: String!
  $music_composers: [ArtistInput!]
  $music_lyricists: [ArtistInput!]
  $music_arrangers: [ArtistInput!]
  $singers: [ArtistInput!]
  $video_mixers: [ArtistInput!]
  $video_off_vocals: [ArtistInput!]
  $video_arrangers: [ArtistInput!]
) {
  upsertVideo(
    id: $id,
    content: {
      custom_music_name: $custom_music_name
      is_original_music: $is_original_music
      music: {
        upsert: {
          id: $music_id
          title: $music_title
          composers: {
            upsert: $music_composers
          }
          lyricists: {
            upsert: $music_lyricists
          }
          arrangers: {
            upsert: $music_arrangers
          }
        }
      }
      singers: {
        upsert: $singers
      }
      mixers: { upsert: $video_mixers }
      off_vocals: { upsert: $video_off_vocals }
      arrangers: { upsert: $video_arrangers }
    }
  ) {
    id
    custom_music_name
    is_original_music
    music {
      id
      title
      composers {
        id
        name
        id_twitter
        composer_music {
          id
        }
      }
      lyricists{
        id
        name
        id_twitter
        lyricist_music {
          id
        }
      }
      arrangers{
        id
        name
        id_twitter
        arranger_music {
          id
        }
      }
    }
    singers {
      id
      name
      name_ruby
      profile
      birthday
      id_youtube
      id_twitter
      singer_videos {
        id
      }
    }
    mixers {
      id
      name
      id_twitter
      mixer_videos {
        id
      }
    }
    off_vocals {
      id
      name
      id_twitter
      off_vocal_videos {
        id
      }
    }
    arrangers {
      id
      name
      id_twitter
      arranger_videos {
        id
      }
    }
  }
}
`

const c = str => str === '' ? null : str

const convArtistFull = artists => {
    if (artists.length === 0) return null
    return artists.map(artist => {
        const newArtist = {}
        newArtist.id = c(artist.id)
        newArtist.name = c(artist.name)
        newArtist.name_ruby = c(artist.name_ruby)
        newArtist.profile = c(artist.profile)
        newArtist.birthday = c(artist.birthday)
        newArtist.id_youtube = c(artist.id_youtube)
        newArtist.id_twitter = c(artist.id_twitter)
        return newArtist
    })
}

const convArtistLess = artists => {
    if (artists.length === 0) return null
    return artists.map(artist => {
        const newArtist = {}
        newArtist.id = c(artist.id)
        newArtist.name = c(artist.name)
        newArtist.id_twitter = c(artist.id_twitter)
        return newArtist
    })
}

export const upsertVideo = (requestVideo) => {
    console.log(requestVideo)
    return client.mutate({
        mutation: UPSERT_VIDEO,
        variables: {
            id: c(requestVideo.id),
            custom_music_name: c(requestVideo.custom_music_name),
            is_original_music: requestVideo.is_original_music,
            music_id: c(requestVideo.music.id),
            music_title: c(requestVideo.music.title),
            music_composers: convArtistLess(requestVideo.music.composers),
            music_lyricists: convArtistLess(requestVideo.music.lyricists),
            music_arrangers: convArtistLess(requestVideo.music.arrangers),
            singers: convArtistFull(requestVideo.singers),
            video_mixers: convArtistLess(requestVideo.mixers),
            video_off_vocals: convArtistLess(requestVideo.off_vocals),
            video_arrangers: convArtistLess(requestVideo.arrangers),
        }
    })
    }