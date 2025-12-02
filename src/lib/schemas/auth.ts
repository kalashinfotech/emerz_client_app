import { z } from 'zod/v4'

import { passwordSchema } from './common'

export const signInRqSchema = z.object({
  emailId: z.email(),
  password: z.string(),
  rememberMe: z.boolean(),
})

export const changePasswordRqSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
})
