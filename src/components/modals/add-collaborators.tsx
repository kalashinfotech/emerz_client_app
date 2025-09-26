import React from 'react'

import type { AxiosError } from 'axios'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

import type { CreateIdeaInvitesRqDto, TError } from '@/types'

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'

import { UseCreateIdeaInvites } from '@/api/ideas'

import { useAppForm } from '@/hooks/use-app-form'

import { createIdeaInvitesRqSchema } from '@/lib/schemas/idea'

type AddCollaboratorsModalProps = {
  ideaId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  postUpdate?: () => void
}

export const AddCollaboratorsModal: React.FC<AddCollaboratorsModalProps> = ({
  ideaId,
  open,
  onOpenChange,
  postUpdate,
}) => {
  const { createInvites } = UseCreateIdeaInvites(ideaId)
  const form = useAppForm({
    defaultValues: {
      invites: [],
    } as CreateIdeaInvitesRqDto,
    validators: { onMount: createIdeaInvitesRqSchema, onSubmit: createIdeaInvitesRqSchema },
    onSubmit: async ({ value }) => {
      try {
        await createInvites({ request: value })
        toast.success('Success', {
          description: 'Collaboration invite sent successfully.',
        })
        form.reset()
        onOpenChange(false)
        if (postUpdate) postUpdate()
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error('Message failed', {
          description: err.response?.data.error.message || 'Something went wrong! Please try again after sometime.',
        })
      }
    },
  })

  if (!open) return null

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="bg-card">
        <CredenzaHeader>
          <CredenzaTitle>Add Collaborators</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaDescription>Add collaborators to join your idea.</CredenzaDescription>
        <CredenzaBody className="text-sm">
          <form
            className="flex flex-col space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}>
            <form.AppField name="invites">
              {(field) => (
                <field.Tags
                  placeholder="john.smith@example.com"
                  note="Type or paste in emails below, separated by commas"
                />
              )}
            </form.AppField>
            <div className="mt-3 flex items-center justify-end gap-2">
              <form.AppForm>
                <form.ResetButton icon={X} />
              </form.AppForm>
              <form.AppForm>
                <form.SubscribeButton label="Add to idea" icon={Plus} />
              </form.AppForm>
            </div>
          </form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
