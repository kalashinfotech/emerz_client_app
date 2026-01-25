import { z } from 'zod/v4'

import { MeetingStatusEnum, MeetingTypeEnum } from '@/lib/enums'
import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { bareParticipantSchema } from './client'
import { bareUserAccountSchema } from './user-account'

export const baseMeetingParticipantSchema = z.object({
  meetingId: z.number(),
  participantId: z.uuid(),
})

export const meetingParticipantSchema = baseMeetingParticipantSchema.extend({
  id: z.number(),
  participant: bareParticipantSchema.optional(),
})

export const baseMeetingSchema = z
  .object({
    userId: z.uuid(),
    meetingDate: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    meetingType: z.enum(MeetingTypeEnum).default('FREE'),
    meetingUrl: z.url(),
    duration: z.int().positive(),
    notes: z.string().optional(),
  })
  .refine((m) => m.endTime > m.startTime, {
    message: 'EndTime must be greater than startTime',
  })

export const meetingSchema = z.object({
  id: z.int(),
  userId: z.uuid(),
  meetingDate: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  duration: z.int(),
  meetingType: z.enum(MeetingTypeEnum),
  meetingUrl: z.string(),
  status: z.enum(MeetingStatusEnum),
  notes: z.string().nullable(),
  subject: z.string().nullable(),
  cancelledAt: z.date().nullable(),
  cancellationReason: z.string().nullable(),
  cancelledBy: z.string().nullable(),
  rescheduleCount: z.int(),
  rescheduledAt: z.string().nullable(),
  rescheduledBy: z.uuid().nullable(),
  createdById: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdBy: bareParticipantSchema,
  user: bareUserAccountSchema.optional(),
  meetingParticipants: z.array(meetingParticipantSchema),
})

export const createMeetingRqSchema = z.object({
  userId: z.uuid(),
  meetingDate: z.string(),
  startTime: z.number(),
})
export const rescheduleMeetingRqSchema = z.object({
  userId: z.uuid(),
  meetingDate: z.string(),
  startTime: z.number(),
})

export const cancelMeetingRqSchema = z.object({
  reason: z.string().min(6),
})
export const cancelMeetingRsSchema = z.object({
  creditReversed: z.boolean(),
})

export const updateMeetingRqSchema = z
  .object({
    startTime: z.number().optional(),
    endTime: z.number().optional(),
    meetingUrl: z.url().optional(),
    notes: z.string().optional(),
    status: z.enum(MeetingStatusEnum).optional(),
    cancellationReason: z.string().optional(),
  })
  .refine((m) => !m.startTime || !m.endTime || m.endTime > m.startTime, {
    message: 'EndTime must be greater than startTime',
  })

export const fetchMeetingRsSchema = meetingSchema

export const fetchMeetingListRsSchema = z.object({
  data: z.array(meetingSchema),
  pagination: paginationRsSchema,
})

export const fetchMeetingQySchema = z
  .object({
    userId: z.uuid().optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    status: z.enum(MeetingStatusEnum).optional(),
    meetingType: z.enum(MeetingTypeEnum).optional(),
  })
  .extend({
    ...paginationQySchema.shape,
    ...sortQySchema.shape,
    search: z.string().optional(),
  })

export const fetchUserAvailabilityQySchema = z.object({
  userId: z.uuid(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
})

export const availabilitySlotSchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
  available: z.boolean(),
})

export const availabilityDaySchema = z.object({
  scheduleDate: z.string(),
  slots: z.array(availabilitySlotSchema),
})

export const fetchUserAvailabilityRsSchema = z.object({
  data: z.array(availabilityDaySchema),
  pagination: paginationRsSchema,
})

export const createMeetingCreditRqSchema = z.object({
  noOfCredits: z.string(),
})
