import { useMutation } from '@tanstack/react-query'
import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type {
  FetchCollaboratorRsDto,
  FetchParticipantRsDto,
  UpdateParticipantRqDto,
  UpdateParticipantRsDto,
} from '@/types'
import type { FetchInAppNotificationRsDto } from '@/types/in-app-notification'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/participant'
const queryKey = ['participant']

// NOTE: passing id to avoid caching issues
export const fetchMyProfile = (id: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/me`
  return fetchQuery<FetchParticipantRsDto>(endpoint, { queryKey: [...queryKey, id, 'profile'], enabled })
}

// NOTE: passing id to avoid caching issues
export const fetchMyNotificationList = (
  participantId: string,
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

  const endpoint = `${baseSuburl}/me/notification`
  const params = { page, pageSize, ...filters, sorting }
  return fetchQuery<FetchInAppNotificationRsDto>(endpoint, {
    queryKey: [...queryKey, 'notification', participantId, page, columnFilters, sorting, pageSize],
    enabled,
    params,
  })
}

export const UseUpdateMyProfile = () => {
  const {
    mutateAsync: updateMyProfile,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['participant', 'profile'],
    mutationFn: async ({ request }: { request: UpdateParticipantRqDto }): Promise<UpdateParticipantRsDto> => {
      const endPoint = `${baseSuburl}/me`
      const response = await axiosPrivate.put(endPoint, request, {
        headers: { 'content-type': 'multipart/form-data' },
        formSerializer: { indexes: null, dots: false },
      })
      return response.data
    },
  })
  return { updateMyProfile, reset, isPending, isError, error, isSuccess }
}

export const UseMarkNotificationRead = () => {
  const {
    mutateAsync: markRead,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['participant', 'notification'],
    mutationFn: async ({ notificationId }: { notificationId: number }): Promise<null> => {
      const endPoint = `${baseSuburl}/me/notification/${notificationId}/read`
      const response = await axiosPrivate.patch(endPoint)
      return response.data
    },
  })
  return { markRead, reset, isPending, isError, error, isSuccess }
}

export const fetchInviteById = (inviteId: number, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/me/invite/${inviteId}`
  return fetchQuery<FetchCollaboratorRsDto>(endpoint, { queryKey: [...queryKey, inviteId, 'invitation'], enabled })
}
