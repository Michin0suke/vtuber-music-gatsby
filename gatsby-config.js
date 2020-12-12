module.exports = {
  siteMetadata: {
    title: `Vtuber Music`,
    description: `Vtuber Musicは、Vtuberの歌ってみた動画をまとめたサイトです。`,
    author: `@VtuberMusicCom`,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    // { 
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: {
    //     printRejected: true, // Print removed selectors and processed file names
    //     develop: true, // Enable while using `gatsby develop`
    //     tailwind: true, // Enable tailwindcss support
    //     // whitelist: ['.youtubeContainer iframe'], // Don't remove this selector
    //     // ignore: ['src/'], // Ignore files/folders
    //     purgeOnly : ['node_modules/tailwindcss/'], // Purge only these files/folders
    //   }
    // },
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
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "G-1FXR3XGN8L",
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
