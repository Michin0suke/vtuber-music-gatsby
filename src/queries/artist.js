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

const ALL_ARTIST_ONLY_COMPLETE = gql`
query {
    allArtist {
      id
      name
      name_ruby
      id_twitter
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

export const allArtistOnlyComplete = () => client.query({
  query: ALL_ARTIST_ONLY_COMPLETE,
})
;

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
