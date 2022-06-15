import useCacheContext from '@app/common/use/useCacheContext'

import * as R from 'ramda'

const useCache = <T> (id: string, defaultValue: T): T => {
  const cache = useCacheContext()

  const cached = cache.get(id)

  if (R.isNil(cached)) {
    cache.set(id, defaultValue)

    return defaultValue
  }

  return cached as T
}

export default useCache
