import React, { memo, forwardRef } from 'react'

import cx from 'classnames'

import Handler from '@app/common/types/Handler'
import DatabaseFile from '@app/database/data/DatabaseFile'

import Duration from '@app/common/components/Duration'
import DatabaseCoverArt from '@app/database/components/DatabaseCoverArt'

import { getOrPlaceholder } from '@app/common/utils/format'
import { formatDatabaseTags } from '@app/database/utils/format'

import usePlaylistFileContextMenu from './use/usePlaylistFileContextMenu'

import styles from './styles.scss'

interface Props {
  isFocused: boolean
  file: DatabaseFile
  position: number
  onClick: Handler<DatabaseFile>
  onRemoveClick: Handler<number>
}

const PlaylistFile = memo(
  forwardRef<HTMLDivElement, Props>(({
    isFocused,
    file,
    position,
    onClick,
    onRemoveClick,
  }, ref) => {
    const handleClick = () => {
      onClick(file)
    }

    const { handleContextMenu } = usePlaylistFileContextMenu({
      file,
      position,
      onRemoveClick,
    })

    const tags = formatDatabaseTags(file.tags)

    return (
      <div
        ref={ref}
        className={cx(styles.container, { [styles.focused]: isFocused })}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <DatabaseCoverArt
          className={styles.cover}
          fallbackIconClassName={styles.icon}
          uri={file.uri}
        />
        <div className={styles.tags}>
          <div className={cx(styles.tag, styles.title)}>
          <span title={getOrPlaceholder(tags.title)}>
            {getOrPlaceholder(tags.title)}
          </span>
          </div>
          <div className={cx(styles.tag, styles.artist)}>
          <span title={getOrPlaceholder(tags.artist)}>
            {getOrPlaceholder(tags.artist)}
          </span>
          </div>
          <div className={cx(styles.tag, styles.album)}>
          <span title={getOrPlaceholder(tags.album)}>
            {getOrPlaceholder(tags.album)}
          </span>
          </div>
        </div>
        <Duration className={styles.duration} value={file.duration} />
      </div>
    )
  })
)

export default PlaylistFile
