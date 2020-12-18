import React from "react"
import { Link } from "gatsby"
import ThumbsUp from './svg/thumbsUp'
import Fire from './svg/fire'
import Profile from './svg/profile2'
import Ellipsis from './svg/ellipsis'
import Home from './svg/home'
import Search from './svg/search'

const Col = ({currentPage, href, text, Img, imgClassName}) => (
    <li className='w-1/5'>
        <Link to={href} className='h-full flex flex-col justify-between items-center'>
            <Img color={currentPage === href ? 'red' : '#555'} className={imgClassName}/>
            <span className={`inline-block mx-auto text-xs ${currentPage === href ? 'text-red-500' : 'text-gray-700'}`}>{text}</span>
        </Link>
    </li>
)

export default ({ currentPage }) => (
  <div className='sm:hidden shadow'>
    <nav className='fixed bottom-0 pt-1 left-0 w-full h-12 z-50 shadow-sm bg-white'>
      <ul className='flex max-w-screen-md mx-auto h-full'>
        <Col currentPage={currentPage} href='/' text='ホーム' Img={Home} imgClassName='block mt-0.5 h-6 mx-auto'/>
        <Col currentPage={currentPage} href='/recommends' text='おすすめ' Img={ThumbsUp} imgClassName='block mt-0.5 h-5 mx-auto'/>
        {/* <Col currentPage={currentPage} href='/hots' text='人気' Img={Fire} imgClassName='block h-6 mx-auto'/> */}
        <Col currentPage={currentPage} href='/videos' text='検索' Img={Search} imgClassName='block h-6 mx-auto'/>
        <Col currentPage={currentPage} href='/artists' text='アーティスト' Img={Profile} imgClassName='block mt-0.5 h-6 mx-auto'/>
        <Col currentPage={currentPage} href='/others' text='その他' Img={Ellipsis} imgClassName='block w-8 py-2.5 mx-auto vertical-middle'/>
      </ul>
    </nav>
  </div>
)
