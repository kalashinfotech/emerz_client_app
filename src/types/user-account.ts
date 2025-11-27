import type { z } from 'zod/v4'

import type { bareUserAccountSchema } from '@/lib/schemas/user-account'

export type BareUserAccountModel = z.infer<typeof bareUserAccountSchema>
