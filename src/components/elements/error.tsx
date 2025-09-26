import type { HTMLAttributes } from 'react'

import { AlertCircle } from 'lucide-react'

import { AlertTitle } from '@/components/ui/alert'

import { cn } from '@/lib/utils'

type ErrorProps = HTMLAttributes<HTMLDivElement> & {
  message?: string
}

export const Error: React.FC<ErrorProps> = ({ className, message, ...props }) => {
  return (
    <div className={cn('flex h-full w-full flex-col items-center justify-center gap-1 text-sm', className)} {...props}>
      <AlertCircle className="text-destructive h-8 w-8" />
      <AlertTitle className="w-full text-center leading-relaxed text-wrap whitespace-pre-line">
        {message ? message : <p>Something went wrong! Please contact support.</p>}
      </AlertTitle>
    </div>
  )
}
