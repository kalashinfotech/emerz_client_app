import type { AxiosError } from 'axios'
import { toast } from 'sonner'

import type { ChangePasswordRq, TError } from '@/types'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { UseUpdatePassword } from '@/api/auth'

import { useAppForm } from '@/hooks/use-app-form'

import { changePasswordRqSchema } from '@/lib/schemas/auth'

export const SetPasswordTab = () => {
  const { updatePassword } = UseUpdatePassword()
  const form = useAppForm({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    } as ChangePasswordRq,
    validators: {
      onSubmit: changePasswordRqSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updatePassword({ request: value })
        toast.success('Success', {
          description: 'Password set successfully.',
        })
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(
          err.response?.data.error?.message || 'There was an error in updating password. Please try after sometime.',
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
        <CardHeader>
          <CardTitle>Set Password</CardTitle>
          <CardDescription>Secure your account with a new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <form.AppField name="newPassword">
              {(field) => (
                <field.TextField
                  type="password"
                  label="New Password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                />
              )}
            </form.AppField>
            <form.AppField
              name="confirmPassword"
              validators={{
                onChangeListenTo: ['newPassword'],
                onChange: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue('newPassword')) {
                    return { message: 'Passwords do not match' }
                  }
                  return undefined
                },
              }}>
              {(field) => (
                <field.TextField
                  type="password"
                  label="Confirm Password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                />
              )}
            </form.AppField>
          </div>
        </CardContent>
        <CardFooter>
          <form.AppForm>
            <form.SubscribeButton label="Update Password" />
          </form.AppForm>
        </CardFooter>
      </Card>
    </form>
  )
}
