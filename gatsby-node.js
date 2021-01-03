const realFs = require('fs')
const gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(realFs)

exports.sourceNodes = async ({ actions: { createNode }, createContentDigest }) => {
    gracefulFs.readFile(`api/allVideo.json`, (err, data) => {
        if (err) throw new Error(err)
        JSON.parse(data).data.allVideo.forEach(video => {
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
    })

    gracefulFs.readFile(`api/allMusic.json`, (err, data) => {
        if (err) throw new Error(err)
        JSON.parse(data).data.allMusic.forEach(music => {
            createNode({
                ...music,
                videos: music.videos.map(i => i.id),
                composers: music.composers.map(i => i.id),
                lyricists: music.lyricists.map(i => i.id),
                arrangers: music.arrangers.map(i => i.id),
                internal: {
                    type: 'Music',
                    contentDigest: createContentDigest(music)
                }
            })
        })
    })

    gracefulFs.readFile(`api/allArtist.json`, (err, data) => {
        if (err) throw new Error(err)
        JSON.parse(data).data.allArtist.forEach(artist => {
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
    })
}

exports.createPages = async ({ graphql, actions: { createPage }, getNode }) => {
    const artistImageFileNode = async (type, id) => {
        if (!['header', 'icon', 'video_thumbnail'].includes(type)) throw new Error(`invalid augment ${type}`)
        let fileId
        ['primary', 'twitter', 'youtube'].reduce((promise, cur) => {
            promise.then(_ => {
                if (!fileId) {
                    const result = await graphql(`
                        {
                            file(relativeDirectory: {eq: "img/${type}/${cur}"}, name: {eq: "${id}"}) {
                                id
                            }
                        }
                    `)
                    const resultDataFileId = result && result.data && result.data.file && result.data.file.id
                    if (resultDataFileId) fileId = resultDataFileId
                }
            })
        }, Promise.resolve())
        return fileId && getNode(fileId)
    }

    const videoImageFileNode = async id => {
        const { data: { file } } = await graphql(`
            {
                file(relativeDirectory: {eq: "img/video_thumbnail/youtube"}, name: {eq: "${id}"}) {
                    id
                }
            }`)
        return file && file.id && getNode(file.id)
    }

    const { data: { allArtist } } = await graphql(`
        {
            allArtist {
                nodes { id }
            }
        }
    `)
    allArtist.nodes.forEach(async ({ id }) => {
        createPage({
            path: `/artist/${id}`,
            component: require.resolve('./src/templates/artist.js'),
            context: { id }
        })

        // console.log(JSON.stringify(getNode({id}), null, 4))
        const currentNode = getNode(id)

        const headerImageNode = await artistImageFileNode('header', id)
        if (headerImageNode) {
            currentNode.header_image = headerImageNode.id
            headerImageNode.parent = currentNode.id
        }

        const iconImageNode = await artistImageFileNode('icon', id)
        if (iconImageNode) {
            currentNode.profile_image = iconImageNode.id
            iconImageNode.parent = currentNode.id
        }
    })

    const { data: { allVideo }} = await graphql(`
    {
        allVideo {
            nodes { id }
        }
    }
    `)
    allVideo.nodes.forEach(async ({ id }) => {
        createPage({
            path: `/video/${id}`,
            component: require.resolve('./src/templates/video.js'),
            context: { id }
        })

        const currentNode = getNode(id)
        
        const thumbnailNode = await videoImageFileNode(id)
        if (thumbnailNode) {
            currentNode.thumbnail_image = thumbnailNode.id
            thumbnailNode.parent = currentNode.id
        }
    })

    const { data: { allMusic }} = await graphql(`
    {
        allMusic {
            nodes { id }
        }
    }
    `)
    allMusic.nodes.forEach(async ({id}) => {
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
            is_original_music: Boolean!
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
            name_original: String
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
            image_url_profile_icon_source_url: String
            image_url_profile_header_source_url: String
            image_front_type_icon: String
            image_front_type_header: String
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
            profile_source_type: String
            header_image: File @link
            header_source_type: String
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
        }
    `)
}