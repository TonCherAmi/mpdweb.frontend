import * as R from 'ramda'

import Query from 'qs'
import { sprintf } from 'sprintf-js'

type HttpMethod = 'get' | 'post' | 'patch' | 'put' | 'delete'

const API_PREFIX = '/api'

const makePath = <T> (data: T, pathKeys: ReadonlyArray<string>) => (template: string): string => {
  const prefixedTemplate = `${API_PREFIX}${template}`

  if (R.isEmpty(pathKeys)) {
    return prefixedTemplate
  }

  const pathData = R.pick(pathKeys, data)

  if (R.isEmpty(pathData)) {
    throw Error('api: empty path data')
  }

  return sprintf(prefixedTemplate, pathData)
}

const addQuery = <T> (data: T, queryKeys: ReadonlyArray<string>) => (path: string): string => {
  if (R.isEmpty(queryKeys)) {
    return path
  }

  const queryData = R.pick(queryKeys, data)

  if (R.isEmpty(queryData)) {
    throw Error('api: empty query data')
  }

  const query = Query.stringify(queryData)

  return `${path}?${query}`
}

const makeEndpoint = <T> (
  template: string,
  data: T,
  pathKeys: ReadonlyArray<string>,
  queryKeys: ReadonlyArray<string>
): string => {
  const make = R.compose(
    addQuery(data, queryKeys),
    makePath(data, pathKeys)
  )

  return make(template)
}

export const make = <R, T = null> (
  template: string,
  method: HttpMethod = 'get', {
    path: pathKeys = [],
    query: queryKeys = [],
  }: { path?: Array<string>, query?: Array<string> } = {}
) => async (...data: [T] extends [null] ? [] : [T]): Promise<R> => {
  const getBody = R.pipe(
    R.ifElse(
      R.isNil,
      R.always(null),
      R.omit(R.concat(pathKeys, queryKeys))
    ),
    R.when(R.isEmpty, R.always(null)),
    R.unless(R.isNil, JSON.stringify),
  )

  const body = getBody(data[0])
  const endpoint = makeEndpoint(template, data[0], pathKeys, queryKeys)

  const result = await fetch(endpoint, {
    body,
    method,
    headers: new Headers([['Content-Type', 'application/json']]),
  })

  return result
    .json()
    .catch(R.always(null))
}
