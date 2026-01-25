import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { useAuth } from '@/hooks/use-auth'

import { Progress } from '../ui/progress'

export const ParticipantInfoWidget = () => {
  const { sessionInfo, authInitialized } = useAuth()
  if (!authInitialized) return
  if (!sessionInfo) return
  const perc = sessionInfo.completionPercentage

  return (
    <Card className="mx-auto w-80 rounded-2xl px-4 py-4 md:mx-0">
      <CardHeader>
        <CardDescription className="flex items-center gap-2 text-base">
          {sessionInfo.loginCount === 1
            ? `Welcome aboard! Let’s get started on something amazing.`
            : `Back for more? Let’s keep the momentum going!`}
        </CardDescription>
        <CardTitle className="text-4xl font-medium">{sessionInfo.firstName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="flex gap-3 text-xs">
          <Mail className="size-4 shrink-0" />
          <p>{sessionInfo.emailId}</p>
        </CardDescription>
        {sessionInfo.mobileNo && (
          <CardDescription className="flex gap-3 text-xs">
            <Phone className="size-4 shrink-0" />
            <p>{sessionInfo.mobileNo}</p>
          </CardDescription>
        )}

        {(sessionInfo.city || sessionInfo.state?.name || sessionInfo.country?.name) && (
          <CardDescription className="flex gap-3 text-xs">
            <MapPin className="size-4 shrink-0" />
            <p>{[sessionInfo.city, sessionInfo.state?.name, sessionInfo.country?.name].filter(Boolean).join(', ')}</p>
          </CardDescription>
        )}
        <div className="grid grid-cols-2">
          {sessionInfo.verifiedDate && (
            <div>
              <CardDescription className="text-xs">Joined on</CardDescription>
              <CardDescription className="text-xs">{format(sessionInfo.verifiedDate, 'dd MMM, yyyy')}</CardDescription>
            </div>
          )}
          <div>
            <CardDescription className="text-xs">Last login</CardDescription>
            <CardDescription className="text-xs">
              {sessionInfo.lastLoginAt ? format(sessionInfo.lastLoginAt, 'dd MMM, yyyy') : '-'}
            </CardDescription>
          </div>
        </div>
        {sessionInfo.batch && (
          <div className="grid grid-cols-1">
            <div>
              <CardDescription className="text-xs">Institution</CardDescription>
              <CardDescription className="text-xs">{sessionInfo.batch.institution.name}</CardDescription>
              <CardDescription className="text-xs">{sessionInfo.batch.name}</CardDescription>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start text-xs">
        {perc === 100 ? (
          <div>Congratulations! Your profile is complete.</div>
        ) : (
          <div>
            Complete your profile!
            <Button variant="link" asChild className="w-3.5 px-0 leading-none">
              <Link to="/settings">
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        )}
        <div className="flex w-full items-center gap-4 text-xs">
          <Progress value={perc} />
          <span className="">{perc}%</span>
        </div>
      </CardFooter>
    </Card>
  )
}
