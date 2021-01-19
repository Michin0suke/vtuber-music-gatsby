import React from "react"

import SEO from "../components/seo"

const NotFoundPage = () => (
  <div>
    <SEO title="404: Not found" />
    <h1>404: Not Found</h1>
    <p>ページが見つかりません😭</p>
    <div>
        <p>問題が発生している場合はTwitterで教えてください！</p>
        <p>👉<a href='https://twitter.com/vtubermusiccom' className='border-b-2'>Vtuber MusicのTwitterアカウント</a>👈</p>
    </div>
  </div>
)

export default NotFoundPage
