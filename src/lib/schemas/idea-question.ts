import { z } from 'zod/v4'

import { QuestionGroupEnum } from '../enums'
import { ideaCollaborationSchema } from './idea-collaboration'

export const baseQuestionSchema = z.object({
  name: z.string().min(10),
  desc: z.string().min(10),
  subType: z.string().min(5).nullable(),
  priority: z.int().gte(1),
  minLength: z.int().gte(0).optional().nullable(),
  maxLength: z.int().gte(0).optional().nullable(),
})

export const baseQuestionGroupSchema = z.object({
  name: z.string().min(3).max(100),
  priority: z.int().gte(1),
  groupType: z.enum(QuestionGroupEnum),
})

export const questionSchema = baseQuestionSchema.extend({
  id: z.number(),
  group: baseQuestionGroupSchema,
})

export const baseParticipantAnswerSchema = z.object({
  answer: z.string().min(100),
})

export const participantAnswerSchema = baseParticipantAnswerSchema.extend({
  id: z.number(),
  question: questionSchema,
})

export const createParticipantIdeaAnswerRqSchema = baseParticipantAnswerSchema
  .extend({
    questionId: z.int(),
  })
  .array()

export const updateParticipantAnswerRqSchema = baseParticipantAnswerSchema
  .extend({
    id: z.int(),
    questionId: z.int(),
  })
  .array()

export const fetchQuestionRsSchema = z.object({
  data: z.array(questionSchema),
})

const answersSchema = z.object({
  id: z.int(),
  answer: z.string(),
  answeredAt: z.date(),
  collaborator: ideaCollaborationSchema.nullable(),
})

export const fetchParticipantIdeaAnswersRsSchema = z.object({
  id: z.int(),
  name: z.string(),
  priority: z.int(),
  questions: z.array(questionSchema.extend({ answer: answersSchema.optional().nullable() })),
})

export const fetchQuestionGroupListRsSchema = baseQuestionGroupSchema
  .extend({
    id: z.int(),
  })
  .array()

export const createParticipantAnswersRqSchema = z.object({
  data: z.array(
    z.object({
      id: z.int().optional(),
      questionId: z.int(),
      answerText: z.string(),
    }),
  ),
})

export const fetchQuestionGroupQySchema = z.object({
  group: z.enum(QuestionGroupEnum),
})
