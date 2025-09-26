import { z } from 'zod/v4'

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Add at least one uppercase letter')
  .regex(/[a-z]/, 'Add at least one lowercase letter')
  .regex(/[0-9]/, 'Add at least one digit')
  .regex(/[^A-Za-z0-9]/, 'Add at least one special character')
  .refine((s) => !/\s/.test(s), { message: 'Password must not contain spaces' })
  .refine((s) => !/(.)\1\1/.test(s), { message: 'Password must not contain the same character 3+ times in a row' })

export const isoDatetimeToDate = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
})

// Regex explanation:
// ^(\+91|91)?        -> optional +91 or 91 prefix
// [6-9]              -> first digit must be 6,7,8,9
// \d{9}$             -> followed by 9 more digits (total 10)
const mobileNoRegex = /^(\+91|91)?[6-9]\d{9}$/
export const mobileNoSchema = z.string().regex(mobileNoRegex, 'Invalid mobile number format.')
