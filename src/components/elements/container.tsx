import React from 'react'
import type { JSX } from 'react'

import type { LucideIcon } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'

import { cn } from '@/lib/utils'

// import BreadcrumbsHeader from './breadcrumbs-header';

interface MainProps extends React.HTMLAttributes<React.ComponentRef<'main'>> {
  title: string
  subtitle?: string
  fixed?: boolean
  description?: string
  ActionComponent?: JSX.Element
  Icon?: LucideIcon
}

export const Container = React.forwardRef<React.ComponentRef<'main'>, MainProps>(
  ({ resource, children, className, title, subtitle, description, ActionComponent, Icon, ...props }, ref) => {
    const { authInitialized, sessionInfo } = useAuth()
    // TODO: Change this to take resources as props which can be ResourceType | ResourceType[]
    if (!authInitialized && !sessionInfo) return <div>Loading...</div>
    let IconComponent = null

    if (Icon) {
      IconComponent = Icon
    }
    return (
      <main ref={ref} className={cn('mx-auto w-fit', className)} {...props}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {IconComponent && (
                <div className="border-primary border-r py-1 pr-2">
                  <IconComponent className="text-primary h-5 w-5" />
                </div>
              )}
              <h2 className="text-2xl font-medium">
                {title}
                {subtitle && <span className="text-muted-foreground text-xs uppercase"> / {subtitle}</span>}
              </h2>
            </div>
            {description && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
          </div>
          {ActionComponent && ActionComponent}
        </div>
        {/* <Separator /> */}
        <div className="mt-3">{children}</div>
      </main>
    )
  },
)
