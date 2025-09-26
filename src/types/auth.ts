import type { z } from 'zod/v4'

import type { changePasswordRqSchema, signInRqSchema } from '@/lib/schemas/auth'
import type { fetchParticipantRsSchema } from '@/lib/schemas/client'

export type SignInRq = z.infer<typeof signInRqSchema>
export type SessionInfo = z.infer<typeof fetchParticipantRsSchema>

export type SignInRs = {
  status?: number
  error?: string
}

export type ChangePasswordRq = z.infer<typeof changePasswordRqSchema>
