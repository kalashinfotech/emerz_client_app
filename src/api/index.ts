import { queryOptions } from '@tanstack/react-query'
import type { QueryKey } from '@tanstack/react-query'

import { axiosPrivate } from './axios'

type FetchQueryOptions = {
  queryKey?: QueryKey
  enabled?: boolean
  params?: Record<string, any>
}

export const fetchQuery = <T>(endpoint: string, opts: FetchQueryOptions) => {
  const { queryKey = [endpoint, opts.params ?? {}], enabled = true, params = {} } = opts
  return queryOptions({
    queryKey,
    queryFn: async (): Promise<T> => {
      const response = await axiosPrivate.get(endpoint, { params })
      return response.data
    },
    enabled,
  })
}
