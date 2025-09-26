import type { z } from 'zod/v4'

import type {
  createBivrAnswersRqSchema,
  fetchBivrAnswersRsSchema,
  fetchBivrGroupListRsSchema,
} from '@/lib/schemas/idea-bivr'

export type FetchBivrAnswerRsDto = z.infer<typeof fetchBivrAnswersRsSchema>
export type FetchBivrGroupListRsDto = z.infer<typeof fetchBivrGroupListRsSchema>
export type CreateBivrAnswerRqDto = z.infer<typeof createBivrAnswersRqSchema>
