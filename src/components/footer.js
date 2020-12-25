import React from 'react'

export default () => (
    <footer className='absolute bottom-0 pb-16 sm:pb-3 pt-3 w-full bg-gray-100'>
        <div className='max-w-screen-md mx-auto'>
            <small className='inline-block w-full text-sm text-center'>© {new Date().getFullYear()} vtuber-music.com</small>
        </div>
    </footer>
)