import React from 'react'
import { Link } from 'gatsby'
import Fire from './svg/fire'
import Home from './svg/home'
import Profile from './svg/profile2'
import Ellipsis from './svg/ellipsis'
import ThumbsUp from './svg/thumbsUp'
import Search from './svg/search'

const Row = ({ currentPage, href, text, Img, imgClassName }) => (
    <li className='sm:hover:bg-gray-100 h-10'>
        <Link to={href} className='h-full py-3 flex items-center'>
            <div className='w-12'>
                <Img color={currentPage === href ? 'red' : '#333'} className={`mx-auto ${imgClassName}`}/>
            </div>
            <span className={`text-sm ${currentPage === href ? 'text-red-500' : 'text-gray-800'}`}>{text}</span>
        </Link>
    </li>
)

export default ({ currentPage }) => (
    <nav className={`hidden sm:block w-48 bg-white`} style={{minHeight: '100vh'}}>
        <ul className='fixed mt-10 w-48'>
            <Row currentPage={currentPage} href='/' text='ホーム' Img={Home} imgClassName='w-5'/>
            {/* <Row currentPage={currentPage} href='/recommends' text='おすすめ' Img={ThumbsUp} imgClassName='w-5'/> */}
            {/* <Row currentPage={currentPage} href='/hots' text='人気' Img={Fire} imgClassName='w-4'/> */}
            <Row currentPage={currentPage} href='/artists' text='アーティスト' Img={Profile} imgClassName='w-3'/>
            <Row currentPage={currentPage} href='/videos' text='検索' Img={Search} imgClassName='w-5'/>
            {/* <Row currentPage={currentPage} href='/others' text='その他' Img={Ellipsis} imgClassName='w-5'/> */}
        </ul>
    </nav>
)