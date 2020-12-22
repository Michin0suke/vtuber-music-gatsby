module.exports = {
  siteMetadata: {
    title: `Vtuber Music`,
    description: `Vtuber Musicは、Vtuberの歌ってみた動画をまとめたサイトです。`,
    author: `@VtuberMusicCom`,
    siteUrl: `https://vtuber-music.com`,
  },
  plugins: [
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
    `gatsby-plugin-sitemap`,
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
