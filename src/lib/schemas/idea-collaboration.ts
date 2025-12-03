import { z } from 'zod/v4'

import { CollaboratorStatus } from '../enums'
import { bareParticipantSchema } from './client'

const baseIdeaCollaborationSchema = z.object({
  designation: z.string().optional(),
  emailId: z.email(),
  invitedById: z.uuid(),
})

// NOTE: defining here again to avoid circular dependency issue
const participantAnswerSchema = z.object({
  answer: z.string(),
  id: z.number(),
  question: z.object({
    id: z.number(),
    name: z.string(),
    desc: z.string().min(10),
    subType: z.string().min(5).nullable(),
    priority: z.int().gte(1),
    minLength: z.int().gte(0).optional().nullable(),
    maxLength: z.int().gte(0).optional().nullable(),
  }),
})

const bareIdeaForCollabSchema = z.object({
  id: z.uuid(),
  title: z.string().min(10).max(100),
  displayId: z.string(),
  answers: z.array(participantAnswerSchema).nullable(),
})

export const ideaCollaborationSchema = baseIdeaCollaborationSchema.extend({
  id: z.number(),
  participantId: z.uuid().optional(),
  participant: bareParticipantSchema.optional(),
  status: z.enum(CollaboratorStatus),
  invitedAt: z.date(),
  acceptedAt: z.date().nullable(),
  idea: bareIdeaForCollabSchema.nullable(),
  invitedBy: bareParticipantSchema.optional(),
})

export const bareCollaboratorSchema = ideaCollaborationSchema.pick({
  id: true,
  participant: true,
  participantId: true,
  designation: true,
})

export const fetchCollaboratorRsSchema = ideaCollaborationSchema.extend({})
