import { useMutation } from '@tanstack/react-query'
import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type {
  CancelMeetingRqDto,
  CancelMeetingRsDto,
  CreateMeetingCreditRqDto,
  CreateMeetingRqDto,
  FetchMeetingListRsDto,
  FetchMeetingRsDto,
  FetchUserAvailabilityQyDto,
  FetchUserAvailabilityRsDto,
  RescheduleMeetingRqDto,
} from '@/types/meeting'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/ideas'
const queryKey = ['meeting']

export const fetchUserAvailability = (
  ideaId: string,
  req: FetchUserAvailabilityQyDto,
  page: number = 0,
  pageSize: number = 5,
  enabled: boolean = true,
) => {
  const endpoint = `${baseSuburl}/${ideaId}/meeting/availability`
  const params = { page, pageSize, ...req }
  return fetchQuery<FetchUserAvailabilityRsDto>(endpoint, {
    queryKey: [...queryKey, 'availability', page, pageSize],
    enabled,
    params,
  })
}

export const fetchMeetings = (
  ideaId: string,
  page: number,
  columnFilters: ColumnFilter[],
  sorting: ColumnSort[],
  pageSize: number = 10,
  enabled: boolean = true,
) => {
  const filters = columnFilters.reduce<Record<string, string>>((acc, obj) => {
    acc[obj.id] = obj.value as string
    return acc
  }, {})

  const endpoint = `${baseSuburl}/${ideaId}/meeting`
  const params = { page, pageSize, ...filters, sorting }
  return fetchQuery<FetchMeetingListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', page, columnFilters, sorting, pageSize, ideaId],
    enabled,
    params,
  })
}

export const UseCreateMeeting = (ideaId: string) => {
  const {
    mutateAsync: createMeeting,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'create', ideaId],
    mutationFn: async (request: CreateMeetingRqDto): Promise<FetchMeetingRsDto> => {
      const endPoint = `${baseSuburl}/${ideaId}/meeting`
      const response = await axiosPrivate.post(endPoint, request)
      return response.data
    },
  })
  return { createMeeting, reset, isPending, isError, error, isSuccess }
}

export const UseCancelMeeting = (ideaId: string, meetingId: number) => {
  const {
    mutateAsync: cancelMeeting,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'cancel', ideaId, meetingId],
    mutationFn: async (request: CancelMeetingRqDto): Promise<CancelMeetingRsDto> => {
      const endPoint = `${baseSuburl}/${ideaId}/meeting/${meetingId}`
      const response = await axiosPrivate.patch(endPoint, request)
      return response.data
    },
  })
  return { cancelMeeting, reset, isPending, isError, error, isSuccess }
}

export const UseRescheduleMeeting = (ideaId: string, meetingId: number) => {
  const {
    mutateAsync: rescheduleMeeting,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'reschedule', ideaId, meetingId],
    mutationFn: async (request: RescheduleMeetingRqDto): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/meeting/${meetingId}/reschedule`
      const response = await axiosPrivate.patch(endPoint, request)
      return response.data
    },
  })
  return { rescheduleMeeting, reset, isPending, isError, error, isSuccess }
}

export const UseCreateMeetingCredit = (ideaId: string) => {
  const {
    mutateAsync: createMeetingCredit,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'createCredit', ideaId],
    mutationFn: async (request: CreateMeetingCreditRqDto): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/meeting-credit`
      const response = await axiosPrivate.post(endPoint, request)
      return response.data
    },
  })
  return { createMeetingCredit, reset, isPending, isError, error, isSuccess }
}
