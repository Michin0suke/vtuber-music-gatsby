import React from 'react'
import Layout from '../components/layout'
import Breadcrumb from '../components/breadcrumb'

export default () => {
    return (
        <Layout currentPage='/others'>
            <Breadcrumb type='others' className='mb-10'/>
            実装予定
        </Layout>
    )
}