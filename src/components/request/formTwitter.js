import React from 'react'

export default ({
    requestVideo,
    updateRequestVideo,
    upsertRequestVideo,
    setStep,
    steps,
    isFirst,
}) => {
    return (
        <div>
            <div className='flex items-center pb-5'>
                <span className='mr-2 text-xl'>@</span>
                <input
                    className='w-full px-3 py-1 bg-gray-50 border rounded'
                    value={requestVideo.contributor_twitter_id}
                    onChange={e => updateRequestVideo(v => {
                        v.contributor_twitter_id = e.target.value; return v
                    })}
                />
            </div>
            {requestVideo.contributor_twitter_id !== '' &&
                <div>
                    <button
                        className='mx-auto block px-4 py-2 bg-red-600 sm:hover:bg-red-500 text-white shadow rounded-full'
                        onClick={() => {
                            setStep(isFirst ? steps.ORIGINAL_MUSIC_ASK : steps.FIN)
                            upsertRequestVideo(requestVideo)
                        }}
                    >決定！</button>
                </div>
            }
        </div>
    )
}