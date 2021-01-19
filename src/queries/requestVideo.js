import { gql } from '@apollo/client';
import { client } from './client';

const REQUEST_VIDEOS = gql`
{
  requestVideos(orderBy: [{field: STAGE, order: ASC}, {field: IS_ISSUE, order: DESC}, {field: CONTRIBUTOR_TWITTER_ID, order: DESC}, {field: UPDATED_AT, order: DESC}]) {
    id
    stage
    content
    contributor_twitter_id
    is_done
    is_issue
    updated_at
    created_at
  }
  requestVideosCount
}
`

const UPSERT_REQUEST_VIDEO = gql`
mutation(
    $id: String!
    $stage: Int!
    $content: String!
    $contributor_twitter_id: String
    $is_done: Boolean
    $is_issue: Boolean
) {
  upsertRequestVideo(
    id: $id,
    content: {
        stage: $stage
        content: $content
        contributor_twitter_id: $contributor_twitter_id
        is_done: $is_done
        is_issue: $is_issue
    }) {
    id
    stage
    content
    contributor_twitter_id
    is_done
    is_issue
    updated_at
    created_at
  }
}
`

export const requestVideos = () => {
  return client.query({
    query: REQUEST_VIDEOS
  })
}

export const upsertRequestVideo = (requestVideo) => {
  const requestVideoCopy = JSON.parse(JSON.stringify(requestVideo))
  if (!requestVideoCopy.contributor_twitter_id) {
    requestVideoCopy.contributor_twitter_id = window.localStorage.getItem('twitter_id')
  }
  return client.mutate({
    mutation: UPSERT_REQUEST_VIDEO,
    variables: {
      id: requestVideoCopy.id,
      stage: requestVideoCopy.stage,
      content: JSON.stringify(requestVideoCopy, null, 4),
      contributor_twitter_id: requestVideoCopy.contributor_twitter_id,
      is_done: requestVideoCopy.is_done,
      is_issue: requestVideoCopy.is_issue,
    }
  }).then(result => {
    console.log(`upsert success requestVideo`, result.data?.upsertRequestVideo)
    return result
  })
  .catch(e => {throw new Error(e)})
}
