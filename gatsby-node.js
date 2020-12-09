const { ApolloClient } = require('apollo-client')
const { InMemoryCache } = require('apollo-cache-inmemory')
const fetch = require('node-fetch')
const { createHttpLink } = require('apollo-link-http')
const { createRemoteFileNode } = require('gatsby-source-filesystem')
const gql = require('graphql-tag')
const { useStaticQuery, graphql } = require('gatsby')

const youtubeApiKey = 'AIzaSyBkn0LB-sw4ZiPEs069rCEotczo1Qi6ZPY'

const client = new ApolloClient({
    link: createHttpLink({
        uri: 'https://vtuber-music.com/graphql',
        // uri: 'http://vtuber-music.test/graphql',
        fetch
    }),
    cache: new InMemoryCache(),
})

exports.sourceNodes = async ({ actions: { createNode }, createNodeId, createContentDigest }) => {
    const { data: { allVideo } } = await client.query({
        query: gql`
            {
                allVideo {
                    id
                    music { id }
                    release_date
                    is_mv
                    original_video_id
                    custom_music_name
                    singers { id }
                    mixers { id }
                    off_vocals { id }
                    arrangers { id }
                    recommends { id }
                    # created_at
                    # updated_at
                }
            }
        `
    })
    allVideo.forEach(video => {
        createNode({
            ...video,
            music: video.music.id,
            singers: video.singers.map(i => i.id),
            mixers: video.mixers.map(i => i.id),
            off_vocals: video.off_vocals.map(i => i.id),
            arrangers: video.arrangers.map(i => i.id),
            recommends: video.recommends.map(i => i.id),
            internal: {
                type: 'Video',
                contentDigest: createContentDigest(video)
            }
        })
    })

    const { data: { allMusic } } = await client.query({
        query: gql`
            {
                allMusic {
                    id
                    title
                    title_ruby
                    lyrics
                    lyrics_url
                    genre
                    original_video_youtube_id
                    videos { id }
                    composers { id }
                    lyricists { id }
                    arrangers { id }
                    # created_at
                    # updated_at
                }
            }
        `
    })
    allMusic.forEach(m => {
        createNode({
            ...m,
            videos: m.videos.map(v => v.id),
            composers: m.composers.map(v => v.id),
            lyricists: m.lyricists.map(v => v.id),
            arrangers: m.arrangers.map(v => v.id),
            internal: {
                type: 'Music',
                contentDigest: createContentDigest(m)
            }
        })
    })

    const { data: { allArtist } } = await client.query({
        query: gql`
            {
                allArtist {
                    id
                    name
                    name_ruby
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
                    youtube_channel_is_user
                    recommends { id }
                    children { id }
                    parents { id }
                    composer_music { id }
                    lyricist_music { id }
                    arranger_music { id }
                    mixer_videos { id }
                    off_vocal_videos { id }
                    arranger_videos { id }
                    singer_videos { id }
                    # created_at
                    # updated_at
                }
            }
        `
    })

    allArtist.forEach(artist => {
        createNode({
            ...artist,
            recommends: artist.recommends.map(i => i.id),
            children: artist.children.map(i => i.id),
            parents: artist.parents.map(i => i.id),
            composer_music: artist.composer_music.map(i => i.id),
            lyricist_music: artist.lyricist_music.map(i => i.id),
            arranger_music: artist.arranger_music.map(i => i.id),
            mixer_videos: artist.mixer_videos.map(i => i.id),
            off_vocal_videos: artist.off_vocal_videos.map(i => i.id),
            arranger_videos: artist.arranger_videos.map(i => i.id),
            singer_videos: artist.singer_videos.map(i => i.id),
            internal: {
                type: 'Artist',
                contentDigest: createContentDigest(artist)
            }
        })
    })
}

