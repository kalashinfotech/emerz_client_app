import { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getDate } from 'date-fns'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import { toast } from 'sonner'

import type { TError } from '@/types'
import type { MeetingModel } from '@/types/meeting'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'
import { Tabs, TabsButton, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { UseRescheduleMeeting, fetchUserAvailability } from '@/api/meeting'

import { formatDateToDisplay, getDay, getMonthName, minutesTo12Hour } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

import { Error } from '../elements/error'
import { Loader } from '../elements/loader'
import { Confirmation } from './confirmation'

const renderDateTime = (a: MeetingModel) =>
  `${formatDateToDisplay(a.meetingDate, 'dd MMM yyyy')} ${minutesTo12Hour(a.startTime)} - ${minutesTo12Hour(a.endTime)}`

type RescheduleMeetingModalProps = {
  meeting: MeetingModel
  userId: string
  ideaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}
export const RescheduleMeetingModal = ({ meeting, userId, ideaId, open, onOpenChange }: RescheduleMeetingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string>()
  const [selectedTime, setSelectedTime] = useState<number>()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [page, setPage] = useState<number>(0)
  const { data: schedules, isError, error, isLoading } = useQuery(fetchUserAvailability(ideaId, { userId }, page))
  const { rescheduleMeeting, isPending: isCreatePending } = UseRescheduleMeeting(ideaId, meeting.id)
  const queryClient = useQueryClient()

  const handleRescheduling = async () => {
    if (!selectedTime || !selectedDate) return
    try {
      // Your mutation should return { patient_assessment, razorpay, requires_payment }
      await rescheduleMeeting({
        userId,
        meetingDate: selectedDate,
        startTime: selectedTime,
      })
      queryClient.invalidateQueries({ queryKey: ['ideas', ideaId] })
      queryClient.invalidateQueries({ queryKey: ['meeting'] })
      toast.success('Meeting rescheduled', {
        description: 'Your meeting has been rescheduled successfully.',
      })
      setOpenConfirm(false)
      onOpenChange(false)
    } catch (e1) {
      const err = e1 as AxiosError<TError>
      toast.error('Rescheduling failed', {
        description:
          err.response?.data.error?.message ??
          'We couldn’t reschedule the meeting due to a technical issue. Please try again in a moment.',
      })
    }
  }

  const handleNext = () => {
    if (schedules) {
      if (schedules.pagination.currentPage < schedules.pagination.totalPages) {
        setPage((prev) => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (schedules) {
      if (schedules.pagination.currentPage > 0) {
        setPage((prev) => prev - 1)
      }
    }
  }
  useEffect(() => {
    if (!open) return
    if (schedules && schedules.data.length > 0) setSelectedDate(schedules.data[0].scheduleDate)
    else setSelectedDate(undefined)
  }, [schedules, open])

  useEffect(() => {
    setSelectedTime(undefined)
  }, [selectedDate])

  return (
    <>
      <Credenza
        open={open}
        onOpenChange={(o) => {
          if (o === false) {
            setPage(0)
            setSelectedDate(undefined)
            setSelectedTime(undefined)
            onOpenChange(false)
          } else {
            onOpenChange(true)
          }
        }}>
        <CredenzaContent className="">
          <CredenzaHeader>
            <CredenzaTitle>Reschedule Meeting</CredenzaTitle>
            <CredenzaDescription>
              You can change the meeting date and time here, subject to the rescheduling policy.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <Card className="mx-auto border-0 shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Availability</CardTitle>
                  {schedules && (
                    <div>
                      <div className="flex w-full items-center justify-center gap-0 px-2">
                        <Button
                          size="icon"
                          className="rounded-none rounded-s-full"
                          onClick={handlePrevious}
                          disabled={schedules.pagination.currentPage === 0}>
                          <ChevronLeftCircle />
                        </Button>
                        <Button
                          size="icon"
                          className="rounded-none rounded-e-full"
                          onClick={handleNext}
                          disabled={schedules.pagination.currentPage + 1 >= schedules.pagination.totalPages}>
                          <ChevronRightCircle />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="table w-fit">
                  <div className="table-row text-sm">
                    <p className="table-cell pr-2 font-semibold">Current Date</p>
                    <p className="table-cell">{renderDateTime(meeting)}</p>
                  </div>
                  <div className="table-row text-sm">
                    <p className="table-cell pr-2 font-semibold">Selected Date</p>
                    <p className="table-cell">
                      {selectedDate ? formatDateToDisplay(selectedDate, 'dd MMM yyyy') : 'Select a date'}
                    </p>
                  </div>
                  <div className="table-row text-sm">
                    <p className="table-cell pr-2 font-semibold">Selected Time</p>
                    <p className="table-cell">{selectedTime ? minutesTo12Hour(selectedTime) : '-'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="border-t border-b py-4">
                {isError ? (
                  <Error message={error.response?.data.error?.message} />
                ) : isLoading ? (
                  <div>
                    <Loader />
                  </div>
                ) : (
                  <Tabs
                    defaultValue={selectedDate}
                    value={selectedDate}
                    onValueChange={(val) => setSelectedDate(val)}
                    className="items-center">
                    <TabsList className="grid h-24 grid-cols-5 flex-wrap gap-2 bg-transparent md:flex md:flex-nowrap">
                      {schedules?.data.map((schedule, index) => (
                        <TabsTrigger
                          key={`tabs-trigger-${index}`}
                          value={schedule.scheduleDate}
                          className={cn(
                            'bg-muted dark:text-primary text-primary data-[state=active]:bg-primary dark:data-[state=active]:bg-primary hover:bg-accent cursor-pointer rounded-2xl',
                            'border-input/40 hover:text-primary w-12 border data-[state=active]:cursor-default data-[state=active]:text-white md:w-16',
                          )}>
                          <div className="mx-1">
                            <p className="text-xs text-[0.685rem] font-normal">{getMonthName(schedule.scheduleDate)}</p>
                            <p className="text-xl font-semibold md:text-3xl">{getDate(schedule.scheduleDate)}</p>
                            <p className="text-[0.685rem]">
                              {getDay(schedule.scheduleDate)?.substring(0, 3).toUpperCase()}
                            </p>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="bg-secondary h-2.5" />
                    {schedules?.data.map((schedule, index) => (
                      <TabsContent
                        key={`tabs-content-${index}`}
                        value={schedule.scheduleDate}
                        className="grid grid-cols-2 gap-4">
                        {schedule.slots.map((slot, sindex) => (
                          <TabsButton
                            key={`slot-${sindex}`}
                            onClick={() => setSelectedTime(slot.startTime)}
                            className={cn(
                              { 'text-destructive! line-through': !slot.available },
                              'border-input w-40 border text-xs',
                            )}
                            disabled={!slot.available}
                            data-state={slot.available ? 'active' : 'inactive'}
                            data-selected={selectedTime === slot.startTime ? 'true' : 'false'}>
                            <p>{minutesTo12Hour(slot.startTime)}</p> - <p>{minutesTo12Hour(slot.endTime)} </p>
                          </TabsButton>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
              <CardFooter className="flex-col items-center text-xs">
                <Button
                  disabled={!selectedTime || !selectedDate}
                  onClick={() => {
                    setOpenConfirm(true)
                  }}>
                  Reschedule Meeting
                </Button>
              </CardFooter>
            </Card>
            <p className="text-muted-foreground mt-3 text-xs">
              Note: Meetings can be rescheduled only if the request is made at least 24 hours before the scheduled time.
              Applicable terms and conditions apply.
            </p>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
      {selectedDate && selectedTime && (
        <Confirmation
          open={openConfirm}
          onOpenChange={setOpenConfirm}
          loading={isCreatePending}
          onClick={handleRescheduling}
          title="Confirm Meeting Reschedule"
          desc={
            <>
              <span className="block">
                You are about to reschedule a meeting on{' '}
                <span className="font-medium">{formatDateToDisplay(selectedDate, 'dd MMM yyyy')}</span> at{' '}
                <span className="font-medium">{minutesTo12Hour(selectedTime)}</span>
              </span>
              <span className="text-muted-foreground mt-2 block">
                You can only reschedule 1 time. Rescheduling or cancellation is subject to applicable terms and
                conditions.
              </span>
            </>
          }
        />
      )}
    </>
  )
}
