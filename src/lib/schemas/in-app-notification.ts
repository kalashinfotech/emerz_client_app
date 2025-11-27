import { z } from 'zod/v4'

import { bareParticipantSchema } from './client'
import { paginationQySchema, paginationRsSchema, sortQySchema } from './common'
import { bareUserAccountSchema } from './user-account'

export const NotificationUserEnum = {
  PARTICIPANT: 'PARTICIPANT',
  FACULTY: 'FACULTY',
  ADMIN: 'ADMIN',
} as const

export type NotificationUserEnum = (typeof NotificationUserEnum)[keyof typeof NotificationUserEnum]

export const baseInAppNotificationSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(NotificationUserEnum),
  senderId: z.string().nullable(),
  senderType: z.enum(NotificationUserEnum).nullable(),
  type: z.string(),
  notification: z.string(),
  action: z.string().nullable(),
  target: z.string(),
  link: z.string().nullable(),
  meta: z.record(z.any(), z.any()).nullable(),
})

export const inAppNotificationSchema = baseInAppNotificationSchema.extend({
  id: z.number(),
  unread: z.boolean(),
  createdAt: z.date(),
})

export const createInAppNotificationSchema = baseInAppNotificationSchema.extend({
  action: z.string().optional(),
  senderId: z.string().optional(),
  senderType: z.enum(NotificationUserEnum).optional(),
  link: z.string().optional(),
  meta: z.record(z.any(), z.any()).optional(),
})

export const fetchInAppNotificationQySchema = z.object({ ...paginationQySchema.shape, ...sortQySchema.shape }).extend({
  unread: z.boolean().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
})

export const fetchInAppNotificationListSchema = inAppNotificationSchema.extend({
  sender: z.union([bareParticipantSchema, bareUserAccountSchema]).nullable(),
  recipient: z.union([bareParticipantSchema, bareUserAccountSchema]).nullable(),
})

export const fetchInAppNotificationListRsSchema = z.object({
  data: z.array(fetchInAppNotificationListSchema),
  pagination: paginationRsSchema,
})
