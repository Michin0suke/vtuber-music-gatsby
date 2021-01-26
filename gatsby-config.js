const siteUrl = `https://vtuber-music.com`

module.exports = {
  flags: { QUERY_ON_DEMAND: true },
  siteMetadata: {
    title: `Vtuber Music`,
    description: `Vtuber Musicは、Vtuberの歌ってみた動画をまとめたサイトです。`,
    author: `@VtuberMusicCom`,
    siteUrl: `https://vtuber-music.com`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: siteUrl, // defined on top of plugins
        graphQLQuery: `
        {
          allVideoOrderByReleasedAt:allVideo(sort: {order: DESC, fields: release_date}, skip: 24, limit: 240) {
            nodes {
              id
              release_date
              is_original_music
              custom_music_name
              thumbnail_image {
                  childImageSharp {
                      fluid(quality: 70, pngQuality: 70, maxWidth: 330) {
                        aspectRatio
                        src
                        srcSet
                        sizes
                      }
                  }
              }
              music {
                  id
                  title
              }
              singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                    }
                }
              }
            }
          }
        }`,
        serialize: results => results.data.allVideoOrderByReleasedAt.nodes.map(_ => ({
          path: ``, // MUST contain a path
        })),
        serializeFeed: results => results.data.allVideoOrderByReleasedAt.nodes,
        feedFilename: `all_video_order_by_release_date`,
        nodesPerFeedFile: 24,
      }
    },
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: siteUrl, // defined on top of plugins
        graphQLQuery: `
        {
          allVideoOrderByCreatedAt:allVideo(sort: {order: DESC, fields: created_at}, skip: 24, limit: 240) {
            nodes {
              id
              release_date
              is_original_music
              custom_music_name
              thumbnail_image {
                  childImageSharp {
                      fluid(quality: 70, pngQuality: 70, maxWidth: 330) {
                        aspectRatio
                        src
                        srcSet
                        sizes
                      }
                  }
              }
              music {
                  id
                  title
              }
              singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                          aspectRatio
                          src
                          srcSet
                          sizes
                        }
                    }
                }
              }
            }
          }
        }`,
        serialize: results => results.data.allVideoOrderByCreatedAt.nodes.map(_ => ({
          path: ``, // MUST contain a path
        })),
        serializeFeed: results => results.data.allVideoOrderByCreatedAt.nodes,
        feedFilename: `all_video_order_by_created_at`,
        nodesPerFeedFile: 24,
      }
    },
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: siteUrl, // defined on top of plugins
        graphQLQuery: `
        {
          allArtistOrderBySingerVideosCount: allArtist(filter: {is_singer: {eq: true}}, sort: {order: DESC, fields: count_singer_videos}, skip: 36) {
            nodes {
              id
              name
              birthday
              profile_image {
                childImageSharp {
                  fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                    aspectRatio
                    src
                    srcSet
                    sizes
                  }
                }
              }
              singer_videos {
                  id
              }
              parents {
                  name
              }
            }
          }
        }        
        `,
        serialize: results => results.data.allArtistOrderBySingerVideosCount.nodes.map(_ => ({
          path: ``, // MUST contain a path
        })),
        serializeFeed: results => results.data.allArtistOrderBySingerVideosCount.nodes,
        feedFilename: `all_singer_order_by_count_singer_videos`,
        nodesPerFeedFile: 36,
      }
    },
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: siteUrl, // defined on top of plugins
        graphQLQuery: `
        {
          allArtistOrderByMixerVideosCount: allArtist(filter: {is_mixer: {eq: true}}, sort: {order: DESC, fields: count_mixer_videos}, skip: 36) {
            nodes {
              id
              name
              birthday
              profile_image {
                childImageSharp {
                  fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
                    aspectRatio
                    src
                    srcSet
                    sizes
                  }
                }
              }
              singer_videos {
                  id
              }
              parents {
                  name
              }
            }
          }
        }        
        `,
        serialize: results => results.data.allArtistOrderByMixerVideosCount.nodes.map(_ => ({
          path: ``, // MUST contain a path
        })),
        serializeFeed: results => results.data.allArtistOrderByMixerVideosCount.nodes,
        feedFilename: `all_mixer_order_by_count_mixer_videos`,
        nodesPerFeedFile: 36,
      }
    },
    `gatsby-plugin-netlify-cache`,
    '@bumped-inc/gatsby-plugin-optional-chaining',
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://vtuber-music.com`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `api`,
        path: `${__dirname}/api`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/assets`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `vtuber-music`,
        short_name: `vtuber-music`,
        start_url: `/`,
        background_color: `#db2311`,
        theme_color: `#db2311`,
        display: `minimal-ui`,
        icon: `src/images/vtuber-music-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: ['/request_add_video', '/request_add_video_preview']
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-185387868-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: false,
        // Setting this parameter is also optional
        respectDNT: false,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Enables Google Optimize using your container Id
        // optimizeId: "",
        // Enables Google Optimize Experiment ID
        // experimentId: "",
        // Set Variation ID. 0 for original 1,2,3....
        variationId: "0",
        // Defers execution of google analytics script after page load
        defer: true,
        // Any additional optional fields
        sampleRate: 100,
        siteSpeedSampleRate: 10,
        cookieDomain: "vtuber-music.com",
      },
    },
    // {
    //   resolve: `gatsby-plugin-json-output`,
    //   options: {
    //     siteUrl: siteUrl, // defined on top of plugins
    //     graphQLQuery: `
    //     allVideoallVideo(sort: {order: DESC, fields: release_date}, skip: 24, limit: 240) {
    //         nodes {
    //             id
    //             release_date
    //             is_original_music
    //             custom_music_name
    //             thumbnail_image {
    //                 childImageSharp {
    //                     fluid(quality: 70, pngQuality: 70, maxWidth: 330) {
    //                         ...GatsbyImageSharpFluid
    //                     }
    //                 }
    //             }
    //             music {
    //                 id
    //                 title
    //             }
    //             singers {
    //                 id
    //                 name
    //                 profile_image {
    //                     childImageSharp {
    //                         fluid(quality: 70, pngQuality: 70, maxWidth: 160) {
    //                             ...GatsbyImageSharpFluid
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     `,
    //     serialize: results => {
    //       const arr = []
    //       for (let i = 1; i <= 10; i++) {
    //         const file = {
    //           path: ``,
    //           allVideo: {
    //             nodes: {}
    //           }
    //         }
    //         file.path = `all_video_order_by_release_date_${i}`
    //         file.allVideo = results.data.allVideo.nodes
    //           .slice((i - 1) * 24, i * 24)
    //         arr.push(file)
    //       }
    //       return arr
    //     },
        // feedMeta: {
        //   author: {
        //     name: author,
        //   },
        //   description: siteDescription,
        //   favicon: `${siteUrl}/icons/icon-48x48.png`,
        //   title: siteTitle,
        // },
        // serializeFeed: results => results.data.allMarkdownRemark.edges.map(({ node }) => ({
        //   id: node.fields.path,
        //   url: siteUrl + node.fields.path,
        //   title: node.frontmatter.title,
        //   date_published: new Date(node.frontmatter.created).toISOString(),
        //   date_modified: new Date(node.frontmatter.updated).toISOString(),
        //   excerpt: node.excerpt,
        // })),
        // feedFilename: "exampleFeedFilename",
        // nodesPerFeedFile: 100,
    // {
    //   resolve: 'gatsby-plugin-html2amp',
    //   options: {
    //     files: ['index.html'],
    //     publicPath: 'public',
    //     gaConfigPath: 'gaConfig.json',
    //     dist: 'public/amp',
    //     optimize: true,
    //     htmlPlugins: [],
    //     cssPlugins: []
    //   }
    // }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
