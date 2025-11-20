import { useMutation } from '@tanstack/react-query'

import type { FetchParticipantRsDto, UpdateParticipantRqDto, UpdateParticipantRsDto } from '@/types'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/participant'
const queryKey = ['participant']

// NOTE: passing id to avoid caching issues
export const fetchMyProfile = (id: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/me`
  return fetchQuery<FetchParticipantRsDto>(endpoint, { queryKey: [...queryKey, id, 'profile'], enabled })
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
