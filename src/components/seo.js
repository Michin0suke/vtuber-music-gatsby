import React from "react"
import { Helmet } from "react-helmet"

function SEO({ description, lang, meta, title, url, imgUrl, isTop, isLargeCard}) {
  const metaTitle = isTop ? `Vtuber Music | バーチャルYouTuberの歌ってみた動画まとめ` : `${title} | Vtuber Music`
  const metaDescription = isTop ? `Vtuberの歌ってみた動画をまとめたサイトです。` : description

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
          content: title,
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
          content: imgUrl || '',
        },
        {
          name: `twitter:card`,
          content: isLargeCard ? `summary_large_image` : `summary`,
        },
        {
          name: `twitter:creator`,
          content: `@VtuberMusicCom` || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]}
    >
      <script data-ad-client="ca-pub-5595803406159604" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </Helmet>
  )
}

export default SEO
