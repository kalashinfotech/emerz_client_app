import type React from 'react'

import { useAuth } from '@/hooks/use-auth'

import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'

type ProfileCompletionProps = React.ComponentProps<'div'>

const ProfileCompletion = ({ className, ...props }: ProfileCompletionProps) => {
  const { sessionInfo } = useAuth()
  const perc = sessionInfo?.completionPercentage

  return (
    <Card className={cn('w-80 gap-2', className)} {...props}>
      <CardHeader>
        <CardTitle className="text-sm font-normal">
          {perc === 100 ? 'Congratulations! Your profile is complete' : 'Complete Your Profile'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-xs">
          <Progress value={perc} />
          {perc}%
        </div>
      </CardContent>
    </Card>
  )
}

export { ProfileCompletion }
