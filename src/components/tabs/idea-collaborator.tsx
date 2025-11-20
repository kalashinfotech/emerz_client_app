import { useState } from 'react'

import type { AxiosError } from 'axios'
import { Loader2, Plus, Send, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import type { IdeaModel, TError } from '@/types'

import { UseDeleteCollaborator, UseResendIdeaInvite } from '@/api/ideas'

import { useAuth } from '@/hooks/use-auth'

import { AddCollaboratorsModal } from '../modals/add-collaborators'
import { Confirmation } from '../modals/confirmation'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const CollabHeader = ({ isOwner }: { isOwner: boolean }) => {
  if (isOwner) {
    return (
      <div className="grid grid-cols-3 font-medium">
        <p>Email</p>
        <p>Role</p>
        <p>Invite</p>
      </div>
    )
  } else {
    return (
      <div className="grid grid-cols-2 font-medium">
        <p>Email</p>
        <p>Role</p>
      </div>
    )
  }
}

const CollabItem = ({
  emailId,
  designation,
  status,
  statusVariant,
  isOwner,
  resendAction,
  resendIsActive,
  resendIsPending,
  deleteAction,
  deleteIsActive,
  deleteIsPending,
}: {
  emailId: string
  designation?: string
  status: string
  statusVariant: 'success' | 'destructive' | 'ok' | 'warning'
  isOwner: boolean
  resendAction?: () => void
  resendIsActive?: boolean
  resendIsPending?: boolean
  deleteAction?: () => void
  deleteIsActive?: boolean
  deleteIsPending?: boolean
}) => {
  if (isOwner) {
    return (
      <div className="grid grid-cols-3">
        <p>{emailId}</p>
        <p>{designation}</p>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant} className="w-40">
            {status.replaceAll('_', ' ')}
          </Badge>
          {designation !== 'Owner' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="hover:text-destructive h-fit py-0.5 text-xs hover:bg-transparent"
                  disabled={deleteIsPending}
                  variant="ghost"
                  onClick={deleteAction}>
                  {deleteIsActive ? <Loader2 className="animate-spin" /> : <Trash2 />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-destructive" iconClassName="bg-destructive fill-destructive">
                Remove
              </TooltipContent>
            </Tooltip>
          )}
          {designation !== 'Owner' && resendAction && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-fit py-0.5 text-xs hover:bg-transparent"
                  disabled={resendIsPending}
                  variant="ghost"
                  onClick={resendAction}>
                  {resendIsActive ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resend Invite</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div className="grid grid-cols-2">
        <p>{emailId}</p>
        <p>{designation || 'Collaborator'}</p>
      </div>
    )
  }
}

type IdeaCollaboratorTabProps = {
  idea: IdeaModel
  refetch: () => void
}

const IdeaCollaboratorTab = ({ idea, refetch }: IdeaCollaboratorTabProps) => {
  const { sessionInfo } = useAuth()
  const { isPending, resendInvite } = UseResendIdeaInvite(idea.id)
  const { isPending: isDeletePending, deleteCollaborator } = UseDeleteCollaborator(idea.id)
  const [selectedId, setSelectedId] = useState<number | string>()
  const [openCollabModal, setOpenCollabModal] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const handeDelete = async (collaboratorId: number) => {
    try {
      setSelectedId(collaboratorId)
      await deleteCollaborator({ collaboratorId })
      toast.success('Success', {
        description: 'User removed successfully.',
      })
      refetch()
    } catch (error) {
      const err = error as AxiosError<TError>
      toast.error('Failed', {
        description: err.response?.data.error.message || 'Something went wrong! Please try again after sometime.',
      })
    } finally {
      setSelectedId(undefined)
    }
  }
  const handleResendInvite = async (inviteId: number) => {
    try {
      setSelectedId(inviteId)
      await resendInvite({ inviteId })
      toast.success('Success', {
        description: 'Invite sent successfully.',
      })
    } catch (error) {
      const err = error as AxiosError<TError>
      toast.error('Message failed', {
        description: err.response?.data.error.message || 'Something went wrong! Please try again after sometime.',
      })
    } finally {
      setSelectedId(undefined)
    }
  }
  const isOwner = idea.ownerId === sessionInfo?.id
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Idea Partners</CardTitle>
          {isOwner ? (
            <CardDescription>
              View existing collaborators, add new ones to your ideas, or remove those who no longer need access. Use this
              section to keep your team updated and control who can contribute to your idea.
            </CardDescription>
          ) : (
            <CardDescription>View collaborators for the idea.</CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-1.5">
            <CollabHeader isOwner={isOwner} />
            <Separator />
            {idea.collaborators?.map((collab, index) => {
              const variant =
                collab.status === 'PENDING' ? 'destructive' : collab.status === 'ACCEPTED_SHADOW' ? 'ok' : 'success'
              return (
                <CollabItem
                  key={`collab-${index}`}
                  emailId={collab.emailId}
                  designation={collab.designation}
                  status={collab.status}
                  statusVariant={variant}
                  isOwner={isOwner}
                  resendAction={() => handleResendInvite(collab.id)}
                  resendIsActive={isPending && selectedId === collab.participant?.id}
                  resendIsPending={isPending}
                  deleteAction={() => handeDelete(collab.id)}
                  deleteIsActive={isDeletePending && selectedId === collab.participant?.id}
                  deleteIsPending={isDeletePending}
                />
              )
            })}
          </div>
        </CardContent>
        {isOwner && (
          <CardFooter>
            <Button onClick={() => setOpenCollabModal(true)}>
              <Plus />
              Invite Collaborators
            </Button>
          </CardFooter>
        )}
      </Card>
      <AddCollaboratorsModal
        open={openCollabModal}
        onOpenChange={setOpenCollabModal}
        ideaId={idea.id}
        postUpdate={refetch}
      />
      <Confirmation open={openConfirm} onOpenChange={setOpenConfirm} loading={isDeletePending} onClick={() => {}} />
    </>
  )
}

export { IdeaCollaboratorTab }
