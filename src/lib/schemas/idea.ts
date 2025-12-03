import { z } from 'zod/v4'

import { paginationQySchema, paginationRsSchema, sortQySchema } from '@/lib/schemas/common'

import { IdeaActionEnum, IdeaStageEnum, IdeaStatusEnum } from '../enums'
import { bareParticipantSchema, baseParticipantSchema } from './client'
import { bareCollaboratorSchema, ideaCollaborationSchema } from './idea-collaboration'
import {
  createParticipantIdeaAnswerRqSchema,
  participantAnswerSchema,
  updateParticipantAnswerRqSchema,
} from './idea-question'
import { bareUserAccountSchema } from './user-account'

export const baseIdeaActivitySchema = z.object({
  ideaId: z.uuid(),
  response: z.string().optional(),
  action: z.enum(IdeaActionEnum),
})

export const ideaActivitySchema = baseIdeaActivitySchema.extend({
  id: z.number(),
  userId: z.string().optional(),
  collaboratorId: z.number().optional(),
  updatedAt: z.string(),
  oldStage: z.enum(IdeaStageEnum).optional(),
  oldStatus: z.enum(IdeaStatusEnum).optional(),
  newStage: z.enum(IdeaStageEnum).optional(),
  newStatus: z.enum(IdeaStatusEnum).optional(),
  user: bareUserAccountSchema.optional(),
  collaborator: bareCollaboratorSchema.optional(),
  notificationText: z.string(),
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
  answers: createParticipantIdeaAnswerRqSchema,
})

export const updateIdeaRqSchema = baseIdeaSchema.extend({
  answers: updateParticipantAnswerRqSchema,
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
  answers: z.array(participantAnswerSchema).nullable(),
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

export const bareIdeaProfileQuestionSchema = ideaProfileQuestionSchema.pick({
  id: true,
  priority: true,
  name: true,
  desc: true,
  minLength: true,
  maxLength: true,
})

export const fetchIdeaActivityRsSchema = z.array(ideaActivitySchema)
