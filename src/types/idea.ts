import type { z } from 'zod/v4'

import type {
  createIdeaInvitesRqSchema,
  createIdeaRqSchema,
  fetchIdeaActivityHistoryRsSchema,
  fetchIdeaActivityListRsSchema,
  fetchIdeaQySchema,
  fetchIdeaRsSchema,
  fetchMyIdeaListRsSchema,
  ideaActivitySchema,
  updateIdeaRqSchema,
} from '@/lib/schemas/idea'
import type { fetchCollaboratorRsSchema } from '@/lib/schemas/idea-collaboration'

export type CreateIdeaRqDto = z.infer<typeof createIdeaRqSchema>
export type UpdateIdeaRqDto = z.infer<typeof updateIdeaRqSchema>
export type FetchIdeaQyDto = z.infer<typeof fetchIdeaQySchema>
export type FetchMyIdeaListRsDto = z.infer<typeof fetchMyIdeaListRsSchema>
export type FetchIdeaRsDto = z.infer<typeof fetchIdeaRsSchema>
export type CreateIdeaInvitesRqDto = z.infer<typeof createIdeaInvitesRqSchema>
export type IdeaModel = z.infer<typeof fetchIdeaRsSchema>
export type FetchIdeaActivityListRsDto = z.infer<typeof fetchIdeaActivityListRsSchema>
export type FetchIdeaAnswerHistoryRsDto = z.infer<typeof fetchIdeaActivityHistoryRsSchema>
export type IdeaActivityModel = z.infer<typeof ideaActivitySchema>

export type FetchCollaboratorRsDto = z.infer<typeof fetchCollaboratorRsSchema>
