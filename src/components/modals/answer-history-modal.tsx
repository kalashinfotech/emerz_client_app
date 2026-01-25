import { Suspense, lazy, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Credenza, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle } from '@/components/ui/credenza'

import { fetchIdeaAnswerHistoryByActivityId } from '@/api/ideas'

type IdeaAnswerHistoryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ideaId: string
  ideaActivityId: number
}

// 🔥 Lazy-loaded diff viewer (NO git-diff imports here)
const IdeaAnswerDiffView = lazy(() => import('@/components/blocks/idea-answer-diff-view'))

export const IdeaAnswerHistoryModal = ({ open, onOpenChange, ideaId, ideaActivityId }: IdeaAnswerHistoryModalProps) => {
  const { data, isLoading } = useQuery(fetchIdeaAnswerHistoryByActivityId(ideaId, ideaActivityId))

  const rows = useMemo(() => {
    if (!data) return []

    return data.map((row) => ({
      id: row.id,
      question: row.question,
      unchanged: row.oldAnswer === row.answer,
      oldAnswer: row.oldAnswer,
      newAnswer: row.answer,
    }))
  }, [data])

  if (isLoading || !rows.length) return null

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className="max-h-[90%] overflow-y-auto p-8 sm:max-w-6xl">
        <CredenzaHeader>
          <CredenzaTitle>Answer History</CredenzaTitle>
          <CredenzaDescription>Changes made in this activity</CredenzaDescription>
        </CredenzaHeader>

        <div className="space-y-8">
          {rows.map((row) => (
            <div key={row.id} className="space-y-2">
              <h3 className="text-sm font-semibold">{row.question.name}</h3>

              {row.unchanged ? (
                <p className="text-muted-foreground text-xs italic">No change from previous answer</p>
              ) : (
                <Suspense fallback={null}>
                  <IdeaAnswerDiffView
                    questionId={row.question.id}
                    oldAnswer={row.oldAnswer ?? null}
                    newAnswer={row.newAnswer}
                  />
                </Suspense>
              )}
            </div>
          ))}
        </div>
      </CredenzaContent>
    </Credenza>
  )
}
