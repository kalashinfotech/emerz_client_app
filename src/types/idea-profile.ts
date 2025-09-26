import type { z } from 'zod/v4'

import type { fetchIdeaProfileQuestionRsSchema } from '@/lib/schemas/idea-profile'

export type FetchIdeaProfileQuestionRsDto = z.infer<typeof fetchIdeaProfileQuestionRsSchema>
