import React from 'react'

export default () => (
    <footer className='pb-16 md:pb-3 pt-3 absolute bottom-0 w-full bg-gray-100'>
        <div className='max-w-screen-md mx-auto'>
            <span className='inline-block w-full text-sm text-center'>© {new Date().getFullYear()} vtuber-music.com</span>
        </div>
    </footer>
)