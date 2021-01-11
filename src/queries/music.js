import { gql } from '@apollo/client';
import { client } from './client';

const ALL_MUSIC = gql`
query {
  allMusic {
    id
    title
    composers {
      id
      name
      id_twitter
    }
    lyricists {
      id
      name
      id_twitter
    }
    arrangers {
      id
      name
      id_twitter
    }
  }
}
`;

const MUSIC = gql`
query($id: String!) {
    music(id: $id) {
        id
    }
}
`
;

const FIND_MUSIC_BY_ID = gql`
query($id: String) {
  findMusic(id: $id) {
    id
    title
  }
}
`;

const FIND_MUSIC_BY_TITLE = gql`
query($title: String) {
  findMusic(title: $title) {
    id
    title
  }
}
`;

export const allMusic = () => client.query({
  query: ALL_MUSIC
});

export const queryMusic = id => client.query({
  query: MUSIC,
  variables: { id }
});

export const findMusicById = id => client.query({
  query: FIND_MUSIC_BY_ID,
  variables: { id: `%${id}%` }
})
;

export const findMusicByTitle = title => client.query({
  query: FIND_MUSIC_BY_TITLE,
  variables: { title: `%${title}%` }
})
;
