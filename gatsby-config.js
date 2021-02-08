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
    ...require('./gatsby-config_json-output.js')(),
    // {
    //   resolve: `gatsby-plugin-json-output`,
    //   options: {
    //     siteUrl: siteUrl, // defined on top of plugins
    //     graphQLQuery: `
    //     {
    //       allSinger:allArtist(filter: {is_singer: {eq: true}}) {
    //         nodes {
    //             singer_videos {
    //                 id
    //                 singers {
    //                     id
    //                 }
    //             }
    //         }
    //       }
    //     }`,
    //     serialize: results => results.data.allSinger.nodes.map(_ => ({
    //       path: ``, // MUST contain a path
    //     })),
    //     feedFilename: `all_singer`,
    //   }
    // },
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
                      fluid {
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
                        fluid {
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
                      fluid {
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
                        fluid {
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
  ],
}
