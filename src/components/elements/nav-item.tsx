import { Link } from '@tanstack/react-router'
import type { LinkComponentProps } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

const NavItem = ({ className, children, ...props }: LinkComponentProps) => {
  return (
    <Link
      className={cn(
        'text-primary hover:text-primary-300 group group flex h-full cursor-pointer items-center gap-1 rounded-none px-4 text-sm font-medium',
        'relative transition-all duration-200',
        { 'text-primary-200 pointer-events-none': props.disabled },
        className,
      )}
      activeProps={{ className: 'text-primary-300 pointer-events-none ' }}
      activeOptions={{ includeHash: true }}
      hashScrollIntoView={{ behavior: 'smooth' }}
      {...props}
    >
      <>{children}</>
    </Link>
  )
}
export default NavItem
