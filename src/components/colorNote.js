import React from 'react'
import Please from 'pleasejs'
import Note from './svg/note'

export default ({ className }) => <Note color={Please.make_color({format: 'rgb-string'})} className={className}/>