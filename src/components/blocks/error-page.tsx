import type { FC } from 'react'

import { useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import { LucideChevronLeft, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export interface ErrorPageProps {
  error: unknown
  resetErrorBoundary?: (...args: any[]) => void
}

export const ErrorPage: FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const router = useRouter()
  const fallbackMessage = 'Something went wrong. Please try again later.'

  let httpCode: number | undefined
  let rawMessage: string | undefined

  if (error instanceof AxiosError) {
    httpCode = error.response?.status
    rawMessage = error.response?.data?.error?.message ?? error.message
  } else if (error instanceof Error) {
    rawMessage = error.message
  }

  let title = 'Error'
  let description = rawMessage || fallbackMessage

  switch (httpCode) {
    case 400:
      title = 'Bad Request'
      break
    case 401:
      title = 'Unauthorized'
      description = `You are not authorized to view this page. Please log in with appropriate credentials to continue (${rawMessage})`
      break
    case 403:
      title = 'Forbidden'
      description = `Access to this page is restricted. If you believe this is a mistake, please contact your administrator (${rawMessage})`
      break
    case 404:
      title = 'Resource Not Found'
      break
    default:
      if (httpCode) {
        title = `${httpCode} Error`
      }
      break
  }

  const handleGoBack = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary()
    }
    router.history.back()
  }

  return (
    <motion.div
      className={cn('flex min-h-[80vh] flex-col items-center justify-center px-4 text-center')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-2">
        <div className="bg-destructive flex h-12 w-12 items-center justify-center rounded-full">
          <TriangleAlert size={30} className="text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl">{httpCode || 'Error'}</h1>
        <h2 className="font-medium">{title}</h2>
        <p className="text-muted-foreground mb-8 text-sm">{description}</p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button onClick={handleGoBack} className="min-w-[140px]">
            <LucideChevronLeft />
            Go Back
          </Button>
          <Button onClick={() => (window.location.href = '/')} className="min-w-[140px]">
            Go Home
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
