import { useMutation } from '@tanstack/react-query'

import type { ChangePasswordRq } from '@/types'

import { axiosPrivate } from './axios'

const baseSuburl = '/auth'

export const UseUpdatePassword = () => {
  const {
    mutateAsync: updatePassword,
    reset,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationKey: ['participant', 'password'],
    mutationFn: async ({ request }: { request: ChangePasswordRq }): Promise<void> => {
      const endPoint = `${baseSuburl}/change-password`
      const response = await axiosPrivate.post(endPoint, request)
      return response.data
    },
  })
  return { updatePassword, reset, isPending, isError, error, isSuccess }
}
