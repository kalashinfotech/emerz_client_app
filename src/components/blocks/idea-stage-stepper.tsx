import React from 'react'

import { ClipboardCheck, FileEdit, SearchCheck, ShieldCheck } from 'lucide-react'

import type { IdeaStageEnum, IdeaStatusEnum } from '@/lib/schemas/idea'
import { titleCase } from '@/lib/text-utils'

// Keep stage names in sync with your backend enum
export type IdeaStage = 'STAGE_0' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3'

const steps = [
  {
    key: 'STAGE_0' as IdeaStage,
    title: 'Draft',
    description: 'Idea is being drafted and can be edited before submission.',
    Icon: FileEdit,
  },
  {
    key: 'STAGE_1' as IdeaStage,
    title: 'Pre-Validation',
    description: 'Idea is submitted for initial review before moving forward.',
    Icon: SearchCheck,
  },
  {
    key: 'STAGE_2' as IdeaStage,
    title: 'Readiness',
    description: 'Idea is being checked for completeness and feasibility.',
    Icon: ClipboardCheck,
  },
  {
    key: 'STAGE_3' as IdeaStage,
    title: 'Validation',
    description: 'Idea undergoes final validation before completion.',
    Icon: ShieldCheck,
  },
]

type Props = {
  /** Current stage key (highlights this step and all previous as completed) */
  currentStage?: IdeaStageEnum
  currentStatus?: IdeaStatusEnum
  /** Optional: render compact (icon + title only) */
  compact?: boolean
  /** Optional className for outer wrapper */
  className?: string
}

/**
 * VerticalStepper
 * - shows a vertical timeline of stages with icons
 * - highlights completed / active / upcoming steps
 * - uses shadcn utility tokens (primary / muted)
 */
export function IdeaStatusStepper({
  currentStage = 'STAGE_0',
  currentStatus = 'IN_PROGRESS',
  compact = false,
  className = '',
}: Props) {
  const currentIndex = steps.findIndex((s) => s.key === currentStage)

  return (
    <ol className={`relative pl-8 ${className}`}>
      {steps.map((s, idx) => {
        const isCompleted = idx < currentIndex
        const isActive = idx === currentIndex
        const Icon = s.Icon as React.ComponentType<React.SVGProps<SVGSVGElement>>

        return (
          <li key={s.key} className="relative z-0 mb-8 last:mb-0">
            {/* vertical connector - centered through the icon */}
            <span
              className={`absolute top-9 left-5 -z-10 h-full w-px ${idx < steps.length - 1 ? 'block' : 'hidden'}`}
              aria-hidden
              // subtle color for the line: primary for completed/active portion, muted for upcoming
              style={{
                background:
                  isCompleted || isActive
                    ? 'linear-gradient(to bottom, var(--primary) 0%, rgba(0,0,0,0.09) 100%)'
                    : '#EEEEEE',
              }}
            />

            <div className="flex items-start gap-3">
              <div className="relative z-20 flex flex-col items-center">
                <div
                  className={`flex size-10 items-center justify-center rounded-full border p-2 ${
                    isCompleted || isActive
                      ? 'border-primary bg-primary text-background'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.title}
                  </h4>
                  {isCompleted && (
                    <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
                      Completed
                    </span>
                  )}
                  {isActive && (
                    <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
                      {titleCase(currentStatus, '_')}
                    </span>
                  )}
                </div>

                {!compact && <p className="text-muted-foreground mt-1 text-xs">{s.description}</p>}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// Example usage:
// <VerticalStepper currentStage="READINESS" />
// <VerticalStepper currentStage="PRE_VALIDATION" compact />
