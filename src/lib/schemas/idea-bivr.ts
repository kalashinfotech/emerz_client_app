import { z } from 'zod/v4'

import { ideaCollaborationSchema } from './idea'

const bivrAnswersSchema = z.object({
  id: z.int(),
  answer: z.string(),
  answeredAt: z.date(),
  collaborator: ideaCollaborationSchema.nullable(),
})

const bivrQuestionSchema = z.object({
  id: z.int(),
  name: z.string(),
  desc: z.string(),
  subType: z.string(),
  priority: z.int(),
  minLength: z.int().optional().nullable(),
  maxLength: z.int().optional().nullable(),
  answer: bivrAnswersSchema.optional().nullable(),
})

export const bivrAnswerSchema = z.object({
  id: z.int(),
  name: z.string(),
  priority: z.int(),
  questions: z.array(bivrQuestionSchema),
})

export const fetchBivrGroupListRsSchema = z
  .object({
    id: z.int(),
    name: z.string(),
    priority: z.int(),
  })
  .array()

export const createBivrAnswersRqSchema = z.object({
  data: z.array(
    z.object({
      id: z.int().optional(),
      questionId: z.int(),
      answerText: z.string(),
    }),
  ),
})

export const fetchBivrAnswersRsSchema = bivrAnswerSchema
