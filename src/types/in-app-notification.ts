import type { z } from 'zod/v4'

import type {
  createInAppNotificationSchema,
  fetchInAppNotificationListRsSchema,
  fetchInAppNotificationQySchema,
} from '@/lib/schemas/in-app-notification'

export type FetchInAppNotificationQyDto = z.infer<typeof fetchInAppNotificationQySchema>
export type FetchInAppNotificationRsDto = z.infer<typeof fetchInAppNotificationListRsSchema>
export type CreateInAppNotificationRqDto = z.infer<typeof createInAppNotificationSchema>
