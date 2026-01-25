import { useMemo } from 'react'

import { generateDiffFile } from '@git-diff-view/file'
import { DiffModeEnum, DiffView } from '@git-diff-view/react'
import '@git-diff-view/react/styles/diff-view-pure.css'

type Props = {
  oldAnswer: string | null
  newAnswer: string
  questionId: number
}

export default function IdeaAnswerDiffView({ oldAnswer, newAnswer, questionId }: Props) {
  const file = useMemo(() => {
    const f = generateDiffFile(
      `question-${questionId}-old.txt`,
      oldAnswer ?? '',
      `question-${questionId}-new.txt`,
      newAnswer,
      'plaintext',
      'plaintext',
    )

    f.initTheme('dark')
    f.init()
    f.buildUnifiedDiffLines()
    return f
  }, [oldAnswer, newAnswer, questionId])

  return (
    <DiffView
      diffViewHighlight={false}
      diffFile={file}
      diffViewMode={DiffModeEnum.Unified}
      diffViewFontSize={12}
      diffViewWrap={true}
    />
  )
}
