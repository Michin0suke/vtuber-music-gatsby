import React from "react"
import { Link } from "gatsby"
import ThumbsUp from './svg/thumbsUp'
import Fire from './svg/fire'
import Profile from './svg/profile2'
import Ellipsis from './svg/ellipsis'
import Home from './svg/home'
import Search from './svg/search'
import Plus from './svg/plus'

const Col = ({currentPage, href, text, Img, imgClassName}) => (
    <li className='w-1/3'>
        <Link to={href} className='h-full flex flex-col justify-between items-center'>
            <Img color={currentPage === href ? 'red' : '#555'} className={imgClassName}/>
            <span className={`inline-block mx-auto text-xs ${currentPage === href ? 'text-red-500' : 'text-gray-700'}`}>{text}</span>
        </Link>
    </li>
)

export default ({ currentPage }) => (
    <nav className='fixed sm:hidden bottom-0 pt-1 left-0 w-full h-12 z-50 shadow-sm bg-white'>
      <ul className='flex max-w-screen-md mx-auto h-full'>
        <Col currentPage={currentPage} href='/' text='ホーム' Img={Home} imgClassName='block mt-0.5 h-6 mx-auto'/>
        {/* <Col currentPage={currentPage} href='/recommends' text='おすすめ' Img={ThumbsUp} imgClassName='block mt-0.5 h-5 mx-auto'/> */}
        {/* <Col currentPage={currentPage} href='/hots' text='人気' Img={Fire} imgClassName='block h-6 mx-auto'/> */}
        <Col currentPage={currentPage} href='/videos' text='検索' Img={Search} imgClassName='block h-6 mx-auto'/>
        <li className='w-1/3'>
            <a href='/request_add_video' className='h-full flex flex-col justify-between items-center'>
                <Plus color={currentPage === '/request_add_video' ? 'red' : '#555'} className='block mt-0.5 h-6 mx-auto'/>
                <span className={`inline-block mx-auto text-xs ${currentPage === '/request_add_video' ? 'text-red-500' : 'text-gray-700'}`}>追加</span>
            </a>
        </li>
        {/* <Col currentPage={currentPage} href='/request_add_video' text='追加' Img={Plus} imgClassName='block mt-0.5 h-6 mx-auto'/> */}
        <Col currentPage={currentPage} href='/artists' text='アーティスト' Img={Profile} imgClassName='block mt-0.5 h-6 mx-auto'/>
        {/* <Col currentPage={currentPage} href='/others' text='その他' Img={Ellipsis} imgClassName='block w-8 py-2.5 mx-auto vertical-middle'/> */}
      </ul>
    </nav>
)
