import { useState } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { format } from 'date-fns'
import { BadgeCheck, Edit3, HouseIcon, NotebookText, PencilOff, SquircleDashed, Users2 } from 'lucide-react'
import { toast } from 'sonner'

import type { TError, UpdateIdeaRqDto } from '@/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { BivrPage } from '@/components/blocks/bivr-page'
import { IdeaStatusStepper } from '@/components/blocks/idea-stage-stepper'
import { QuestionResource } from '@/components/blocks/question-resource'
import { Container } from '@/components/elements/container'
import { Confirmation } from '@/components/modals/confirmation'
import { IdeaCollaboratorTab } from '@/components/tabs/idea-collaborator'

import { UseUpdateIdea, fetchIdeaById } from '@/api/ideas'

import { useAppForm } from '@/hooks/use-app-form'

import { IdeaStageEnum, IdeaStatusEnum, updateIdeaRqSchema } from '@/lib/schemas/idea'

type FormMeta = {
  isDraft: boolean
}

const defaultMeta: FormMeta = {
  isDraft: true,
}

export const Route = createFileRoute('/_private/idea/$ideaId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { ideaId } = Route.useParams()
  const { data, refetch } = useSuspenseQuery(fetchIdeaById(ideaId))
  const { updateIdea } = UseUpdateIdea(ideaId)
  const [edit, setEdit] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const form = useAppForm({
    defaultValues: {
      title: data.title,
      desc: data.desc,
      answers: data.answers?.map((ans) => ({
        id: ans.id,
        questionId: ans.question.id,
        answer: ans.answer,
      })),
    } as UpdateIdeaRqDto,
    onSubmitMeta: defaultMeta,
    validators: {
      onSubmit: updateIdeaRqSchema,
      onMount: updateIdeaRqSchema,
      onChange: updateIdeaRqSchema,
    },
    onSubmit: async ({ value, meta }) => {
      try {
        await updateIdea({ request: value, isDraft: meta.isDraft })
        const msg = meta.isDraft
          ? 'Idea details updated successfully.'
          : 'Idea sent for pre-validation stage. You will be notified of any progress.'
        toast.success('Success', {
          description: msg,
        })
        refetch()
        // router.navigate({ to: '/idea/$ideaId', params: { ideaId: id.toString() } })
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(
          err.response?.data.error?.message || 'Something went wrong. Please contact administrator or try again later.',
        )
      }
    },
  })
  const isDraft =
    data.stage === IdeaStageEnum.STAGE_0 ||
    (data.stage === IdeaStageEnum.STAGE_1 && data.status === IdeaStatusEnum.IN_PROGRESS)
  const totalCollaborators = data.collaborators?.length
  return (
    <>
      <Container title="Idea" subtitle={data.title} className="w-full px-8 sm:px-16">
        <Tabs className="w-full" defaultValue="overview">
          <TabsList className="text-foreground mb-3 h-auto w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1">
            <TabsTrigger
              value="overview"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative flex-0 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <HouseIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="collaborators"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative flex-0 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Users2 className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Team
              <Badge className="min-w-5 px-1 text-[0.6rem]">{totalCollaborators}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="bivr"
              hidden={data.stage !== 'STAGE_2'}
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative flex-0 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <NotebookText className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              BIVR
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="flex h-fit flex-col-reverse gap-4 md:flex-row md:gap-4">
              <form
                className="md:w-[80%]"
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-0">
                        <form.AppField name="title">
                          {(field) => (
                            <field.TextFieldNoLabel
                              className={
                                'disabled:text-foreground disabled:border-transparent disabled:bg-transparent disabled:opacity-100'
                              }
                              size={data.title.length || 1}
                              maxLength={100}
                              minLength={10}
                              placeholder="Enter a short title for your idea"
                              disabled={!edit || !isDraft}
                            />
                          )}
                        </form.AppField>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="hover:bg-transparent"
                          disabled={!isDraft}
                          onClick={() => setEdit((prev) => !prev)}>
                          {isDraft ? <Edit3 /> : <PencilOff />}
                        </Button>
                      </div>
                      <Badge variant="destructive">{data.stage.replaceAll('_', ' ')}</Badge>
                    </CardTitle>
                    {!isDraft && (
                      <CardDescription className="ml-2">
                        Idea details can no longer be edited since it is in <em>{data.stage.replaceAll('_', ' ')}</em>{' '}
                        stage.
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <form.AppField name="answers" mode="array">
                      {(field) => {
                        const [...rest] = field.state.value
                        return (
                          <div className="space-y-3">
                            {rest.map((_, aindex) => (
                              <div key={`q-${aindex}`}>
                                <form.AppField name={`answers[${aindex}].answer`}>
                                  {(subField) => {
                                    const question = data.answers?.[aindex].question
                                    return (
                                      <div>
                                        <subField.TextArea
                                          key={aindex}
                                          label={
                                            <div className="flex items-center gap-2">
                                              <p>
                                                {aindex + 1}. {question!.name} *
                                              </p>
                                              <QuestionResource question={question!} />
                                            </div>
                                          }
                                          // charCount={subField.state.value.length || 0}
                                          className="min-h-24"
                                          minLength={question!.minLength || 200}
                                          placeholder="Place holder"
                                          disabled={!isDraft}
                                        />
                                      </div>
                                    )
                                  }}
                                </form.AppField>
                              </div>
                            ))}
                          </div>
                        )
                      }}
                    </form.AppField>
                  </CardContent>
                  <CardContent className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium uppercase">Creation Date</p>
                      <p>{format(data.createdAt, 'dd/MM/yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium uppercase">Created By</p>
                      <p>
                        {data.owner.fullName} ({data.owner.emailId})
                      </p>
                    </div>
                  </CardContent>
                  {isDraft && (
                    <CardFooter className="justify-end gap-4">
                      <form.AppForm>
                        <form.SubscribeButton
                          variant="secondary"
                          label="Save Draft"
                          icon={SquircleDashed}
                          onClick={() => form.handleSubmit({ isDraft: true })}
                        />
                      </form.AppForm>

                      <form.AppForm>
                        <form.SubscribeButton
                          label="Submit"
                          icon={BadgeCheck}
                          onClick={() => setShowConfirmation(true)}
                        />
                      </form.AppForm>
                    </CardFooter>
                  )}
                </Card>
                <Confirmation
                  open={showConfirmation}
                  onOpenChange={setShowConfirmation}
                  title="Submit Idea for Pre-Validation"
                  desc={
                    <span>
                      You’re about to submit this idea for <strong>pre-validation</strong>. Once submitted, the idea will
                      enter the approval process and <strong>its details can no longer be changed</strong>. Review your
                      information carefully before continuing.
                    </span>
                  }
                  onClick={() => {
                    setShowConfirmation(false)
                    form.handleSubmit({ isDraft: false })
                  }}
                />
              </form>
              <IdeaStatusStepper currentStage={data.stage} currentStatus={data.status} className="max-w-80" />
            </div>
          </TabsContent>
          <TabsContent value="collaborators">
            <IdeaCollaboratorTab idea={data} refetch={refetch} />
          </TabsContent>
          <TabsContent value="bivr">
            <BivrPage ideaId={ideaId} idea={data} refetch={refetch} />
          </TabsContent>
        </Tabs>
      </Container>
    </>
  )
}
