import type { z } from 'zod/v4'

import type {
  createIdeaInvitesRqSchema,
  createIdeaRqSchema,
  fetchIdeaActivityRsSchema,
  fetchIdeaQySchema,
  fetchIdeaRsSchema,
  fetchMyIdeaListRsSchema,
  ideaActivitySchema,
  ideaSchema,
  updateIdeaRqSchema,
} from '@/lib/schemas/idea'

export type CreateIdeaRqDto = z.infer<typeof createIdeaRqSchema>
export type UpdateIdeaRqDto = z.infer<typeof updateIdeaRqSchema>
export type FetchIdeaQyDto = z.infer<typeof fetchIdeaQySchema>
export type FetchMyIdeaListRsDto = z.infer<typeof fetchMyIdeaListRsSchema>
export type FetchIdeaRsDto = z.infer<typeof fetchIdeaRsSchema>
export type CreateIdeaInvitesRqDto = z.infer<typeof createIdeaInvitesRqSchema>
export type IdeaModel = z.infer<typeof ideaSchema>
export type FetchIdeaActivityRsDto = z.infer<typeof fetchIdeaActivityRsSchema>
export type IdeaActivityModel = z.infer<typeof ideaActivitySchema>
