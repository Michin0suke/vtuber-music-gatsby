/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title, url, imgUrl, isTop, isLargeCard}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={isTop ? defaultTitle : title}
      titleTemplate={isTop ? null : `%s | ${defaultTitle}`}
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
          content: imgUrl || ''
        },
        {
          name: `twitter:card`,
          content: isLargeCard ? `summary_large_image` : `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.author || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}

      link={[
        { rel: 'canonical', href: url || `https://vtuber-music.com/` }
      ]}
    >
      <script data-ad-client="ca-pub-5595803406159604" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `ja`,
  meta: [],
  title: `Vtuber Music`,
  description: `Vtuberの歌ってみた動画をまとめたサイトです。`,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
