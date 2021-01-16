import React from 'react'
import { navigate } from 'gatsby'

export default ({ path }) => (
    <div className='max-w-lg mx-auto py-2 pb-5 px-5'>
        <ul className='flex justify-around w-full border bg-white text-gray-700 rounded cursor-pointer'>
            <li className='w-1/2 border-r'>
                <button
                    className={`inline-block w-full focus:outline-none text-center ${path === '/' && 'bg-gray-100'}`}
                    onClick={() => navigate('/')}
                >
                    アップロード日順
                </button>
            </li>
            <li className='w-1/2'>
                <button
                    className={`inline-block w-full focus:outline-none text-center ${path === '/sort/created_at' && 'bg-gray-100'}`}
                    onClick={() => navigate('/sort/created_at')}
                >
                    追加日順
                </button>
            </li>
        </ul>
    </div>
)