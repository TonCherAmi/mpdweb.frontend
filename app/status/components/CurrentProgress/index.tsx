import React from 'react'
import { observer } from 'mobx-react'

import * as R from "ramda"

import DurationPair from '@app/common/components/DurationPair'

import StatusStore from "@app/status/stores/StatusStore"

const CurrentProgress: React.FC = () => {
  const status = StatusStore.status

  if (R.isNil(status)) {
    return null
  }

  return (
    <DurationPair
      first={status.elapsed}
      second={status.duration}
    />
  )
}

export default observer(CurrentProgress)
