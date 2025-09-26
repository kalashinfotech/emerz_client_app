import '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { TError } from '@/types'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<TError>
  }
}
