import React from 'react'
import { Link } from 'gatsby'
import Home from '../components/svg/home'

const typeList = {
    video: {
        url: 'videos',
        text: '動画'
    },
    music: {
        url: 'music_list',
        text: '楽曲'
    },
    artist: {
        url: 'artists',
        text: 'アーティスト'
    },
    others: {
        text: 'その他',
    },
    hots: {
        text: '人気',
    },
    recommends: {
        text: 'おすすめ'
    }
}

export default ({ type, text, subText, className }) => {
    const list = []

    if (type === 'index') {
        // HOME
        return (
            <nav className={`ml-1 ${className}`}>
                <ul className='flex items-center text-gray-600 overflow-hidden'>
                    <li className='flex-shrink-0'>
                        <div className='p-1 rounded-full'>
                            <Home color='#777' className='w-4 h-4 mb-0.5'/>
                        </div>
                    </li>
                </ul>
            </nav>
        )
    } else {
        // HOME > ARTIST OR HOME > ARTIST > EMA
        list.push(
            <li className='flex-shrink-0' key={0}>
                <Link to='/'>
                    <div className='p-1 sm:hover:bg-gray-200 rounded-full'>
                        <Home color='#777' className='w-4 h-4 mb-0.5'/>
                    </div>
                </Link>
            </li>
        )
    }

    if (text) {
        // HOME > ARTIST > EMA
        list.push(
            <li className='flex-shrink-0' key={1}>
                <span className='p-0.5 pointer-events-none'>{`>`}</span>
                <span className={`p-0.5 rounded ${text && 'sm:hover:bg-gray-200 sm:hover:text-black'}`}>
                    <Link to={`/${typeList[type].url}`}>{typeList[type].text}</Link>
                </span>
            </li>
        )
        list.push(
            <li className='flex-shrink-0 whitespace-nowrap flex' key={2}>
                <span className='p-0.5 pointer-events-none'>{`>`}</span>
                <span className='p-0.5 text-gray-800'>{text}</span>
                {subText && <span className='p-0.5'>({subText})</span>}
            </li>
        )
    } else {
        // HOME > ARTIST
        list.push(
            <li className='flex-shrink-0' key={1}>
                <span className='p-0.5 pointer-events-none'>{`>`}</span>
                <span className={`p-0.5 rounded ${text && 'sm:hover:bg-gray-200 sm:hover:text-black'}`}>
                    <span>{typeList[type].text}</span>
                </span>
            </li>
        )
    }

    return (
        // HOME > VIDEO > CULT (EMA)
        <nav className={`ml-0.5 text-xs ${className}`}>
            <ul className='flex items-center text-gray-600 overflow-hidden'>
                {list}
            </ul>
        </nav>
    )
}