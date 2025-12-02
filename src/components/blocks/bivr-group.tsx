import { useEffect, useState } from 'react'

import { useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { BadgeCheck, SquircleDashed } from 'lucide-react'
import { toast } from 'sonner'

import type { IdeaModel, TError } from '@/types'
import type { CreateBivrAnswerRqDto } from '@/types/idea-bivr'

import { UseCreateBivrAnswers, fetchIdeaBivrGroupById } from '@/api/idea-bivr'

import { useAppForm } from '@/hooks/use-app-form'

import { IdeaStageEnum, IdeaStatusEnum } from '@/lib/enums'
import { createBivrAnswersRqSchema } from '@/lib/schemas/idea-bivr'

import { Loader } from '../elements/loader'
import { Confirmation } from '../modals/confirmation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { QuestionResource } from './question-resource'

type FormMeta = {
  isDraft: boolean
}

const defaultMeta: FormMeta = {
  isDraft: true,
}

type BivrGroupProps = {
  ideaId: string
  idea: IdeaModel
  groupId: number
  setIsDirty: (isDirty: boolean) => void
  setActiveTab: (tab: string) => void
  errorMap?: any
  setAllErrorsMap: (errs: any) => void
  refetchIdea: () => void
}

export const BivrGroup = ({
  ideaId,
  idea,
  groupId,
  setIsDirty,
  setActiveTab,
  errorMap,
  setAllErrorsMap,
  refetchIdea,
}: BivrGroupProps) => {
  const { createAnswers } = UseCreateBivrAnswers(ideaId, groupId)
  const [showDialog, setShowDialog] = useState(false)
  const { data: group, isLoading } = useQuery(fetchIdeaBivrGroupById(ideaId, groupId))
  const allowed = idea.stage === IdeaStageEnum.STAGE_2 && idea.status === IdeaStatusEnum.IN_PROGRESS

  const form = useAppForm({
    defaultValues: {
      data:
        group?.questions.map((q) => ({
          id: q.answer?.id,
          questionId: q.id,
          answerText: q.answer?.answer || '',
        })) ?? [],
    } as CreateBivrAnswerRqDto,
    onSubmitMeta: defaultMeta,
    validators: { onSubmit: createBivrAnswersRqSchema },
    onSubmit: async ({ value, meta }) => {
      try {
        const d = await createAnswers({ request: value, isDraft: meta.isDraft })
        setIsDirty(false)
        const formattedData = d.questions.map((q) => ({
          id: q.answer?.id,
          questionId: q.id,
          answerText: q.answer?.answer || '',
        }))
        form.setFieldValue('data', formattedData)
        toast.success(meta.isDraft ? 'BIVR draft saved successfully.' : 'BIVR submitted successfully.')
        refetchIdea()
      } catch (error) {
        const err = error as AxiosError<TError>
        const info = err.response?.data.error?.info
        if (info) {
          const g = info['errorGroup'] ?? null
          setAllErrorsMap(g)
          if (g && Object.keys(g).length > 0) {
            const gid = Object.keys(g)[0]
            setActiveTab(`group-${gid}`)
          }
        }
        toast.error(err.response?.data.error?.message || 'Save failed')
      }
    },
  })

  const isDirty = useStore(form.store, (state) => state.isDirty)
  useEffect(() => {
    setIsDirty(isDirty)
  }, [isDirty])

  useEffect(() => {
    if (!errorMap) return
    form.setErrorMap({
      onSubmit: { fields: errorMap },
    })
    console.log('validating all fields')
    form.validateAllFields('submit')
  }, [errorMap, form])

  if (isLoading) return <Loader />
  if (!group) return null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          {!allowed && (
            <CardDescription>
              Idea details can no longer be edited since it is in <em>{idea.stage.replaceAll('_', ' ')}</em> stage.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <form.AppField name="data" mode="array">
              {(field) => (
                <div className="space-y-12">
                  {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    field.state.value &&
                      field.state.value.map((ans, index) => (
                        <form.AppField name={`data[${index}].answerText`} key={index}>
                          {(subField) => {
                            const quest = group.questions.find((q) => q.id === ans.questionId)
                            return (
                              <subField.TextArea
                                maxLength={quest?.maxLength || 500}
                                // label={quest?.name || ''}
                                label={
                                  <div className="flex items-center gap-2">
                                    <p>
                                      {index + 1}. {quest?.name} *
                                    </p>
                                    <QuestionResource question={quest!} />
                                  </div>
                                }
                                charCount={subField.state.value ? subField.state.value.length : 0}
                                rows={20}
                                className="min-h-24"
                                placeholder={'Enter your response...'}
                                disabled={!allowed}
                              />
                            )
                          }}
                        </form.AppField>
                      ))
                  }
                </div>
              )}
            </form.AppField>
            <div className="mt-3 flex items-center justify-end gap-2">
              <form.AppForm>
                <form.SubscribeButton
                  variant="secondary"
                  label="Save Draft"
                  icon={SquircleDashed}
                  onClick={() => form.handleSubmit({ isDraft: true })}
                  disabled={!allowed}
                />
                <form.SubscribeButton
                  label="Submit"
                  icon={BadgeCheck}
                  onClick={() => setShowDialog(true)}
                  disabled={!allowed}
                />
              </form.AppForm>
            </div>
          </form>
        </CardContent>
      </Card>
      <Confirmation
        open={showDialog}
        onOpenChange={setShowDialog}
        title="Submit Idea"
        desc={
          <span>
            You’re about to submit this idea for <strong>readiness validation</strong>. Once submitted, the idea will
            enter the approval process and <strong>its details can no longer be changed</strong>. Review your information
            carefully before continuing.
          </span>
        }
        onClick={() => {
          setShowDialog(false)
          form.handleSubmit({ isDraft: false })
        }}
      />
    </>
  )
}
