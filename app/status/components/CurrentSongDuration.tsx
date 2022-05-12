import React from 'react'

import * as R from 'ramda'

import Duration from '@app/common/components/Duration'

import useStatusContext from '@app/status/use/useStatusContext'

const CurrentSongDuration = ({ className }: { className?: string }) => {
  const status = useStatusContext()

  if (R.isNil(status)) {
    return null
  }

  return (
    <Duration className={className} value={status.song?.duration} />
  )
}

export default CurrentSongDuration