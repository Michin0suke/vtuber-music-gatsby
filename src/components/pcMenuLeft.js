import React from 'react'
import { Link } from 'gatsby'
import Home from './svg/home'
import Profile from './svg/profile2'
import Search from './svg/search'
import Plus from './svg/plus'
import Clover from './svg/clover'

const Row = ({ path, match, href, text, Img, imgClassName }) => (
    <li className='sm:hover:bg-gray-100 h-10'>
        <Link to={href} className='h-full py-3 flex items-center'>
            <div className='w-12'>
                <Img color={path?.split('/')[1] === match ? 'red' : '#333'} className={`mx-auto ${imgClassName}`}/>
            </div>
            <span className={`text-sm ${path?.split('/')[1] === match ? 'text-red-500' : 'text-gray-800'}`}>{text}</span>
        </Link>
    </li>
)

export default ({ path }) => (
    <nav style={{minHeight: '100vh'}}>
        <div  className='hidden sm:block w-40 h-full'/>
        <ul className='hidden sm:block fixed left-0 top-20 w-40 h-full bg-white'>
            <Row path={path} match='' href='/' text='ホーム' Img={Home} imgClassName='w-5'/>
            <Row path={path} match='artists' href='/artists' text='アーティスト' Img={Profile} imgClassName='w-3'/>
            <Row path={path} match='serendipity' href='/serendipity' text='出会う' Img={Clover} imgClassName='w-5'/>
            <Row path={path} match='videos' href='/videos' text='検索' Img={Search} imgClassName='w-5'/>
            <Row path={path} match='request_add_video' href='/request_add_video' text='動画の追加' Img={Plus} imgClassName='w-5'/>
        </ul>
    </nav>
)