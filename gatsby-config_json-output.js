const siteUrl = 'https://vtuber-music.com/'

const artistsPageInfo = [
    {
        pathRole: 'singers',
        pathSort: null,
        roleName: 'アーティスト',
        filter: `{is_singer: {eq: true}}`,
        sort: `{order: DESC, fields: count_singer_videos}`,
        countKey: `count_singer_videos`,
    },
    {
        pathRole: 'singers',
        pathSort: 'release_date',
        roleName: 'アーティスト',
        filter: `{is_singer: {eq: true}}`,
        sort: `{order: DESC, fields: singer_videos___release_date}`,
        countKey: `count_singer_videos`,
    },
    {
        pathRole: 'singers',
        pathSort: 'ruby',
        roleName: 'アーティスト',
        filter: `{is_singer: {eq: true}}`,
        sort: `{order: DESC, fields: name_ruby}`,
        countKey: `count_singer_videos`,
    },

    {
        pathRole: 'composers',
        pathSort: null,
        roleName: '作曲者',
        filter: `{is_lyricist: {eq: true}}`,
        sort: `{order: DESC, fields: count_composer_music}`,
        countKey: `count_composer_music`,
    },
    {
        pathRole: 'composers',
        pathSort: 'release_date',
        roleName: '作曲者',
        filter: `{is_lyricist: {eq: true}}`,
        sort: `{order: DESC, fields: composer_music___videos___release_date}`,
        countKey: `count_composer_music`,
    },
    {
        pathRole: 'composers',
        pathSort: 'ruby',
        roleName: '作曲者',
        filter: `{is_lyricist: {eq: true}}`,
        sort: `{order: DESC, fields: name_ruby}`,
        countKey: `count_composer_music`,
    },

    {
        pathRole: 'lyricists',
        pathSort: null,
        roleName: '作詞者',
        filter: `{is_lyricist: {eq: true}}`,
        sort: `{order: DESC, fields: count_lyricist_music}`,
        countKey: `count_lyricist_music`,
    },
    {
        pathRole: 'lyricists',
        pathSort: 'release_date',
        roleName: '作詞者',
        filter: `{is_lyricist: {eq: true}}`,
        sort: `{order: DESC, fields: lyricist_music___videos___release_date}`,
        countKey: `count_lyricist_music`,
    },
    {
        pathRole: 'lyricists',
        pathSort: 'ruby',
        roleName: '作詞者',
        filter: `{is_lyricist: {eq: true}}`,
        sort: `{order: DESC, fields: name_ruby}`,
        countKey: `count_lyricist_music`,
    },

    {
        pathRole: 'mixers',
        pathSort: null,
        roleName: 'Mixer',
        filter: `{is_mixer: {eq: true}}`,
        sort: `{order: DESC, fields: count_mixer_videos}`,
        countKey: `count_mixer_videos`,
    },
    {
        pathRole: 'mixers',
        pathSort: 'release_date',
        roleName: 'Mixer',
        filter: `{is_mixer: {eq: true}}`,
        sort: `{order: DESC, fields: mixer_videos___release_date}`,
        countKey: `count_mixer_videos`,
    },
    {
        pathRole: 'mixers',
        pathSort: 'ruby',
        roleName: 'Mixer',
        filter: `{is_mixer: {eq: true}}`,
        sort: `{order: DESC, fields: name_ruby}`,
        countKey: `count_mixer_videos`,
    }
]

const pluginConverter = ({ pathRole, pathSort, filter, sort, countKey }) => {
    const filename = pathSort ? `${pathRole}_sort_${pathSort}` : pathRole
    return {
        resolve: `gatsby-plugin-json-output`,
        options: {
        siteUrl: siteUrl, // defined on top of plugins
        graphQLQuery: `
        {
            allArtist(filter: ${filter}, sort: ${sort}, skip: 36) {
                nodes {
                    id
                    name
                    birthday
                    ${countKey}
                    profile_image {
                    childImageSharp {
                        fluid {
                        aspectRatio
                        src
                        srcSet
                        sizes
                        }
                    }
                    }
                    singer_videos {
                        id
                        release_date
                    }
                    parents {
                        name
                    }
                }
            }
        }        
        `,
        serialize: results => results.data.allArtist.nodes.map(_ => ({
            // path: pathSort ? `/${pathRole}/sort/${pathSort}/` : `/`, // MUST contain a path
            path: ``
        })),
        serializeFeed: results => results.data.allArtist.nodes,
        feedFilename: filename,
        nodesPerFeedFile: 36,
        }
    }
}

const main = () => {
    return artistsPageInfo.map(info => {
        return pluginConverter(info)
    })
}

module.exports = main

console.log(JSON.stringify(main(), null, 4))