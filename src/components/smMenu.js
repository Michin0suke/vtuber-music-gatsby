import React from "react"
import { Link } from "gatsby"
import ThumbsUp from './svg/thumbsUp'
import Fire from './svg/fire'
import Profile from './svg/profile2'
import Ellipsis from './svg/ellipsis'
import Home from './svg/home'
import Search from './svg/search'
import Plus from './svg/plus'

const Col = ({path, match, href, Img, imgStyle}) => (
    <li className='relative w-1/4 flex justify-center'>
            <div style={imgStyle}>
                <Img color={path?.split('/')[1] === match ? 'red' : '#555'} className='block h-full'/>
            </div>
            {/* <span className={`inline-block mx-auto text-xs ${path?.split('/')[1] === match ? 'text-red-500' : 'text-gray-700'}`}>{text}</span> */}
        
            <Link to={href} className='absolute top-0 right-0 bottom:0 left-0 h-full w-full'/>
    </li>
)

export default ({ path }) => (
    <nav className='fixed sm:hidden bottom-0 pt-1 left-0 w-full h-10 z-40 shadow-sm bg-white'>
      <ul className='flex max-w-screen-md mx-auto justify-center h-full px-3'>
        <Col path={path} match='' href='/' text='ホーム' Img={Home} imgStyle={{marginTop: 3, height: 24}}/>
        <Col path={path} match='videos' href='/videos' text='検索' Img={Search} imgStyle={{marginTop: 3, height: 24}}/>
        <Col path={path} match='artists' href='/artists' text='アーティスト' Img={Profile} imgStyle={{marginTop: 3, height: 24}}/>
        <Col path={path} match='request_add_video' href='/request_add_video' text='追加' Img={Plus} imgStyle={{marginTop: 3, height: 24}}/>
      </ul>
    </nav>
)
