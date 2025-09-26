import type { z } from 'zod/v4'

import type { createParticipantRqSchema, fetchParticipantRsSchema, updateParticipantRqSchema } from '@/lib/schemas/client'

export type CreateParticipantRqDto = z.infer<typeof createParticipantRqSchema>
export type UpdateParticipantRqDto = z.infer<typeof updateParticipantRqSchema>
export type FetchParticipantRsDto = z.infer<typeof fetchParticipantRsSchema>
