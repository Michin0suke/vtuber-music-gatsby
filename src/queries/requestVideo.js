import { gql } from '@apollo/client';
import { client } from './client';

const REQUEST_COUNT_BY_DAY = gql`
{
  requestVideosCountByDay {
    count
    date
  }
}`

const REQUEST_VIDEOS = gql`
query($id: String){
  requestVideos(id: $id, orderBy: [{field: STAGE, order: ASC}, {field: IS_ISSUE, order: DESC}, {field: CONTRIBUTOR_TWITTER_ID, order: DESC}, {field: UPDATED_AT, order: DESC}]) {
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

const REQUEST_VIDEOS_PAGINATE = gql`
query($first: Int!, $page: Int!){
  requestVideosPaginate(first: $first, page: $page, orderBy: [{field: STAGE, order: ASC}, {field: IS_ISSUE, order: DESC}, {field: CONTRIBUTOR_TWITTER_ID, order: DESC}, {field: UPDATED_AT, order: DESC}]) {
    paginatorInfo {
      total
      hasMorePages
      currentPage
    }
    data {
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
  requestVideosCount
}
`

const REQUEST_VIDEOS_PAGINATE_ALL = gql`
query($contributor_twitter_id: String){
  requestVideosPaginate(contributor_twitter_id: $contributor_twitter_id, first: 1) {
    paginatorInfo {
      total
    }
  }
  requestVideosCount
}
`

const REQUEST_VIDEOS_LESS = gql`
{
  requestVideos {
    id
    contributor_twitter_id
    is_done
    is_issue
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

export const queryRequestCountByDay = () => {
  return client.query({
    query: REQUEST_COUNT_BY_DAY
  })
}

export const requestVideos = () => {
  return client.query({
    query: REQUEST_VIDEOS
  })
}
export const findRequestVideo = (id) => {
  return client.query({
    query: REQUEST_VIDEOS,
    variables: { id }
  })
}

export const requestVideosPaginate = (first, page) => {
  return client.query({
    query: REQUEST_VIDEOS_PAGINATE,
    variables: {
      first,
      page,
    }
  })
}

export const requestVideosCountByTwitterId = (contributor_twitter_id) => {
  return client.query({
    query: REQUEST_VIDEOS_PAGINATE_ALL,
    variables: { contributor_twitter_id }
  })
  .then(result => result.data?.requestVideosPaginate?.paginatorInfo?.total)
  .catch(e => console.log(e))
}

export const requestVideosLess = () => {
  return client.query({
    query: REQUEST_VIDEOS_LESS
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
