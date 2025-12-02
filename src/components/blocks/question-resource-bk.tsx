import { Info } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '../ui/button'

type QuestionResourceProps = {
  question: {
    name: string
    desc?: string
    minLength?: number | null
    maxLength?: number | null
  }
}

const QuestionResource = ({ question }: QuestionResourceProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-140 px-6 text-xs">
        <ul className="list-disc space-y-2">
          <li>{question.desc}</li>
          <li>Minimum response length {question.minLength} characters</li>
          <li>Maximum response length {question.maxLength} characters</li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export { QuestionResource }
