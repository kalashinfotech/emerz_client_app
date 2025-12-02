import { useQuery } from '@tanstack/react-query'

import type { IdeaActivityModel } from '@/types'

import { fetchIdeaActivityByIdeaId } from '@/api/ideas'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'
import type { IdeaStatusEnum } from '@/lib/enums'
import { titleCase } from '@/lib/text-utils'

import { ProfileAvatar } from '../elements/profile-avatar'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const getStatusBadgeColor = (status: IdeaStatusEnum) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'bg-blue-500/15 text-blue-600 border border-blue-500/20'

    case 'PENDING':
      return 'bg-amber-500/15 text-amber-600 border border-amber-500/20'

    case 'IN_REVIEW':
      return 'bg-indigo-500/15 text-indigo-600 border border-indigo-500/20'

    case 'COACH_PENDING':
      return 'bg-orange-500/15 text-orange-600 border border-orange-500/20'

    case 'COACH_REVIEW':
      return 'bg-violet-500/15 text-violet-600 border border-violet-500/20'

    case 'REJECTED':
      return 'bg-red-500/15 text-red-600 border border-red-500/20'

    case 'COMPLETED':
      return 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20'

    default:
      return 'bg-gray-500/15 text-gray-600 border border-gray-500/20'
  }
}

const join = (...parts: (string | null | undefined)[]) =>
  parts
    .filter(Boolean)
    .map((v) => titleCase(v!, '_'))
    .join(' - ')

const getStatusChange = (act: IdeaActivityModel) => {
  const stageChanged = act.oldStage !== act.newStage
  const statusChanged = act.oldStatus !== act.newStatus

  if (!stageChanged && !statusChanged) return null

  // Build "from" using whatever exists
  const from = join(act.oldStage, act.oldStatus)

  let to = ''

  if (stageChanged && statusChanged) {
    // both changed
    to = join(act.newStage, act.newStatus)
  } else if (stageChanged) {
    // only stage changed
    to = join(act.newStage, act.newStatus)
  } else if (statusChanged) {
    // only status changed
    to = join(act.newStatus)
  }

  return { from, to }
}

const hasStatusChanged = (act: IdeaActivityModel) => {
  if (act.oldStage === act.newStage && act.oldStatus === act.newStatus) return false
  return true
}

const getActionee = (act: IdeaActivityModel) => {
  if (act.user) {
    return { firstName: act.user.firstName, lastName: act.user.lastName }
  }
  if (act.collaborator) {
    return { firstName: act.collaborator.participant!.firstName, lastName: act.collaborator.participant!.lastName }
  }
  return { firstName: '', lastName: '' }
}

type IdeaActivityTabProps = {
  ideaId: string
}
const IdeaAcitivityTab = ({ ideaId }: IdeaActivityTabProps) => {
  const { data } = useQuery(fetchIdeaActivityByIdeaId(ideaId))
  return (
    <Card className="w-[80%]">
      <CardHeader>
        <CardTitle>Idea Activity</CardTitle>
      </CardHeader>
      <CardContent className="">
        {data?.map((d, i) => {
          const actionee = getActionee(d)
          const statusChange = getStatusChange(d)
          return (
            <div key={i} className="py-4 text-sm not-last:border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ProfileAvatar firstName={actionee.firstName} lastName={actionee.lastName} />
                  <span className="text-muted-foreground">{d.notificationText} on</span>
                  {formatUtcStringToLocalDisplay(d.updatedAt, true, 'dd MMM, yyyy hh:mm a')}
                  {hasStatusChanged(d) && (
                    <div>
                      <span>
                        {statusChange?.from && (
                          <Badge className={getStatusBadgeColor(d.oldStatus || 'PENDING')}>{statusChange.from}</Badge>
                        )}{' '}
                        to <Badge className={getStatusBadgeColor(d.newStatus || 'PENDING')}>{statusChange?.to}</Badge>
                      </span>
                    </div>
                  )}
                </div>
                {d.collaborator && <Badge>{d.collaborator.designation}</Badge>}
                {d.user && <Badge variant="secondary">{d.user.userType === 'FACULTY' ? 'Faculty' : 'Admin'}</Badge>}
              </div>
              {d.response && (
                <div className="bg-background text-muted-foreground ml-11 rounded-lg p-4">
                  {d.response && <p className="whitespace-break-spaces">{d.response}</p>}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export { IdeaAcitivityTab }
