import React from 'react'

import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type IconWrapperProps = {
  icon: LucideIcon
  size?: number
  iconClass?: string
  className?: string
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon: Icon,
  size = 24,
  iconClass = 'text-background',
  className = 'bg-primary',
}) => {
  const wrapperSize = size + 16

  return (
    <div
      className={cn('flex items-center justify-center rounded-full', className)}
      style={{
        width: wrapperSize,
        height: wrapperSize,
      }}>
      <Icon size={size} className={iconClass} />
    </div>
  )
}
