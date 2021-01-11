import React from 'react'

export default ({
    steps,
    step,
    setStep,
    stepToStage,
}) => (
    <ul className='flex justify-around max-w-md mx-auto mb-7 pointer-events-none'>
        {Object.values(steps).map((s, i) => {
            return (
                <li
                    key={i}
                    className={`h-6 w-6 inline-block text-center leading-6 sm:hover:bg-red-50 text-xs border cursor-pointer rounded-full ${s === step ? 'bg-red-500 text-white shadow' : 'text-gray-500'}`}
                    onClick={() => setStep(s)}
                >{stepToStage(s) || ''}</li>
            )
        })}
    </ul>
)