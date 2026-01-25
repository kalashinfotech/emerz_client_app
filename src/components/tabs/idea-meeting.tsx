import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { isBefore, parseISO, startOfDay } from 'date-fns'
import { Ban, CalendarSync, ChevronDown, ExternalLink, Info, VideoIcon } from 'lucide-react'

import type { IdeaModel } from '@/types'
import type { MeetingModel } from '@/types/meeting'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { fetchMeetings } from '@/api/meeting'

import { useAuth } from '@/hooks/use-auth'

import { formatDateToDisplay, minutesTo12Hour } from '@/lib/date-utils'
import { titleCase } from '@/lib/text-utils'
import { cn } from '@/lib/utils'

import { ErrorPage } from '../blocks/error-page'
import LoadingPage from '../blocks/loading-page'
import { ProfileAvatar } from '../elements/profile-avatar'
import { BookMeetingModal } from '../modals/book-meeting'
import { BuyMeetingCreditModal } from '../modals/buy-meeting-credit'
import { CancelMeetingModal } from '../modals/cancel-meeting'
import { RescheduleMeetingModal } from '../modals/reschedule-meeting'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type IdeaMeetingTabProps = {
  idea: IdeaModel
}
const renderDateTime = (a: MeetingModel) =>
  `${formatDateToDisplay(a.meetingDate, 'dd MMM yyyy')} ${minutesTo12Hour(a.startTime)} - ${minutesTo12Hour(a.endTime)}`

