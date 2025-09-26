import type { HTMLAttributes } from 'react'

import { Spinner } from '@/components/ui/spinner'

import { cn } from '@/lib/utils'

type LoadingComponentProps = HTMLAttributes<HTMLDivElement> & {}

const LoadingPage: React.FC<LoadingComponentProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-2', className)}
      {...props}
    >
      <Spinner className="bg-black" size="md" />
      <p className="text-sm">Please wait...</p>
    </div>
  )
}

export default LoadingPage
