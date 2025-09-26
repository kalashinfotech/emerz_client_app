import { useMutation } from '@tanstack/react-query'

import type { FetchParticipantRsDto, UpdateParticipantRqDto } from '@/types'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/participant'
const queryKey = ['participant']

export const fetchMyProfile = (enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/me`
  return fetchQuery<FetchParticipantRsDto>(endpoint, { queryKey: [...queryKey, 'profile'], enabled })
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
    mutationFn: async ({ request }: { request: UpdateParticipantRqDto }): Promise<FetchParticipantRsDto> => {
      const endPoint = `${baseSuburl}/me`
      const response = await axiosPrivate.put(endPoint, request)
      return response.data
    },
  })
  return { updateMyProfile, reset, isPending, isError, error, isSuccess }
}