const MeetingDetails = ({ meeting }: { meeting: MeetingModel }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Meeting details">
          <VideoIcon className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">{meeting.subject}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            {/* Meeting Link */}
            <div className="space-y-1">
              <p className="text-muted-foreground">Meeting Link</p>
              <a
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-2 break-all hover:underline">
                <ExternalLink className="size-4" />
                {meeting.meetingUrl}
              </a>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <p className="text-muted-foreground">Participants</p>

              <div className="space-y-2">
                {meeting.meetingParticipants.map(
                  (p) =>
                    p.participant && (
                      <ProfileAvatar key={p.participantId} user={p.participant} subText={p.participant.emailId} />
                    ),
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm">
            <div className="w-full space-y-1">
              <p className="text-muted-foreground">Meeting Notes</p>
              <p className="bg-muted text-muted-foreground min-h-20 w-full rounded-lg border p-3">
                {meeting.notes ?? '-'}
              </p>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

const IdeaMeetingTab = ({ idea }: IdeaMeetingTabProps) => {
  const { sessionInfo } = useAuth()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false)
  const faculty = idea.assignedToFaculty
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingModel>()
  const columnSorters = [{ id: 'createdAt', desc: true }]
  const { data: meetings, isLoading, isError, error } = useQuery(fetchMeetings(idea.id, 0, [], columnSorters, 10))
  if (isError) {
    return <ErrorPage error={error} />
  }
  if (isLoading) {
    return <LoadingPage />
  }
  // Split into past vs upcoming
  const today = startOfDay(new Date())
  const pastMeetings = meetings?.data.filter((item: MeetingModel) => {
    const d = parseISO(item.meetingDate)
    return isBefore(d, today)
  })
  const upcomingMeetings = meetings?.data.filter((item: MeetingModel) => {
    const d = parseISO(item.meetingDate)
    return !isBefore(d, today)
  })
  const isIdeaOwner = idea.ownerId === sessionInfo?.id
  return (
    <>
      <div className="flex flex-col-reverse items-start gap-8 lg:flex-row">
        <Card className="w-full lg:w-[70%]">
          <CardHeader>
            <CardTitle>Schedule a meet with your Business Coach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-base font-medium">Upcoming Meetings</p>
            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {upcomingMeetings?.length ? (
                  upcomingMeetings.map((a, i) => {
                    const isOwner = a.createdById === sessionInfo!.id
                    return (
                      <TableRow key={`upcoming-${i}`}>
                        <TableCell className="flex items-center gap-2">
                          {renderDateTime(a)}
                          <MeetingDetails meeting={a} />
                        </TableCell>

                        <TableCell>
                          {a.user ? <ProfileAvatar user={a.user} subText={a.user.roles?.[0].name} /> : '-'}
                        </TableCell>

                        <TableCell>{titleCase(a.status)}</TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="More Options">
                                <ChevronDown />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => {}}>
                                  <VideoIcon />
                                  Join
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMeeting(a)
                                    setShowRescheduleModal(true)
                                  }}
                                  disabled={!isOwner}>
                                  <CalendarSync />
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedMeeting(a)
                                    setShowCancelModal(true)
                                  }}
                                  disabled={!isOwner}>
                                  <Ban />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground text-center">
                      No upcoming meetings
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <Separator />
          <CardContent className="space-y-3 text-sm">
            <p className="text-base font-medium">Past Meetings</p>
            <Separator />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pastMeetings?.length ? (
                  pastMeetings.map((a, i) => (
                    <TableRow key={`past-${i}`}>
                      <TableCell>{renderDateTime(a)}</TableCell>

                      <TableCell>
                        {a.user ? <ProfileAvatar user={a.user} subText={a.user.roles?.[0].name} /> : '-'}
                      </TableCell>

                      <TableCell>{titleCase(a.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground text-center">
                      No past meetings
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[30%]">
          <CardHeader className="grid grid-cols-2 lg:grid-cols-1 lg:gap-6">
            <div className="space-y-2">
              <CardTitle>Assigned Coach</CardTitle>
              {faculty ? (
                <ProfileAvatar user={faculty} subText={faculty.roles?.[0].name} />
              ) : (
                <CardDescription>No coach assigned yet</CardDescription>
              )}
            </div>
            <div className="space-y-2">
              <CardTitle>Credits Available</CardTitle>
              <CardDescription>{idea.meetingCredits}</CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex gap-2">
            <div className={cn('w-full', { 'flex w-fit gap-1': !isIdeaOwner || idea.meetingCredits === 0 })}>
              <Button
                onClick={() => setShowBookingModal(true)}
                disabled={!isIdeaOwner || idea.meetingCredits === 0}
                className={cn({ 'w-full': isIdeaOwner && idea.meetingCredits > 0 })}>
                Book Meeting
              </Button>
              {(!isIdeaOwner || idea.meetingCredits === 0) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!isIdeaOwner
                      ? 'Only the idea owner can book meetings.'
                      : 'You don’t have enough credits to book a meeting.'}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className={cn('w-full', { 'flex gap-1': !isIdeaOwner })}>
              <Button
                variant="secondary"
                disabled={!isIdeaOwner}
                className={cn({ 'w-full': isIdeaOwner })}
                onClick={() => setShowBuyCreditModal(true)}>
                Buy Credits
              </Button>
              {!isIdeaOwner && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Only the idea owner can purchase credits.</TooltipContent>
                </Tooltip>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground py-2 text-xs">
        Note: Please review the terms and conditions for rescheduling or cancellation before booking.
      </p>
      {idea.assignedToFaculty && (
        <BookMeetingModal
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
          ideaId={idea.id}
          userId={idea.assignedToFaculty.id}
        />
      )}
      {idea.assignedToFaculty && selectedMeeting && (
        <RescheduleMeetingModal
          open={showRescheduleModal}
          onOpenChange={setShowRescheduleModal}
          ideaId={idea.id}
          userId={idea.assignedToFaculty.id}
          meeting={selectedMeeting}
        />
      )}
      {selectedMeeting && (
        <CancelMeetingModal
          meeting={selectedMeeting}
          open={showCancelModal}
          onOpenChange={setShowCancelModal}
          ideaId={idea.id}
        />
      )}
      <BuyMeetingCreditModal open={showBuyCreditModal} onOpenChange={setShowBuyCreditModal} ideaId={idea.id} />
    </>
  )
}

export { IdeaMeetingTab }
