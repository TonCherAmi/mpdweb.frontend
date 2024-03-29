import { make } from '@app/common/api'

import DatabaseItem from '@app/database/data/DatabaseItem'
import DatabaseFile from '@app/database/data/DatabaseFile'
import DatabaseCount from '@app/database/data/DatabaseCount'

import DatabaseGetBody from '@app/database/data/api/request/DatabaseGetBody'
import DatabaseCountBody from '@app/database/data/api/request/DatabaseCountBody'
import DatabaseSearchBody from '@app/database/data/api/request/DatabaseSearchBody'

const Api = {
  get: make<ReadonlyArray<DatabaseItem>, DatabaseGetBody>('/database', 'get', {
    query: ['uri'],
  }),
  count: make<DatabaseCount, DatabaseCountBody>('/database/count', 'get', {
    query: ['uri'],
  }),
  search: make<ReadonlyArray<DatabaseItem>, DatabaseSearchBody>('/database', 'get', {
    query: ['query'],
  }),
  recents: make<ReadonlyArray<DatabaseFile>>('/database/recents'),
}

export default Api
