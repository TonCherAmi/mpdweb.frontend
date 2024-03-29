import * as R from 'ramda'

import SimpleDuration from '@app/common/data/SimpleDuration'

import { getPluralSuffix } from '@app/common/utils/format'

const propToString = (name: string) => R.pipe(
  R.prop(name),
  R.toString
)

const padDurationValue = (value: string): string => {
  return value.padStart(2, '0')
}

const formatHours: (duration: SimpleDuration) => string = R.ifElse(
  R.propEq('hours', 0),
  R.always(''),
  propToString('hours')
)

const formatMinutes: (duration: SimpleDuration) => string = R.pipe(
  R.ifElse(
    R.propEq('hours', 0),
    propToString('minutes'),
    R.pipe(propToString('minutes'), padDurationValue)
  ),
)

const formatSeconds: (duration: SimpleDuration) => string = R.pipe(
  R.prop('seconds'),
  R.toString,
  padDurationValue
)

export const formatDurationColon = (duration: SimpleDuration): string => {
  const format = R.pipe(
    R.map(R.applyTo(duration)),
    R.reject(R.isEmpty),
    R.join(':')
  )

  return format([formatHours, formatMinutes, formatSeconds])
}

export const formatDurationDescriptive = (duration: SimpleDuration): string => {
  if (duration.hours === 0 && duration.minutes === 0) {
    return `${duration.seconds} second${getPluralSuffix(duration.seconds)}`
  }

  const hoursText = duration.hours === 0
    ? ''
    : `${duration.hours} hour${getPluralSuffix(duration.hours)}`

  const minutesText = duration.minutes === 0
    ? ''
    : `${duration.minutes} minute${getPluralSuffix(duration.minutes)}`

  return `${hoursText} ${minutesText}`.trim()
}
