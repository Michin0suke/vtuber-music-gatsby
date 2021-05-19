import React from 'react'
import { Link } from 'gatsby'

export default ({ path }) => (
    <div className='max-w-lg mx-auto py-2 pb-5 px-5'>
        <ul className='flex justify-around w-full'>
            <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${path === '/' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                <Link to='/' className='block w-full h-full'>アップロード日順</Link>
            </li>
            <li className={`mx-3 text-sm leading-6 text-center w-full rounded-full shadow ${path === '/sort/created_at' ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}>
                <Link to='/sort/created_at' className='block w-full h-full'>追加日順</Link>
            </li>
        </ul>
    </div>
)
