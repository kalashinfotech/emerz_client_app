import { useEffect } from 'react'

import { useStore } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { BadgeCheck, SquircleDashed } from 'lucide-react'
import { toast } from 'sonner'

import type { TError } from '@/types'
import type { CreateBivrAnswerRqDto } from '@/types/idea-bivr'

import { UseCreateBivrAnswers, fetchIdeaBivrGroupById } from '@/api/idea-bivr'

import { useAppForm } from '@/hooks/use-app-form'

import { createBivrAnswersRqSchema } from '@/lib/schemas/idea-bivr'

import { Loader } from '../elements/loader'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { QuestionResource } from './question-resource'

type FormMeta = {
  isDraft: boolean
}

const defaultMeta: FormMeta = {
  isDraft: true,
}

type BivrGroupProps = {
  ideaId: string
  groupId: number
  setIsDirty: (isDirty: boolean) => void
}

export const BivrGroup = ({ ideaId, groupId, setIsDirty }: BivrGroupProps) => {
  const { createAnswers } = UseCreateBivrAnswers(ideaId, groupId)
  const { data: group, isLoading } = useQuery(fetchIdeaBivrGroupById(ideaId, groupId))

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
        await createAnswers({ request: value, isDraft: meta.isDraft })
        setIsDirty(false)
        toast.success('Saved')
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(err.response?.data.error.message || 'Save failed')
      }
    },
  })

  const isDirty = useStore(form.store, (state) => state.isDirty)
  useEffect(() => {
    setIsDirty(isDirty)
  }, [isDirty])

  if (isLoading) return <Loader />
  if (!group) return null // just for type safety

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
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
              />
              <form.SubscribeButton
                label="Submit"
                icon={BadgeCheck}
                onClick={() => form.handleSubmit({ isDraft: false })}
              />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
