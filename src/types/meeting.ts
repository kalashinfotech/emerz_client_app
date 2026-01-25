import type { z } from 'zod/v4'

import type {
  cancelMeetingRqSchema,
  cancelMeetingRsSchema,
  createMeetingCreditRqSchema,
  createMeetingRqSchema,
  fetchMeetingListRsSchema,
  fetchMeetingQySchema,
  fetchMeetingRsSchema,
  fetchUserAvailabilityQySchema,
  fetchUserAvailabilityRsSchema,
  meetingSchema,
  rescheduleMeetingRqSchema,
  updateMeetingRqSchema,
} from '@/lib/schemas/meeting'

export type CreateMeetingRqDto = z.infer<typeof createMeetingRqSchema>
export type UpdateMeetingRqDto = z.infer<typeof updateMeetingRqSchema>
export type RescheduleMeetingRqDto = z.infer<typeof rescheduleMeetingRqSchema>
export type CancelMeetingRqDto = z.infer<typeof cancelMeetingRqSchema>
export type CancelMeetingRsDto = z.infer<typeof cancelMeetingRsSchema>
export type FetchMeetingQyDto = z.infer<typeof fetchMeetingQySchema>
export type FetchMeetingRsDto = z.infer<typeof fetchMeetingRsSchema>
export type FetchUserAvailabilityQyDto = z.infer<typeof fetchUserAvailabilityQySchema>
export type FetchUserAvailabilityRsDto = z.infer<typeof fetchUserAvailabilityRsSchema>
export type FetchMeetingListRsDto = z.infer<typeof fetchMeetingListRsSchema>
export type MeetingModel = z.infer<typeof meetingSchema>
export type CreateMeetingCreditRqDto = z.infer<typeof createMeetingCreditRqSchema>
