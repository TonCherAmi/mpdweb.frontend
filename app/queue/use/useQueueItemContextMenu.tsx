import React from 'react'

import QueueItem from '@app/queue/data/QueueItem'

import ContextMenu from '@app/common/components/ContextMenu'

import useContextMenu from '@app/ui/use/useContextMenu'
import useQueueActions from '@app/queue/use/useQueueActions'
import useDatabaseViewNavigation from '@app/database/views/DatabaseView/use/useDatabaseViewNavigation'

import { dirname } from '@app/common/utils/path'
import useDatabaseItemContextMenuItems from '@app/database/components/DatabaseItem/use/useDatabaseItemContextMenuItems'

const useQueueItemContextMenu = (item: QueueItem) => {
  const { goTo } = useDatabaseViewNavigation()

  const { remove } = useQueueActions()

  const databaseItemContextMenuItems = useDatabaseItemContextMenuItems(item)

  return useContextMenu((onClose) => {
    const items = [
      ...databaseItemContextMenuItems,
      {
        id: 'remove',
        text: 'Remove',
        handler: () => remove(item),
      },
      {
        id: 'open-in-files',
        text: 'Open in Files',
        handler: () => {
          goTo(dirname(item.uri))
        },
      },
    ]

    return (
      <ContextMenu
        items={items}
        onClose={onClose}
      />
    )
  })
}

export default useQueueItemContextMenu
