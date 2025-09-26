import { useMutation } from '@tanstack/react-query'
import type { ColumnFilter, ColumnSort } from '@tanstack/react-table'

import type {
  CreateIdeaInvitesRqDto,
  CreateIdeaRqDto,
  FetchIdeaRsDto,
  FetchMyIdeaListRsDto,
  IdRs,
  UpdateIdeaRqDto,
} from '@/types'

import { fetchQuery } from '.'
import { axiosPrivate } from './axios'

const baseSuburl = '/ideas'
const queryKey = ['ideas']

export const fetchMyIdeasList = (
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

  const endpoint = `${baseSuburl}/list`
  const params = { page, pageSize, ...filters, sorting }
  return fetchQuery<FetchMyIdeaListRsDto>(endpoint, {
    queryKey: [...queryKey, 'list', page, columnFilters, sorting, pageSize],
    enabled,
    params,
  })
}
export const fetchIdeaById = (id: string, enabled: boolean = true) => {
  const endpoint = `${baseSuburl}/${id}`
  return fetchQuery<FetchIdeaRsDto>(endpoint, { queryKey: [...queryKey, id], enabled })
}

export const UseCreateIdea = () => {
  const {
    mutateAsync: createIdea,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['idea', 'create'],
    mutationFn: async ({ request }: { request: CreateIdeaRqDto }): Promise<IdRs> => {
      const endPoint = `${baseSuburl}`
      const response = await axiosPrivate.post(endPoint, request)
      return response.data
    },
  })
  return { createIdea, reset, isPending, isError, error, isSuccess }
}
export const UseUpdateIdea = (ideaId: string) => {
  const {
    mutateAsync: updateIdea,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['idea', 'update'],
    mutationFn: async ({ request, isDraft }: { request: UpdateIdeaRqDto; isDraft: boolean }): Promise<IdRs> => {
      const endPoint = `${baseSuburl}/${ideaId}`
      const response = await axiosPrivate.put(endPoint, request, { params: { isDraft } })
      return response.data
    },
  })
  return { updateIdea, reset, isPending, isError, error, isSuccess }
}

export const UseCreateIdeaInvites = (ideaId: string) => {
  const {
    mutateAsync: createInvites,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['idea', 'invite', 'create'],
    mutationFn: async ({ request }: { request: CreateIdeaInvitesRqDto }): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/invite`
      const response = await axiosPrivate.post(endPoint, request)
      return response.data
    },
  })
  return { createInvites, reset, isPending, isError, error, isSuccess }
}

export const UseResendIdeaInvite = (ideaId: string) => {
  const {
    mutateAsync: resendInvite,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['idea', 'invite', 'resend'],
    mutationFn: async ({ inviteId }: { inviteId: number }): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/invite/${inviteId}`
      const response = await axiosPrivate.post(endPoint, {})
      return response.data
    },
  })
  return { resendInvite, isPending, isError, error, isSuccess }
}
export const UseDeleteCollaborator = (ideaId: string) => {
  const {
    mutateAsync: deleteCollaborator,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['idea', 'delete', 'collaborator'],
    mutationFn: async ({ collaboratorId }: { collaboratorId: number | string }): Promise<null> => {
      const endPoint = `${baseSuburl}/${ideaId}/invite/${collaboratorId}`
      const response = await axiosPrivate.delete(endPoint)
      return response.data
    },
  })
  return { deleteCollaborator, reset, isPending, isError, error, isSuccess }
}
