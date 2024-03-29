import { useMemo, useState, useEffect, useCallback } from 'react'

import * as R from 'ramda'

import Fuse from 'fuse.js'

import useInput, { Input } from '@app/common/use/useInput'

import { normalize } from '@app/common/utils/string'

interface ItemSearch<T> {
  input: Input
  results: ReadonlyArray<T>
}

const useItemSearch = <T,>(
  items: ReadonlyArray<T>,
  accessor: (item: T) => string
): ItemSearch<T> => {
  const fuse = useMemo(() => {
    const getFn = R.pipe(accessor, normalize)

    return new Fuse(items, { getFn, keys: [''] })
  }, [items, accessor])

  const [results, setResults] = useState(items)

  const input = useInput('')

  const search = useCallback(() => {
    if (R.isEmpty(input.value)) {
      setResults(items)

      return
    }

    setResults(
      fuse.search(input.value).map(
        R.prop('item')
      )
    )
  }, [items, fuse, input.value])

  useEffect(() => {
    search()
  }, [items, search])

  return { input, results }
}

export default useItemSearch
