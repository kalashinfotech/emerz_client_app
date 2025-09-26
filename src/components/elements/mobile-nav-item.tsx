import { Link } from '@tanstack/react-router'
import type { LinkComponentProps } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

const MobileNavItem = ({ className, children, ...props }: LinkComponentProps) => {
  return (
    <Link
      className={cn(
        'text-primary group flex flex-wrap items-center gap-2 gap-y-0 px-4 py-2 text-2xl font-medium tracking-wider uppercase',
        'transition-all duration-100',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export default MobileNavItem
