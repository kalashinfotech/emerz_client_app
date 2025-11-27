import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateBivrAnswerRqDto, FetchBivrAnswerRsDto, FetchBivrGroupListRsDto } from '@/types/idea-bivr'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/ideas'
const queryKey = ['ideas', 'question']

export const fetchIdeaBivrGroupById = (id: string, groupId: number, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${id}/question/group/${groupId}`
  return fetchQuery<FetchBivrAnswerRsDto>(endpoint, { queryKey: [...queryKey, id, groupId], enabled })
}

export const fetchBivrGroupsList = (id: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${id}/question/group`
  return fetchQuery<FetchBivrGroupListRsDto>(endpoint, {
    queryKey: [...queryKey, id],
    enabled,
    params: { group: 'STAGE_2' },
  })
}

export const UseCreateBivrAnswers = (ideaId: string, groupId: number) => {
  const queryClient = useQueryClient()
  const {
    mutateAsync: createAnswers,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: [...queryKey, 'create'],
    mutationFn: async ({
      request,
      isDraft,
    }: {
      isDraft: boolean
      request: CreateBivrAnswerRqDto
    }): Promise<FetchBivrAnswerRsDto> => {
      const endPoint = `${baseSuburl}/${ideaId}/question/group/${groupId}`
      const response = await axiosPrivate.post(endPoint, request, { params: { isDraft } })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData([...queryKey, ideaId, groupId], data)
    },
  })
  return { createAnswers, reset, isPending, isError, error, isSuccess }
}
