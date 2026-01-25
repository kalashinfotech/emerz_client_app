import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { GitCompareArrows } from 'lucide-react'

import type { IdeaActivityModel } from '@/types'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { fetchIdeaActivityByIdeaId } from '@/api/ideas'

import { formatUtcStringToLocalDisplay } from '@/lib/date-utils'
import type { IdeaStatusEnum } from '@/lib/enums'
import { titleCase } from '@/lib/text-utils'

import { ErrorPage } from '../blocks/error-page'
import LoadingPage from '../blocks/loading-page'
import { ProfileAvatar } from '../elements/profile-avatar'
import { IdeaAnswerHistoryModal } from '../modals/answer-history-modal'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
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
    return {
      firstName: act.user.firstName,
      lastName: act.user.lastName,
      profilePicId: act.user.profilePicId,
      displayId: act.user.displayId,
    }
  }
  if (act.collaborator) {
    return {
      firstName: act.collaborator.participant!.firstName,
      lastName: act.collaborator.participant!.lastName,
      profilePicId: act.collaborator.participant!.profilePicId,
      displayId: act.collaborator.participant!.displayId,
    }
  }
  return { firstName: '', lastName: '' }
}

type IdeaActivityTabProps = {
  ideaId: string
}
const IdeaAcitivityTab = ({ ideaId }: IdeaActivityTabProps) => {
  const [page, setPage] = useState(0)
  // const columnSorters = sortByToState(searchParams.sortBy)
  // const columnFilters = filterToState(searchParams)
  const { data, isPending, isError, error } = useQuery(fetchIdeaActivityByIdeaId(ideaId, page, [], [], 10))
  const [selectedIdeaActivity, setSelectedIdeaActivity] = useState<number>()
  const [openAnswerHistory, setOpenAnswerHistory] = useState(false)
  if (isPending) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />
  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Idea Activity</CardTitle>
          <div className="">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="bg-primary/10 text-xs"
                    onClick={() => setPage((prev) => prev - 1)}
                    isActive={page > 0}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="bg-primary/10 text-xs"
                    onClick={() => setPage((prev) => prev + 1)}
                    isActive={page < data.pagination.totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardHeader>
        <CardContent className="">
          {data.data.map((d, i) => {
            const actionee = getActionee(d)
            const statusChange = getStatusChange(d)
            return (
              <div key={i} className="py-4 text-sm not-last:border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ProfileAvatar user={actionee} tooltip={actionee.displayId} />
                    <span className="text-muted-foreground">
                      {d.notificationText}{' '}
                      {d.assignedToUser && (
                        <span>
                          to <span className="text-foreground">{d.assignedToUser.fullName}</span>
                        </span>
                      )}{' '}
                      on
                    </span>
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
                  <div className="flex items-center gap-4">
                    {d.collaborator && <Badge>{d.collaborator.designation}</Badge>}
                    {d.user && <Badge variant="secondary">{d.user.roles?.[0].name ?? 'Admin'}</Badge>}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedIdeaActivity(d.id)
                        setOpenAnswerHistory(true)
                      }}
                      disabled={(d.answersHistoryCount || 0) < 1}>
                      <GitCompareArrows />
                    </Button>

                    {/* <DropdownMenu> */}
                    {/*   <DropdownMenuTrigger asChild> */}
                    {/*     <Button variant="ghost" size="icon" aria-label="More Options"> */}
                    {/*       <MoreHorizontalIcon /> */}
                    {/*     </Button> */}
                    {/*   </DropdownMenuTrigger> */}
                    {/*   <DropdownMenuContent align="end" className="w-52"> */}
                    {/*     <DropdownMenuGroup> */}
                    {/*       <DropdownMenuItem */}
                    {/*         onClick={() => { */}
                    {/*           setSelectedIdeaActivity(d.id) */}
                    {/*           setOpenAnswerHistory(true) */}
                    {/*         }} */}
                    {/*         disabled={(d.answersHistoryCount || 0) < 1}> */}
                    {/*         <Users2 /> */}
                    {/*         View Changes */}
                    {/*       </DropdownMenuItem> */}
                    {/*     </DropdownMenuGroup> */}
                    {/*   </DropdownMenuContent> */}
                    {/* </DropdownMenu> */}
                  </div>
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
      {selectedIdeaActivity && openAnswerHistory && (
        <IdeaAnswerHistoryModal
          ideaId={ideaId}
          ideaActivityId={selectedIdeaActivity}
          open={openAnswerHistory}
          onOpenChange={setOpenAnswerHistory}
        />
      )}
    </>
  )
}

export { IdeaAcitivityTab }