exports.onCreateNode = async ({ actions: { createNode }, node, getCache, createNodeId, boundActionCreators }) => {
    const { deleteNode } = boundActionCreators

    if (node.internal.type === 'Video') {
        let fileNode

        // たぶん一番綺麗なサムネイル。hq720との違いは不明
        try {
            fileNode = await createRemoteFileNode({
                url: `https://i.ytimg.com/vi/${node.id}/maxresdefault.jpg`,
                parentNodeId: node.id,
                getCache,
                createNode,
                createNodeId,
            })
        } catch (e) {
            // ignore
        }

        // 高画質なサムネイルを取得しようとするが、存在しない場合もある
        try {
            fileNode = await createRemoteFileNode({
                url: `https://i.ytimg.com/vi/${node.id}/hq720.jpg`,
                parentNodeId: node.id,
                getCache,
                createNode,
                createNodeId,
            })
        } catch (e) {
            // ignore
        }

        // 高画質版がない場合は、低画質版を取得する
        if (!fileNode) {
            try {
                fileNode = await createRemoteFileNode({
                    url: `https://i.ytimg.com/vi/${node.id}/sddefault.jpg`,
                    parentNodeId: node.id,
                    getCache,
                    createNode,
                    createNodeId,
                })
            } catch (e) {
                // ignore
            }
        }

        // 高画質版、低画質版のいずれかが取得できている場合は、ノードの追加する
        if (fileNode) {
            node.thumbnail_image = fileNode.id
        } else {
            console.log(`can't fetch thumbnail image (video_id: ${node.id})`)
            deleteNode(node)
        }
    } else if (node.internal.type === 'Artist') {
        const profileImgUrl = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${node.id_youtube}&key=${youtubeApiKey}`)
            .then(response => response.json())
            .then(json => json?.items?.[0]?.snippet?.thumbnails?.high?.url)

        let fileNode

        if (profileImgUrl) {
            fileNode = await createRemoteFileNode({
                url: profileImgUrl,
                parentNodeId: node.id,
                getCache,
                createNode,
                createNodeId
            })
        }

        if (fileNode) {
            console.log('success fetch profile image')
            node.profile_image = fileNode.id
        } else {
            console.log('can\'t fetch profile image')
        }
        
    }
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
    const { data: { allArtist } } = await graphql(`
        {
            allArtist {
                nodes {
                    id
                }
            }
        }
    `)
    allArtist.nodes.forEach(({ id }) => {
        createPage({
            path: `/artist/${id}`,
            component: require.resolve('./src/templates/artist.js'),
            context: { id }
        })
    })

    const { data: { allVideo }} = await graphql(`
    {
        allVideo {
            nodes {
                id
            }
        }
    }
    `)
    allVideo.nodes.forEach(({ id }) => {
        createPage({
            path: `/video/${id}`,
            component: require.resolve('./src/templates/video.js'),
            context: { id }
        })
    })

    const { data: { allMusic }} = await graphql(`
    {
        allMusic {
            nodes {
                id
            }
        }
    }
    `)
    allMusic.nodes.forEach(({id}) => {
        createPage({
            path: `/music/${id}`,
            component: require.resolve('./src/templates/music.js'),
            context: { id }
        })
    })
}

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
    createTypes(`
        type Video implements Node {
            id: String!
            music: Music! @link
            release_date: Date @dateformat
            is_mv: Boolean!
            original_video_id: String
            custom_music_name: String
            singers: [Artist!]! @link
            mixers: [Artist]! @link
            off_vocals: [Artist]! @link
            arrangers: [Artist]! @link
            recommends: [Video]! @link
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
            thumbnail_image: File @link
        }

        type Music implements Node {
            id: String!
            title: String!
            title_ruby: String
            lyrics: String
            lyrics_url: String
            genre: String
            original_video_youtube_id: String
            videos: [Video]! @link
            composers: [Artist]! @link
            lyricists: [Artist]! @link
            arrangers: [Artist]! @link
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
        }

        type Artist implements Node {
            id: String!
            name: String!
            name_ruby: String
            profile: String
            sex: String
            birthday: Date @dateformat
            id_youtube: String
            youtube_registration_date: Date @dateformat
            id_twitter: String
            id_instagram: String
            url_niconico: String
            url_homepage: String
            id_spotify: String
            id_apple_music: String
            id_showroom: Int
            id_openrec: String
            id_bilibili: Int
            id_tiktok: String
            id_twitcasting: String
            id_facebook: String
            id_pixiv: Int
            youtube_channel_is_user: Boolean!
            recommends: [Artist]! @link
            children: [Artist]! @link
            parents: [Artist]! @link
            composer_music: [Music]! @link
            lyricist_music: [Music]! @link
            arranger_music: [Music]! @link
            mixer_videos: [Video]! @link
            off_vocal_videos: [Video]! @link
            arranger_videos: [Video]! @link
            singer_videos: [Video]! @link
            profile_image: File @link
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
        }
    `)
}