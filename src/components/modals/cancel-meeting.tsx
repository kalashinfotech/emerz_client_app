import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

import type { TError } from '@/types'
import type { CancelMeetingRqDto, MeetingModel } from '@/types/meeting'

import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'

import { UseCancelMeeting } from '@/api/meeting'

import { useAppForm } from '@/hooks/use-app-form'

import { formatDateToDisplay, minutesTo12Hour } from '@/lib/date-utils'
import { cancelMeetingRqSchema } from '@/lib/schemas/meeting'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Confirmation } from './confirmation'

const renderDateTime = (a: MeetingModel) =>
  `${formatDateToDisplay(a.meetingDate, 'dd MMM yyyy')} ${minutesTo12Hour(a.startTime)} - ${minutesTo12Hour(a.endTime)}`

type CancelMeetingModalProps = {
  ideaId: string
  open: boolean
  meeting: MeetingModel
  onOpenChange: (open: boolean) => void
}
export const CancelMeetingModal = ({ meeting, ideaId, open, onOpenChange }: CancelMeetingModalProps) => {
  const [openConfirm, setOpenConfirm] = useState(false)
  const { cancelMeeting, isPending: isCancelPending } = UseCancelMeeting(ideaId, meeting.id)
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: { reason: '' } as CancelMeetingRqDto,
    validators: { onSubmit: cancelMeetingRqSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await cancelMeeting(value)
        queryClient.invalidateQueries({ queryKey: ['ideas', ideaId] })
        queryClient.invalidateQueries({ queryKey: ['meeting'] })
        toast.success('Meeting cancelled', {
          description: response.creditReversed
            ? 'Your meeting credit has been added back.'
            : 'This cancellation does not qualify for credit restoration.',
        })
        setOpenConfirm(false)
        onOpenChange(false)
      } catch (e1) {
        const err = e1 as AxiosError<TError>
        toast.error('Cancellation failed', {
          description: err.response?.data.error?.message ?? err.message,
        })
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}>
      <Credenza
        open={open}
        onOpenChange={(o) => {
          if (o === false) {
            onOpenChange(false)
            form.reset()
          } else {
            onOpenChange(true)
          }
        }}>
        <CredenzaContent className="">
          <CredenzaHeader>
            <CredenzaTitle>Cancel Meeting</CredenzaTitle>
            <CredenzaDescription>
              Please let us know why you’re canceling this meeting. This helps us improve scheduling and support.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4">
            <div className="space-y-2">
              <Label>Meeting Date & Time</Label>
              <Input value={renderDateTime(meeting)} disabled />
            </div>
            <form.AppField name="reason">
              {(field) => <field.TextArea label="Cancellation Reason" placeholder="Reason for cancellation" mandatory />}
            </form.AppField>
            <p className="text-muted-foreground text-xs">
              Note: Cancellations made within the allowed time window may be eligible for credit reuse. Late cancellations
              may result in the meeting credit being forfeited as per our cancellation policy.
            </p>
          </CredenzaBody>
          <CredenzaFooter>
            <Button
              variant="destructive"
              onClick={() => {
                const val = form.validate('submit')
                if (Object.keys(val).length > 0) {
                  return
                } else {
                  setOpenConfirm(true)
                }
              }}>
              Cancel Meeting
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
      <Confirmation
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        loading={isCancelPending}
        onClick={form.handleSubmit}
        title="Confirm Meeting Cancellation"
        desc={
          <>
            <span className="block">
              You are about to cancel the meeting scheduled on{' '}
              <span className="font-medium">{formatDateToDisplay(meeting.meetingDate, 'dd MMM yyyy')}</span> at{' '}
              <span className="font-medium">{minutesTo12Hour(meeting.startTime)}</span>.
            </span>

            <span className="text-muted-foreground mt-2 block">
              This action cannot be undone. Meeting credit usage or refund (if any) will be handled according to our
              cancellation policy.
            </span>
          </>
        }
      />
    </form>
  )
}
