import type { CreateIdeaRqDto } from '@/types'
import type { FetchIdeaProfileQuestionRsDto } from '@/types/idea-profile'

import { withForm } from '@/hooks/use-app-form'

import { QuestionResource } from './question-resource'

export const IdeaAnswerForm = withForm({
  defaultValues: {
    title: '',
    desc: '',
    invites: [],
    answers: [],
  } as CreateIdeaRqDto,
  props: {
    currentStep: 1,
    data: { data: [] } as FetchIdeaProfileQuestionRsDto,
  },
  render: ({ form, currentStep, data }) => {
    const QUESTIONS = data.data
    return (
      <form.AppField name="answers" mode="array">
        {(field) => {
          const [_first, ...rest] = field.state.value
          return (
            <div>
              {rest.map((_, index) => (
                <div key={`q-${index}`}>
                  {currentStep === index && (
                    <form.AppField name={`answers[${index + 1}].answer`}>
                      {(subField) => {
                        return (
                          <div>
                            <subField.TextArea
                              key={index + 1}
                              label={
                                <div className="flex items-center gap-2">
                                  <p>
                                    {index + 2}. {QUESTIONS[index + 1].name} *
                                  </p>
                                  <QuestionResource question={QUESTIONS[index + 1]} />
                                </div>
                              }
                              charCount={subField.state.value.length || 0}
                              rows={20}
                              className="min-h-30"
                              placeholder={'Enter your response...'}
                            />
                          </div>
                        )
                      }}
                    </form.AppField>
                  )}
                </div>
              ))}
            </div>
          )
        }}
      </form.AppField>
    )
  },
})
