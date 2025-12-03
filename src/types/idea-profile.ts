import type { z } from 'zod/v4'

import type { fetchQuestionRsSchema } from '@/lib/schemas/idea-question'

export type FetchIdeaProfileQuestionRsDto = z.infer<typeof fetchQuestionRsSchema>
