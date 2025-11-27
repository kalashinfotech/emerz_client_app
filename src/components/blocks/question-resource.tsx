import { Info } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-140 px-6 text-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">Information</DialogTitle>
          <DialogDescription className="text-sm">{question.name}</DialogDescription>
        </DialogHeader>
        <ul className="list-disc space-y-2 text-xs">
          <li>{question.desc}</li>
          <li>Minimum response length {question.minLength} characters</li>
          <li>Maximum response length {question.maxLength} characters</li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export { QuestionResource }
