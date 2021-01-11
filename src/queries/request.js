import { gql } from '@apollo/client';
import { client } from './client';

const REQUEST_VIDEOS = gql`
query {
    requestVideos {
      id
      stage
      content
      contributor_twitter_id
      updated_at
      created_at
    }
}
`
;

const CREATE_REQUEST_VIDEOS = gql`
mutation($id: String!, $stage: Int!, $content: String!, $contributor_twitter_id: String) {
  createRequestVideo(input: {
    id: $id
    stage: $stage
    content: $content
    contributor_twitter_id: $contributor_twitter_id
  }) {
    id
    stage
    content
    contributor_twitter_id
  }
}
`

export const queryRequestVideos = () => client.query({
  query: REQUEST_VIDEOS
});

export const createRequestVideo = (id, stage, content, contributor_twitter_id) => client.mutate({
  mutation: CREATE_REQUEST_VIDEOS,
  variables: {
    id,
    stage,
    content,
    contributor_twitter_id,
  }
})