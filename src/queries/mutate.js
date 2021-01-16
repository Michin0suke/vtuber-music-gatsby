import { gql } from '@apollo/client';
import { client } from './client';
import gen64 from '../utils/gen64'

const genId = (artist, retry) => {
  if (retry) return gen64()
  if (artist.id_twitter) return artist.id_twitter
  return artist.id
}

const UPSERT_MUSIC = gql`
mutation($id: String!, $title: String!) {
  upsertMusic(
    id: $id,
    content: {
      title: $title
    }
  ) {
    id
    title
  }
}
`

const UPSERT_ARTIST_LESS = gql`
mutation($id: String!, $name: String!, $id_twitter: String) {
  upsertArtist(
    id: $id
    content: {
      name: $name
      id_twitter: $id_twitter
    }
  ) {
    id
  }
}
`

const UPSERT_ARTIST_FULL = gql`
mutation(
  $id: String!,
  $name: String!,
  $name_ruby: String,
  $profile: String,
  $birthday: Date,
  $id_youtube: String,
  $id_twitter: String
) {
  upsertArtist(
    id: $id
    content: {
      name: $name
      name_ruby: $name_ruby
      profile: $profile
      birthday: $birthday
      id_youtube: $id_youtube
      id_twitter: $id_twitter
    }
    ) {
    id
  }
}
`

export const upsertMusic = (music) => {
  if (!music.title) throw new Error('music.title is undefined')
  return client.mutate({
    mutation: UPSERT_MUSIC,
    variables: {
      id: music.id,
      title: music.title,
    }
  })
}

export const upsertArtistLess = (artist) => {
  if (!artist.name) throw new Error('artist.name is undefined')
  return client.mutate({
    mutation: UPSERT_ARTIST_LESS,
    variables: {
      // id: genId(artist, retry),
      id: artist.id,
      name: artist.name,
      id_twitter: artist.id_twitter,
    }
  })
}

export const upsertArtistFull = (artist) => {
  if (!artist.name) throw new Error('artist.name is undefined')
  return client.mutate({
    mutation: UPSERT_ARTIST_FULL,
    variables: {
      // id: genId(artist, retry),
      id: artist.id,
      name: artist.name,
      name_ruby: artist.name_ruby,
      profile: artist.profile,
      birthday: artist.birthday,
      id_youtube: artist.id_youtube,
      id_twitter: artist.id_twitter,
    }
  })
}
