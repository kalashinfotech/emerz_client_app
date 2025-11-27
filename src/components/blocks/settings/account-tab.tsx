import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

import type { TError, UpdateParticipantRqDto } from '@/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

import { UseUpdateMyProfile, fetchMyProfile } from '@/api/participant'

import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'

import { updateParticipantRqSchema } from '@/lib/schemas/client'

const AccountTab = () => {
  const { setSessionInfo, sessionInfo } = useAuth()
  const { data } = useSuspenseQuery(fetchMyProfile(sessionInfo?.id || ''))
  const { updateMyProfile } = UseUpdateMyProfile()
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: data as UpdateParticipantRqDto,
    validators: {
      onSubmit: updateParticipantRqSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const updatedData = await updateMyProfile({ request: value })
        toast.success('Success', {
          description: 'Account updated successfully.',
        })
        queryClient.setQueryData(['participant', 'profile'], updatedData)
        setSessionInfo(updatedData)
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(
          err.response?.data.error?.message || 'Something went wrong. Please contact administrator or try again later.',
        )
      }
    },
  })

  return (
    <form
      className="w-[80%]"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
      <Card>
        <CardContent>
          <div className="space-y-4">
            <form.AppField name="emailId">
              {(field) => (
                <field.TextField className="w-full flex-1 shrink-0" label="Email ID" disabled placeholder="Email" />
              )}
            </form.AppField>
            <div className="flex items-center gap-4">
              <form.AppField name="googleId">
                {(field) => (
                  <field.TextField
                    className="w-full flex-1 shrink-0"
                    label="Google ID"
                    disabled
                    placeholder="Google ID"
                  />
                )}
              </form.AppField>
              <div>
                <div className="mb-2 ml-1 flex justify-between text-xs leading-5">-</div>
                <Button>Disconnect</Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* <form.AppForm> */}
          {/*   <form.SubscribeButton label="Update Profile" onClick={() => {}} /> */}
          {/* </form.AppForm> */}
        </CardFooter>
      </Card>
    </form>
  )
}

export { AccountTab }
