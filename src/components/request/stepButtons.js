import React from 'react'

export default ({
    requestVideo,
    steps,
    step,
    setStep,
    stepToStage,
    stageToStep,
    className,
}) => (
    <ul className={`flex justify-around max-w-md mx-auto mb-7 ${className}`}>
        {Object.values(steps).map((s, i) => {
            return (
                <li
                    key={i}
                    className={`h-6 w-6 inline-block text-center leading-6 sm:hover:bg-red-50 text-xs border cursor-pointer rounded-full ${s === step ? 'bg-red-500 text-white shadow' : 'text-gray-500'}`}
                    onClick={() => {
                        if (s === steps.INIT) return
                        console.log(Object.values(steps).indexOf(s), Object.values(steps).indexOf(stageToStep(requestVideo.stage)))
                        if (requestVideo.stage === 5 || Object.values(steps).indexOf(s) <= Object.values(steps).indexOf(stageToStep(requestVideo.stage))) {
                            console.log(`setStep(${s})`)
                            setStep(s)
                        }
                    }}
                >{stepToStage(s) || ''}</li>
            )
        })}
    </ul>
)