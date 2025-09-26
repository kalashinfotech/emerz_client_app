import type { HTMLAttributes } from 'react'

import { Spinner } from '@/components/ui/spinner'

import { cn } from '@/lib/utils'

type LoaderProps = HTMLAttributes<HTMLDivElement> & {}

export const Loader: React.FC<LoaderProps> = ({ className, ...props }) => {
  return (
    <div className={cn('flex h-full w-full flex-col items-center justify-center gap-2', className)} {...props}>
      <Spinner className="bg-black" size="md" />
      <p className="text-xs">Please wait...</p>
    </div>
  )
}
