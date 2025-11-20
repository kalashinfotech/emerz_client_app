import { useState } from 'react'

import { useStore } from '@tanstack/react-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { Check, ChevronLeft, ChevronRight, CircleAlertIcon, Lightbulb, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { CreateIdeaRqDto, TError } from '@/types'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { IdeaAnswerForm } from '@/components/blocks/idea-profile-questions-add-form'
import { QuestionResource } from '@/components/blocks/question-resource'
import { Container } from '@/components/elements/container'
import { IconWrapper } from '@/components/elements/icon-wrapper'
import { Confirmation } from '@/components/modals/confirmation'

import { fetchIdeaProfileQuestions } from '@/api/idea-profile'
import { UseCreateIdea } from '@/api/ideas'

import { useAppForm } from '@/hooks/use-app-form'
import { useAuth } from '@/hooks/use-auth'

import { createIdeaRqSchema } from '@/lib/schemas/idea'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_private/idea/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const { sessionInfo } = useAuth()
  const { createIdea } = UseCreateIdea()
  const { data } = useSuspenseQuery(fetchIdeaProfileQuestions(true))
  const { queryClient } = Route.useRouteContext()
  const [step, setStep] = useState<number>(0)
  const [subStep, setSubStep] = useState<number>(0)
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()
  const QUESTIONS = data.data
  const profileIncomplete = (sessionInfo?.completionPercentage ?? 0) < 100

  const answersArray = Array.from(QUESTIONS, (question, __) => {
    return { answer: '', questionId: question.id }
  })
  const form = useAppForm({
    defaultValues: {
      title: '',
      desc: '',
      invites: [],
      answers: answersArray,
    } as CreateIdeaRqDto,
    validators: {
      onSubmit: createIdeaRqSchema,
      onMount: createIdeaRqSchema,
      onChange: createIdeaRqSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { id } = await createIdea({ request: value })
        toast.success('Success!', {
          description: 'New idea created successfully.',
        })
        queryClient.invalidateQueries({ queryKey: ['ideas', 'list'] })
        router.navigate({ to: '/idea/$ideaId', params: { ideaId: id.toString() } })
      } catch (error) {
        const err = error as AxiosError<TError>
        toast.error(err.response?.data.error.message)
      }
    },
  })
  const title = useStore(form.store, (state) => state.values.title)
  const titleMeta = useStore(form.store, (state) => state.fieldMeta.title)
  const formErrors = useStore(form.store, (state) => state.errors)
  console.log(formErrors)

  const handleNext = () => {
    // Bounds check
    if (step >= totalSteps) {
      console.error('Cannot go beyond last step.')
      return
    }
    const isCurrentStepValid = (currentStep: number): boolean => {
      if (currentStep === 0) {
        const key = `answers[0].answer`
        const firstErr = formErrors[0]
        let er = false
        if (titleMeta.errors.length) {
          form.validateField('title', 'submit')
          er = true
        }
        if (firstErr && Object.prototype.hasOwnProperty.call(firstErr, key)) {
          form.validateField(`answers[${currentStep}].answer`, 'submit')
          er = true
        }
        if (er) return false
        return true
      }
      const key = `answers[${subStep + 1}].answer`
      const firstErr = formErrors[0]

      if (firstErr && Object.prototype.hasOwnProperty.call(firstErr, key)) {
        form.validateField(`answers[${subStep + 1}].answer`, 'submit')
        return false
      }

      return true
    }
    if (!isCurrentStepValid(step)) return

    if (step === 1 && subStep < totalSubSteps - 1) {
      setSubStep((prev) => prev + 1)
    } else if (step === 1 && subStep === totalSubSteps - 1) {
      setSubStep((prev) => prev + 1)
      setStep((prev) => prev + 1)
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (step <= 0) {
      console.error('Cannot go before first step.')
      return
    }
    if (step === 1 && subStep > 0) {
      setSubStep((prev) => prev - 1)
    } else if (step === totalSteps - 1) {
      setSubStep(totalSubSteps - 1)
      setStep((prev) => prev - 1)
    } else {
      setStep((prev) => prev - 1)
    }
  }

  const totalSteps = 3
  const totalSubSteps = QUESTIONS.length - 1

  return (
    <Container title="Idea" subtitle="Create">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}>
        <Card className="w-full border md:w-[700px]">
          <CardHeader>
            <CardTitle className="mb-2">
              <IconWrapper icon={Lightbulb} className="bg-yellow-500" />
            </CardTitle>
            {step === 0 ? (
              <CardDescription>Start by naming your idea in a way that captures its essence.</CardDescription>
            ) : step === 1 ? (
              <CardDescription>
                Describe the problem it solves or the opportunity it unlocks — keep it simple and impactful.
              </CardDescription>
            ) : (
              <CardDescription>
                Invite teammates, mentors, or friends you’d like to collaborate with on your idea.
              </CardDescription>
            )}

            <CardDescription className="mx-auto flex w-full items-center gap-1 py-4">
              <p
                className={cn(
                  'bg-primary text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs',
                  { 'bg-primary size-8': step === 0 },
                )}>
                {step === 0 ? 1 : <Check className="size-4" />}
              </p>
              <Progress value={(step / 1) * 100} className="bg-muted h-0.5" indicatorClassName="bg-primary" />
              <p
                className={cn(
                  'bg-primary text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs',
                  { 'bg-muted text-muted-foreground': step < 1 },
                  { 'bg-primary size-8': step === 1 },
                )}>
                {step <= 1 && subStep === 0 ? 2 : <Check className="size-4" />}
              </p>
              <Progress
                value={(subStep / totalSubSteps) * 100}
                className="bg-muted h-0.5"
                indicatorClassName="bg-primary"
              />
              <p
                className={cn(
                  'bg-primary text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs',
                  { 'bg-muted text-muted-foreground': step !== 2 },
                  { 'bg-primary size-8': step === 2 },
                )}>
                3
              </p>
            </CardDescription>
          </CardHeader>
          {step === 0 && (
            <CardContent className="space-y-6">
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    maxLength={100}
                    minLength={10}
                    charCount={title.length || 0}
                    label="Title"
                    placeholder="Enter a short title for your idea"
                    mandatory={true}
                  />
                )}
              </form.AppField>
              <form.AppField name={`answers[${0}].answer`}>
                {(subField) => {
                  return (
                    <subField.TextArea
                      label={
                        <div className="flex items-center gap-2">
                          <p>1. {QUESTIONS[0].name} *</p>
                          <QuestionResource question={QUESTIONS[0]} />
                        </div>
                      }
                      charCount={subField.state.value.length || 0}
                      rows={20}
                      className="min-h-30"
                      placeholder={'Enter your response...'}
                    />
                  )
                }}
              </form.AppField>
            </CardContent>
          )}
          {step == 1 && (
            <CardContent>
              <IdeaAnswerForm form={form} currentStep={subStep} data={data} />
            </CardContent>
          )}
          {step === 2 && (
            <CardContent>
              <form.AppField name="invites">
                {(field) => (
                  <field.Tags
                    label="Collaborators"
                    placeholder="Enter one or more email addresses, separated by commas."
                    note="Invite people who can help shape your idea. Each collaborator will get an invitation to join."
                  />
                )}
              </form.AppField>
            </CardContent>
          )}
          <CardFooter>
            <div className="mt-2 w-full">
              {step === totalSteps - 1 ? (
                <div className="flex justify-between">
                  <Button type="button" variant="cancel" onClick={handlePrev} disabled={step <= 0}>
                    <ChevronLeft />
                    Back
                  </Button>
                  <form.AppForm>
                    <form.SubscribeButton icon={PlusIcon} label="Create" onClick={() => setShowDialog(true)} />
                  </form.AppForm>
                </div>
              ) : (
                <div className="flex justify-between">
                  <Button type="button" variant="cancel" onClick={handlePrev} disabled={step <= 0}>
                    <ChevronLeft />
                    Back
                  </Button>
                  <Button type="button" variant={'default'} onClick={handleNext} disabled={profileIncomplete}>
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
        {profileIncomplete && (
          <div className="mt-4">
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertTitle>
                Your profile is not complete. You must complete your profile to start creating ideas.
              </AlertTitle>
              <AlertTitle>
                Click{' '}
                <span className="underline underline-offset-3">
                  <Link to="/settings">here</Link>
                </span>{' '}
                to complete your profile.
              </AlertTitle>
            </Alert>
          </div>
        )}
        <Confirmation
          open={showDialog}
          onOpenChange={setShowDialog}
          title="Confirm Idea Creation"
          desc={
            <span>
              You’re about to create a new idea on the Emerz platform. It will be saved as a <strong>draft</strong>. You
              can later submit it for pre-validation from the idea’s menu in the sidebar.
            </span>
          }
          onClick={() => {
            setShowDialog(false)
            form.handleSubmit()
          }}
        />
      </form>
    </Container>
  )
}
