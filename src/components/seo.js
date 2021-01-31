import React from "react"
import { Helmet } from "react-helmet"
import { graphql, useStaticQuery } from 'gatsby'

function SEO({ description, lang, title, url, imgUrl, isTop, isLargeCard, isFollow }) {
  const metaTitle = isTop ? `Vtuber Music | バーチャルYouTuberの歌ってみた動画まとめ` : `${title} | Vtuber Music`
  const metaDescription = isTop ? `Vtuberの歌ってみた動画をまとめたサイトです。` : description

  const { vtuberMusicIcon } = useStaticQuery(
    graphql`
      query {
        vtuberMusicIcon:file(base: {eq: "vtuber-music-icon-for-ogp.png"}) {
          childImageSharp {
              fixed(width: 300) {
                  src
              }
          }
        }
      }
    `)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: url || `https://vtuber-music.com/`,
        },
        {
          property: `og:image`,
          content: imgUrl || `https://vtuber-music.com${vtuberMusicIcon.childImageSharp.fixed.src}`,
        },
        {
          name: `twitter:card`,
          content: isLargeCard ? `summary_large_image` : `summary`,
        },
        {
          name: `twitter:creator`,
          content: `@VtuberMusicCom`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        isFollow ? {} : {
          name: `robots`,
          content: `noindex`
        }
      ]}
    >
      {/* <script data-ad-client="ca-pub-5595803406159604" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
    </Helmet>
  )
}

export default SEO
