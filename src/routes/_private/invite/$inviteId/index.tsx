import { useState } from 'react'

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { AlertCircleIcon, BadgeCheck, BadgeX, CircleCheck, Lightbulb, Send } from 'lucide-react'
import { toast } from 'sonner'

import type { TError } from '@/types'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Container } from '@/components/elements/container'
import { Confirmation } from '@/components/modals/confirmation'

import { UseUpdateInvite } from '@/api/ideas'
import { fetchInviteById } from '@/api/participant'

export const Route = createFileRoute('/_private/invite/$inviteId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { inviteId } = Route.useParams()
  const { data, refetch } = useSuspenseQuery(fetchInviteById(Number(inviteId)))
  const { updateInvite } = UseUpdateInvite()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleUpdate = async (acceptOrReject: 'accept' | 'reject') => {
    try {
      await updateInvite({ inviteId: Number(inviteId), acceptOrReject })
      toast.success('Success', { description: `Invitation ${acceptOrReject}ed.` })
      queryClient.invalidateQueries({ queryKey: ['ideas', 'list'] })
      refetch()
    } catch (error) {
      const err = error as AxiosError<TError>
      toast.error(
        err.response?.data.error?.message || 'Something went wrong. Please contact administrator or try again later.',
      )
    }
  }
  return (
    <Container title="Collaboration Invite">
      <Card>
        <CardHeader>
          <CardTitle>{data.idea?.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {data.acceptedAt ? (
            <div>
              <p>
                {data.status === 'ACCEPTED' ? (
                  <Alert variant="default">
                    <CircleCheck />
                    <AlertTitle>
                      You’ve accepted the collaboration invite — {data.invitedBy?.fullName} will be glad to have you
                      onboard! Let’s build something great together.
                    </AlertTitle>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>
                      You’ve declined the collaboration invite. {data.invitedBy?.fullName} will be notified, and they’ll
                      understand that you’re unable to join this time.
                    </AlertTitle>
                  </Alert>
                )}
              </p>
            </div>
          ) : (
            <div>
              <CardDescription>
                <Alert variant="default">
                  <Send />
                  <AlertTitle className="line-clamp-none">
                    {data.invitedBy?.fullName} ({data.invitedBy?.emailId}) has invited you to collaborate on this idea.
                    Your contribution and expertise will help move this idea forward—please review the details and join
                    the collaboration.
                  </AlertTitle>
                </Alert>
              </CardDescription>
            </div>
          )}
        </CardContent>
        <CardContent className="space-y-4 text-sm">
          {data.idea?.answers?.map((q, index) => {
            return (
              <div key={`question-${index}`} className="space-y-1">
                <p className="text-muted-foreground">
                  {index + 1}. {q.question.name}
                </p>
                <p className="ml-5">{q.answer}</p>
              </div>
            )
          })}
        </CardContent>
        {!data.acceptedAt ? (
          <CardFooter className="justify-end gap-2">
            <Button variant="destructive" onClick={() => setShowConfirmation(true)}>
              <BadgeX />
              Reject
            </Button>
            <Button onClick={() => handleUpdate('accept')}>
              <BadgeCheck />
              Accept
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="justify-end gap-2">
            <Button onClick={() => navigate({ to: '/idea/$ideaId', params: { ideaId: data.idea?.id || '' } })}>
              <Lightbulb />
              Start Collaborating
            </Button>
          </CardFooter>
        )}
      </Card>
      <Confirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Reject Collaboration Request"
        desc={<span>Are you sure you want to reject idea collaboration request?</span>}
        onClick={() => {
          setShowConfirmation(false)
          handleUpdate('reject')
        }}
      />
    </Container>
  )
}
