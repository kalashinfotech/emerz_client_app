import { z } from 'zod/v4'

export const baseIdeaProfileQuestionSchema = z.object({
  name: z.string().min(10),
  desc: z.string().min(10).optional(),
  priority: z.int().gte(1).optional(),
  minLength: z.int().gte(0).optional().nullable(),
  maxLength: z.int().gte(0).optional().nullable(),
})

const ideaProfileQuestionSchema = baseIdeaProfileQuestionSchema.extend({
  id: z.number(),
})

export const baseIdeaProfileAnswerSchema = z.object({
  answer: z.string().min(200, 'Response should contain at least 200 characters.'),
})

export const ideaProfileAnswerSchema = baseIdeaProfileAnswerSchema.extend({
  id: z.number(),
  question: ideaProfileQuestionSchema,
})

export const createIdeaProfileAnswerRqSchema = baseIdeaProfileAnswerSchema
  .extend({
    questionId: z.int(),
  })
  .array()

export const updateIdeaProfileAnswerRqSchema = baseIdeaProfileAnswerSchema
  .extend({
    id: z.int(),
    questionId: z.int(),
  })
  .array()

export const fetchIdeaProfileQuestionRsSchema = z.object({
  data: z.array(ideaProfileQuestionSchema),
})
