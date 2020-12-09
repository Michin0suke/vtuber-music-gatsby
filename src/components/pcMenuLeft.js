import React from 'react'
import { Link } from 'gatsby'
import Fire from './svg/fire'
import Home from './svg/home'
import Profile from './svg/profile2'
import Ellipsis from './svg/ellipsis'
import ThumbsUp from './svg/thumbsUp'

const Row = ({ currentPage, href, text, Img, imgClassName }) => (
    <li className='hover:bg-gray-100 h-12'>
        <Link to={href} className='h-full py-3 flex items-center'>
            <div className='w-16'>
                <Img color={currentPage === href ? 'red' : '#333'} className={`mx-auto ${imgClassName}`}/>
            </div>
            <span className={currentPage === href ? 'text-red-500' : 'text-gray-800'}>{text}</span>
        </Link>
    </li>
)

export default ({ className, currentPage }) => (
    <div className={`relative hidden lg:block z-10 w-1/4 bg-white ${className}`} style={{minHeight: '100vh'}}>
        <ul className='mt-12'>
            <Row currentPage={currentPage} href='/' text='ホーム' Img={Home} imgClassName='w-6'/>
            <Row currentPage={currentPage} href='/recommends' text='おすすめ' Img={ThumbsUp} imgClassName='w-6'/>
            <Row currentPage={currentPage} href='/hots' text='人気' Img={Fire} imgClassName='w-5'/>
            <Row currentPage={currentPage} href='/artists' text='アーティスト' Img={Profile} imgClassName='w-4'/>
            <Row currentPage={currentPage} href='/others' text='その他' Img={Ellipsis} imgClassName='w-6'/>
        </ul>
    </div>
)