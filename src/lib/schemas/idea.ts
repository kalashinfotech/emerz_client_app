import { z } from 'zod/v4'

import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { bareParticipantSchema, baseParticipantSchema } from './client'
import { createIdeaProfileAnswerRqSchema, ideaProfileAnswerSchema, updateIdeaProfileAnswerRqSchema } from './idea-profile'

export const IdeaStageEnum = {
  STAGE_0: 'STAGE_0',
  STAGE_1: 'STAGE_1',
  STAGE_2: 'STAGE_2',
  STAGE_3: 'STAGE_3',
} as const

export type IdeaStageEnum = (typeof IdeaStageEnum)[keyof typeof IdeaStageEnum]

export const IdeaStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  COACH_PENDING: 'COACH_PENDING',
  COACH_REVIEW: 'COACH_REVIEW',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const

export type IdeaStatusEnum = (typeof IdeaStatusEnum)[keyof typeof IdeaStatusEnum]

export const CollaboratorStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ACCEPTED_SHADOW: 'ACCEPTED_SHADOW',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
} as const

export type CollaboratorStatus = (typeof CollaboratorStatus)[keyof typeof CollaboratorStatus]

const baseIdeaCollaborationSchema = z.object({
  designation: z.string().optional(),
  emailId: z.email(),
})

export const ideaCollaborationSchema = baseIdeaCollaborationSchema.extend({
  id: z.number(),
  participantId: z.uuid().optional(),
  participant: bareParticipantSchema.optional(),
  status: z.enum(CollaboratorStatus),
  invitedAt: z.date(),
  acceptedAt: z.date().nullable(),
})

const baseIdeaSchema = z.object({
  title: z
    .string()
    // TODO: think of a better regex
    .regex(/^[\p{L}\p{N}\p{M}_\-: ]+$/u, 'Title can only contain letters, numbers, spaces, underscore, dash and colon')
    .min(10, { message: 'Title should be minimum 10 characters' })
    .max(100),
  desc: z.string().optional(),
})

export const createIdeaRqSchema = baseIdeaSchema.extend({
  invites: z.array(z.email()),
  answers: createIdeaProfileAnswerRqSchema,
})

export const updateIdeaRqSchema = baseIdeaSchema.extend({
  answers: updateIdeaProfileAnswerRqSchema,
})

export const ideaSchema = baseIdeaSchema.extend({
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdById: z.uuid().nullable(),
  createdBy: bareParticipantSchema,
  stage: z.enum(IdeaStageEnum),
  status: z.enum(IdeaStatusEnum),
  ownerId: z.uuid(),
  owner: bareParticipantSchema,
  collaborators: z.array(ideaCollaborationSchema).nullable(),
  answers: z.array(ideaProfileAnswerSchema).nullable(),
})
export const bareIdeaSchema = ideaSchema.pick({ id: true, title: true })

export const fetchIdeaRsSchema = ideaSchema

export const fetchIdeaListRsSchema = z.object({
  data: z.array(ideaSchema),
  pagination: paginationRsSchema,
})

export const fetchIdeaQySchema = z.object({ ...paginationQySchema.shape, ...sortQySchema.shape }).extend({
  name: z.string().optional(),
  stage: z.enum(IdeaStageEnum).optional(),
  status: z.enum(IdeaStatusEnum).optional(),
  search: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  ownedOnly: z.coerce.boolean(),
})

export const acceptIdeaRsSchema = z.object({
  emailId: z.email(),
  message: z.string(),
})

export const listIdeaSchema = baseIdeaSchema.extend({
  id: z.uuid(),
  displayId: z.string(),
  createdAt: z.date(),
  isOwner: z.boolean(),
  owner: baseParticipantSchema,
})

export const fetchMyIdeaListRsSchema = z.object({
  data: z.array(listIdeaSchema),
  pagination: paginationRsSchema,
})

export const createIdeaInvitesRqSchema = z.object({
  invites: z.array(z.email()).min(1),
})

export const baseIdeaProfileQuestionSchema = z.object({
  name: z.string().min(10),
  desc: z.string().min(10).optional(),
  priority: z.int().gte(1).optional(),
  minLength: z.int().gte(0).optional().nullable(),
  maxLength: z.int().gte(0).optional().nullable(),
})

export const ideaProfileQuestionSchema = baseIdeaProfileQuestionSchema.extend({
  id: z.int(),
})

export const createIdeaProfileQuestionRqSchema = baseIdeaProfileQuestionSchema.extend({})

export const bareIdeaProfileQuestionSchema = ideaProfileQuestionSchema.pick({
  id: true,
  priority: true,
  name: true,
  desc: true,
  minLength: true,
  maxLength: true,
})
