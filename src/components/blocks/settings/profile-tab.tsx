import { useStore } from '@tanstack/react-form'
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

import type { TError, UpdateParticipantRqDto } from '@/types'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ImageUploader } from '@/components/ui/image-uploader'

import { UseUpdateMyProfile, fetchMyProfile } from '@/api/participant'
import { fetchCountryDropdown, fetchStateDropdown } from '@/api/public'

import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'

import { updateParticipantRqSchema } from '@/lib/schemas/client'

const ProfileTab = () => {
  const { setSessionInfo } = useAuth()
  const { data } = useSuspenseQuery(fetchMyProfile())
  const { data: countries } = useQuery(fetchCountryDropdown(true))
  const { updateMyProfile } = UseUpdateMyProfile()
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: data as UpdateParticipantRqDto,
    validators: {
      onSubmit: updateParticipantRqSchema,
      // onMount: updateParticipantRqSchema,
      // onChange: updateParticipantRqSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('value is ', value)
      try {
        const updatedData = await updateMyProfile({ request: value })
        toast.success('Success', {
          description: 'Profile updated successfully.',
        })
        queryClient.setQueryData(['participant', 'profile'], updatedData)
        setSessionInfo(updatedData)
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(
          err.response?.data.error.message || 'Something went wrong. Please contact administrator or try again later.',
        )
      }
    },
  })
  const countryId = useStore(form.store, (state) => state.values.countryId)
  const stateId = useStore(form.store, (state) => state.values.stateId)
  const { data: states } = useQuery(fetchStateDropdown(Number(countryId), !!countryId))
  const handleAvatarComplete = (file: File, objectUrl: string) => {
    console.log('Cropped file:', file, typeof file)
    console.log('Preview URL:', objectUrl, typeof objectUrl)

    // // Example: upload file to backend
    // const formData = new FormData()
    // formData.append('avatar', file)
    form.setFieldValue('profilePicture', file)
    // fetch("/api/upload-avatar", { method: "POST", body: formData })
  }

  const handleAvatarRemove = () => {
    console.log('Avatar removed')
  }

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
            <ImageUploader
              size={120}
              onComplete={handleAvatarComplete}
              onRemove={handleAvatarRemove}
              initialImageUrl={
                data.profilePicId
                  ? `${import.meta.env.VITE_BACKEND_URL}/client/participant/profile/${data.profilePicId}?size=thumbnail`
                  : null
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <form.AppField name="firstName">
                {(field) => <field.TextField label="First Name" placeholder="First name" />}
              </form.AppField>
              <form.AppField name="lastName">
                {(field) => <field.TextField label="Last Name" placeholder="Last name" />}
              </form.AppField>
            </div>
            <form.AppField name="emailId">
              {(field) => (
                <field.TextField className="w-full flex-1 shrink-0" label="Email ID" disabled placeholder="Email" />
              )}
            </form.AppField>
            <form.AppField name="mobileNo">
              {(field) => (
                <field.TextField
                  subLabel={
                    <div>
                      <Badge variant={'destructive'}>Not Verified</Badge>
                    </div>
                  }
                  label="Mobile No"
                  placeholder="Mobile no."
                />
              )}
            </form.AppField>
            <form.AppField name="dateOfBirth">
              {(field) => <field.DateField label="Date of Birth" placeholder="dd/MM/yyyy" />}
            </form.AppField>
            <form.AppField name="gender">
              {(field) => (
                <field.Select
                  label="Gender"
                  values={[
                    { label: 'Male', value: 'MALE' },
                    { label: 'Female', value: 'FEMALE' },
                    { label: 'Other', value: 'OTHER' },
                  ]}
                  placeholder="Select gender"
                />
              )}
            </form.AppField>
            <div className="grid grid-cols-3 gap-4">
              <form.AppField name="countryId">
                {(field) => <field.Select label="Country" values={countries || []} placeholder="Select Country" />}
              </form.AppField>
              <form.AppField name="stateId">
                {(field) => (
                  <field.Select label="State" values={states || []} disabled={!countryId} placeholder="Select State" />
                )}
              </form.AppField>
              <form.AppField name="city">
                {(field) => <field.TextField label="City" placeholder="City" disabled={!stateId} />}
              </form.AppField>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <form.AppForm>
            <form.SubscribeButton label="Update Profile" onClick={() => {}} />
          </form.AppForm>
        </CardFooter>
      </Card>
    </form>
  )
}

export { ProfileTab }
