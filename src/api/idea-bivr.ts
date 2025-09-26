import { useMutation } from '@tanstack/react-query'

import type { CreateBivrAnswerRqDto, FetchBivrAnswerRsDto, FetchBivrGroupListRsDto } from '@/types/idea-bivr'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/ideas'
const queryKey = ['ideas', 'bivr']

export const fetchIdeaBivr = (id: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${id}/bivr`
  return fetchQuery<FetchBivrAnswerRsDto>(endpoint, { queryKey: [...queryKey, id], enabled })
}

export const fetchIdeaBivrGroupById = (id: string, groupId: number, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${id}/bivr/group/${groupId}`
  return fetchQuery<FetchBivrAnswerRsDto>(endpoint, { queryKey: [...queryKey, id, groupId], enabled })
}

export const fetchBivrGroupsList = (id: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${id}/bivr/group`
  return fetchQuery<FetchBivrGroupListRsDto>(endpoint, { queryKey: [...queryKey, id], enabled })
}

export const UseCreateBivrAnswers = (ideaId: string, groupId: number) => {
  const {
    mutateAsync: createAnswers,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'create'],
    mutationFn: async ({ request, isDraft }: { isDraft: boolean; request: CreateBivrAnswerRqDto }): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/bivr/group/${groupId}`
      const response = await axiosPrivate.post(endPoint, request, { params: { isDraft } })
      return response.data
    },
  })
  return { createAnswers, reset, isPending, isError, error, isSuccess }
}
