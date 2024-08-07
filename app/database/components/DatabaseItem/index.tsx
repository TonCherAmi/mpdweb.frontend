import React, { memo, forwardRef } from 'react'

import cx from 'classnames'

import * as R from 'ramda'

import Thunk from '@app/common/types/Thunk'
import Handler from '@app/common/types/Handler'

import DatabaseItemData from '@app/database/data/DatabaseItem'
import DatabaseItemLabel from '@app/labels/data/api/DatabaseItemLabel'

import * as Icons from '@app/common/icons'

import Button from '@app/common/components/Button'
import DatabaseItemIcon from '@app/database/components/DatabaseItemIcon'

import { basename } from '@app/common/utils/path'
import { withPropagationStopped } from '@app/common/utils/event'

import useDatabaseItemContextMenu from './use/useDatabaseItemContextMenu'

import styles from './styles.scss'

export type HighlightStyle = 'muted' | 'primary' | 'secondary'

interface Props {
  item: DatabaseItemData
  favoriteLabel?: Nullable<DatabaseItemLabel>
  highlightStyle: Nullable<HighlightStyle>
  onClick?: Handler<DatabaseItemData>
  onFavoriteClick: Handler<string>
  onUnfavoriteClick: Handler<string>
}

const DatabaseItem = memo(
  forwardRef<HTMLDivElement, Props>(({
    item,
    favoriteLabel,
    highlightStyle,
    onClick,
    onFavoriteClick,
    onUnfavoriteClick,
  }, ref) => {
    const withItem = (fn: Nullable<Handler<DatabaseItemData>>): Thunk => {
      return () => {
        fn?.(item)
      }
    }

    const isClickable = item.type === 'directory'

    const handleClick = withItem(
      !isClickable ? null : onClick
    )

    const containerClassName = cx(styles.container, {
      [styles.clickable]: isClickable,
    })

    const highlightStyleClassName = cx({
      [styles.highlighted]: !R.isNil(highlightStyle),
      [styles.muted]: highlightStyle === 'muted',
      [styles.primary]: highlightStyle === 'primary',
      [styles.secondary]: highlightStyle === 'secondary',
    })

    const name = basename(item.uri)

    const { handleContextMenu } = useDatabaseItemContextMenu(item)

    const handleFavoriteClick = withPropagationStopped(() => {
      if (!R.isNil(favoriteLabel)) {
        onUnfavoriteClick(favoriteLabel.id)

        return
      }

      onFavoriteClick(item.uri)
    })

    const FavoriteIcon = favoriteLabel ? Icons.HeartFill : Icons.Heart

    return (
      <div
        ref={ref}
        className={cx(containerClassName, highlightStyleClassName)}
        role="button"
        tabIndex={-1}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <DatabaseItemIcon
          className={cx(styles.icon, styles.type)}
          type={item.type}
        />
        <span className={styles.name} title={name}>
          {name}
        </span>
        <div className={styles.controls}>
          <Button className={styles.button} onClick={handleFavoriteClick}>
            <FavoriteIcon className={cx(styles.icon, styles.favorite, { [styles.is]: !R.isNil(favoriteLabel) })} />
          </Button>
        </div>
      </div>
    )
  }))

export default DatabaseItem
