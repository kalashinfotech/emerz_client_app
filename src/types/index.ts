export type TError = {
  statusCode: number
  timestamp: string
  path: string
  error: {
    message: string
    error: string
    statusCode: number
  }
}

export type IdRs = {
  id: number | string
}

export * from './auth'
export * from './client'
export * from './idea'
