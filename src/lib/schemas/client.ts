import { z } from 'zod/v4'

import { bareBatchSchemaWithInstitution } from './batch'
import { mobileNoSchema, passwordSchema } from './common'
import { bareCountrySchema, bareStateSchema } from './parameter'

export const GenderEnum = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const

export const createParticipantRqSchema = z.object({
  emailId: z.email(),
  password: passwordSchema,
  firstName: z
    .string()
    .min(3)
    .regex(/^[A-Za-z]+$/, { message: 'Must contain valid characters' })
    .max(50),
  lastName: z
    .string()
    .min(3)
    .regex(/^[A-Za-z]+$/, { message: 'Must contain valid characters' })
    .max(50),
  promoCode: z.string().optional(),
  tosAgreed: z.boolean(),
  showPassword: z.boolean().default(false).optional(),
  confirmPassword: z.string(),
})

export const baseParticipantSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  emailId: z.email(),
  mobileNo: z.union([mobileNoSchema, z.literal('')]).nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(GenderEnum).nullable(),
  countryId: z.union([z.string(), z.number()]).nullable(),
  stateId: z.union([z.string(), z.number()]).nullable(),
  city: z.string().max(100).nullable(),
})

export const participantSchema = baseParticipantSchema.extend({
  id: z.uuid(),
  displayId: z.string(),
  batchId: z.number().optional().nullable(),
  isActive: z.boolean(),
  verifiedDate: z.coerce.date().nullable(),
  lastPasswordChangeDate: z.coerce.date().nullable(),
  lastLoginAt: z.coerce.date().nullable(),
  lastLoginIp: z.string().nullable(),
  lastLoginUserAgent: z.string().nullable(),
  lastLoginProvider: z.string().nullable(),
  loginCount: z.int(),
  googleId: z.string().optional().nullable(),
  profilePicId: z.int().nullable(),
  batch: bareBatchSchemaWithInstitution.nullable(),
  tosAgreed: z.boolean(),
  tosAgreedDate: z.coerce.date().nullable(),
  state: bareStateSchema.nullable(),
  country: bareCountrySchema.nullable(),
})

export const bareParticipantSchema = participantSchema
  .pick({
    id: true,
    displayId: true,
    firstName: true,
    middleName: true,
    lastName: true,
    emailId: true,
  })
  .extend({ fullName: z.string().optional() })
  .transform((data) => {
    const fullName = [data.firstName, data.middleName, data.lastName]
      .filter((part) => part && part.trim().length > 0)
      .join(' ')
      .trim()
    return { ...data, fullName }
  })

export const fetchParticipantRsSchema = participantSchema.extend({
  completionPercentage: z.number().default(0),
})

export const updateParticipantRqSchema = baseParticipantSchema.extend({
  profilePicture: z.file().optional(),
  googleId: z.string().nullable().optional(),
})

export const updateParticipantRsSchema = fetchParticipantRsSchema
