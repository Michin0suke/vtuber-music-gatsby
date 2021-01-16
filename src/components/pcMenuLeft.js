import React from 'react'
import { Link } from 'gatsby'
import Fire from './svg/fire'
import Home from './svg/home'
import Profile from './svg/profile2'
import Ellipsis from './svg/ellipsis'
import ThumbsUp from './svg/thumbsUp'
import Search from './svg/search'
import Plus from './svg/plus'

const Row = ({ path, match, href, text, Img, imgClassName }) => (
    <li className='sm:hover:bg-gray-100 h-10'>
        <Link to={href} className='h-full py-3 flex items-center'>
            <div className='w-12'>
                <Img color={path.split('/')[1] === match ? 'red' : '#333'} className={`mx-auto ${imgClassName}`}/>
            </div>
            <span className={`text-sm ${path.split('/')[1] === match ? 'text-red-500' : 'text-gray-800'}`}>{text}</span>
        </Link>
    </li>
)

export default ({ path }) => (
    <nav className={`hidden sm:block w-44 bg-white`} style={{minHeight: '100vh'}}>
        <ul className='fixed mt-10 w-44'>
            <Row path={path} match='' href='/' text='ホーム' Img={Home} imgClassName='w-5'/>
            {/* <Row path={path} href='/recommends' text='おすすめ' Img={ThumbsUp} imgClassName='w-5'/> */}
            {/* <Row path={path} href='/hots' text='人気' Img={Fire} imgClassName='w-4'/> */}
            <Row path={path} match='artists' href='/artists' text='アーティスト' Img={Profile} imgClassName='w-3'/>
            <Row path={path} match='videos' href='/videos' text='検索' Img={Search} imgClassName='w-5'/>
            <Row path={path} match='request_add_video' href='/request_add_video' text='動画の追加' Img={Plus} imgClassName='w-5'/>
            {/* <Row path={path} href='/request_add_video' text='動画の追加' Img={Plus} imgClassName='w-5'/> */}
            {/* <Row path={path} href='/others' text='その他' Img={Ellipsis} imgClassName='w-5'/> */}
        </ul>
    </nav>
)